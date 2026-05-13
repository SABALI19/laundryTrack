import Button from "../components/Button";
import QuickActions from "../layouts/staffdashboard/QuickActions.jsx";
import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Cog,
  Mail,
  MessageSquare,
  PackageCheck,
  Phone,
  Plus,
  Printer,
  ScanSearch,
  Search,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import useStaffPickupSchedule from "../hooks/useStaffPickupSchedule.js";
import {
  overduePickups as fallbackOverduePickups,
  pickupScheduleTotalScheduled,
  scheduleSections as fallbackScheduleSections,
} from "./pickupScheduleData.js";

// ─── Stat card → filter key map ───────────────────────────────────────────────
// Clicking a stat card jumps to the matching order filter.
const STAT_CARD_FILTER_MAP = {
  scheduled: "all",
  completed: "ready",
  remaining: "preparing",
  current:   null,   // "Current Slot" has no order-filter meaning
};

// ─── Order filter definitions ─────────────────────────────────────────────────
const ORDER_FILTERS = [
  { key: "all",       label: "All" },
  { key: "ready",     label: "Ready",     match: (o) => /ready/i.test(o.status) },
  { key: "preparing", label: "Preparing", match: (o) => /preparing|in.?process|washing|drying/i.test(o.status) },
  { key: "overdue",   label: "Overdue" },
];

const matchesSearch = (order, query) => {
  if (!query) return true;
  const q = query.toLowerCase();
  return (
    String(order.id       || "").toLowerCase().includes(q) ||
    String(order.customer || "").toLowerCase().includes(q)
  );
};

const applyFiltersToSection = (section, filterKey, searchQuery, overdueIds) => {
  const filter = ORDER_FILTERS.find((f) => f.key === filterKey);
  const orders = section.orders.filter((order) => {
    if (!matchesSearch(order, searchQuery)) return false;
    if (filterKey === "all")     return true;
    if (filterKey === "overdue") return overdueIds.has(String(order.id));
    return filter?.match?.(order) ?? true;
  });
  return { ...section, orders };
};

// ─── Button style helpers ─────────────────────────────────────────────────────
const activePrimaryBtn =
  "bg-[#2c4a7d] text-white shadow-[inset_0_2px_6px_rgba(0,0,0,0.18)] scale-[0.97]";
const activeHeaderControlBtn =
  "border-[var(--color-primary)] bg-[var(--color-primary)] text-white shadow-[inset_0_2px_6px_rgba(0,0,0,0.18)] scale-[0.97]";

// ─── Static data ──────────────────────────────────────────────────────────────
const fallbackStatCards = [
  { id: "scheduled", label: "Total Scheduled", value: pickupScheduleTotalScheduled, Icon: CalendarDays },
  { id: "completed",  label: "Completed",        value: 7,           Icon: CheckCircle2 },
  { id: "remaining",  label: "Remaining",         value: 11,          Icon: Clock3       },
  { id: "current",    label: "Current Slot",      value: "Afternoon", Icon: PackageCheck },
];

const quickActions = [
  { id: "check-in",     label: "Check In Customer",  variant: "primary",   Icon: ScanSearch },
  { id: "manual-entry", label: "Manual Pickup Entry", variant: "secondary", Icon: Search     },
  { id: "print",        label: "Print Pickup List",   variant: "secondary", Icon: Printer    },
];

const fallbackCapacitySlots = [
  { id: "morning",   label: "Morning",   capacity: 8  },
  { id: "afternoon", label: "Afternoon", capacity: 10 },
  { id: "evening",   label: "Evening",   capacity: 6  },
];

const getTodayDateValue = () => new Date().toISOString().split("T")[0];

// ─── Pure data helpers ────────────────────────────────────────────────────────
const pickFirstNumber = (...values) => {
  for (const v of values) {
    const n = Number(v);
    if (Number.isFinite(n) && n >= 0) return n;
  }
  return null;
};

const parseCapacityFromText = (value) => {
  const m = String(value || "").match(/(\d+)\s*(?:of|\/)\s*(\d+)/i);
  if (!m) return { capacity: null, filled: null };
  return { filled: Number(m[1]), capacity: Number(m[2]) };
};

const getSlotLabel = (value, index) => {
  const s = String(value || "").replace(/\s*slot\s*\(.*/i, "").replace(/\s*\(.*/i, "").trim();
  return s || `Slot ${index + 1}`;
};

const fallbackCapacityMap = new Map(
  fallbackCapacitySlots.map((sl) => [sl.label.toLowerCase(), sl.capacity]),
);

const normalizeCapacitySlot = (slot, index) => {
  const label   = getSlotLabel(slot.label || slot.name || slot.slotLabel || slot.title, index);
  const parsed  = parseCapacityFromText(slot.fillText || slot.utilizationText);
  const filled  = pickFirstNumber(slot.filledSlots, slot.filled, slot.scheduledCount, slot.usedSlots, slot.orders?.length, parsed.filled, 0);
  const capacity = pickFirstNumber(slot.capacity, slot.totalSlots, slot.slotCapacity, slot.maxCapacity, parsed.capacity, fallbackCapacityMap.get(label.toLowerCase()), filled, 0);
  const available = Math.max(pickFirstNumber(slot.availableSlots, slot.openSlots, slot.remainingSlots, capacity - filled, 0), 0);
  const isBlocked = Boolean(slot.isBlocked || slot.blocked || /blocked/i.test(String(slot.statusText || slot.status || slot.blockedText || "")));
  const isCurrent = Boolean(slot.isCurrent || /current/i.test(String(slot.statusText || slot.status || "")));
  let statusLabel = `${available} slots open`;
  if (isBlocked)                        statusLabel = "Blocked";
  else if (isCurrent)                   statusLabel = "Current slot";
  else if (capacity > 0 && filled >= capacity) statusLabel = "Full";
  else if (available === 1)             statusLabel = "1 slot open";
  return {
    id: slot.id || slot.key || label.toLowerCase().replace(/\s+/g, "-"),
    label, filled, capacity, available,
    utilization: capacity > 0 ? Math.min(Math.round((filled / capacity) * 100), 100) : 0,
    statusLabel, isBlocked, isCurrent,
    blockReason: String(slot.blockReason || slot.blockText || slot.blockedText || "").trim(),
  };
};

const mergePickupSections = (live = [], fallback = []) => {
  const map = new Map();
  [...live, ...fallback].forEach((section) => {
    const key = section.id || section.title;
    const existing = map.get(key);
    if (existing) { existing.orders.push(...section.orders); return; }
    map.set(key, { ...section, orders: [...section.orders] });
  });
  return Array.from(map.values());
};

const buildFallbackSchedule = () => ({
  generatedAt: new Date().toISOString(),
  overduePickups: fallbackOverduePickups.map((p) => ({ ...p, contactEmail: "", contactPhone: "" })),
  selectedDate: new Date().toISOString(),
  statCards: fallbackStatCards,
  scheduleSections: fallbackScheduleSections,
  capacityManagement: { slots: fallbackCapacitySlots, specialHoursLabel: "" },
});

const mergePickupScheduleData = (live) => {
  const fb = buildFallbackSchedule();
  return {
    generatedAt: live?.generatedAt || fb.generatedAt,
    overduePickups: [...(live?.overduePickups || []), ...fb.overduePickups],
    selectedDate: live?.selectedDate || fb.selectedDate,
    statCards: live?.statCards?.length > 0
      ? live.statCards.map((c) => ({ ...c, Icon: fallbackStatCards.find((f) => f.id === c.id)?.Icon }))
      : fb.statCards,
    scheduleSections: mergePickupSections(live?.scheduleSections || [], fb.scheduleSections),
    capacityManagement: live?.capacityManagement || fb.capacityManagement,
  };
};

const getContactPhone  = (p) => String(p.contactPhone || p.phone        || p.customerPhone || "").trim();
const getContactEmail  = (p) => String(p.contactEmail || p.email        || p.customerEmail || "").trim();
const getDialablePhone = (v) => {
  const raw = String(v || "").trim();
  if (!raw) return "";
  const digits = raw.replace(/\D/g, "");
  return digits ? (raw.startsWith("+") ? `+${digits}` : digits) : "";
};
const getContactSummary = (p) => [getContactPhone(p), getContactEmail(p)].filter(Boolean).join(" | ");
const getCustomerContactActions = (p) => {
  const phone = getDialablePhone(getContactPhone(p));
  const email = getContactEmail(p);
  const actions = [];
  if (phone) {
    actions.push({ id: "call",  href: `tel:${phone}`,     label: "Call",  Icon: Phone         });
    actions.push({ id: "text",  href: `sms:${phone}`,     label: "Text",  Icon: MessageSquare });
  }
  if (email) actions.push({ id: "email", href: `mailto:${email}`, label: "Email", Icon: Mail });
  return actions;
};
const launchContactAction = (href) => { if (href && typeof window !== "undefined") window.location.href = href; };

const buildCapacitySummary = (raw, resolved) => {
  const rawSlots = Array.isArray(raw?.capacityManagement?.slots)
    ? raw.capacityManagement.slots
    : resolved.scheduleSections;
  const slots        = rawSlots.map(normalizeCapacitySlot);
  const totalCapacity  = slots.reduce((s, sl) => s + sl.capacity,  0);
  const totalFilled    = slots.reduce((s, sl) => s + sl.filled,    0);
  const totalAvailable = slots.reduce((s, sl) => s + sl.available, 0);
  const blockedSlots   = slots.filter((sl) => sl.isBlocked);
  const currentSlot    = slots.find((sl) => sl.isCurrent);
  const specialHours   = raw?.capacityManagement?.specialHours;
  const specialHoursLabel = String(raw?.capacityManagement?.specialHoursLabel || raw?.capacityManagement?.specialHoursText || "").trim();
  return {
    slots, totalCapacity, totalFilled, totalAvailable, blockedSlots,
    currentSlotLabel: currentSlot?.label || "No active slot",
    utilization: totalCapacity > 0 ? Math.round((totalFilled / totalCapacity) * 100) : 0,
    blockSummary:
      String(raw?.capacityManagement?.blockSummary || raw?.capacityManagement?.blockText || "").trim() ||
      (blockedSlots.length > 0
        ? `${blockedSlots.length} pickup window${blockedSlots.length > 1 ? "s are" : " is"} currently blocked.`
        : "All pickup windows are currently open to new bookings."),
    specialHoursText:
      specialHoursLabel ||
      (Array.isArray(specialHours) && specialHours.length > 0
        ? specialHours.map((e) => String(e.label || e.text || e.name || "").trim()).filter(Boolean).join(", ")
        : "No special-hour overrides are scheduled for this date."),
    syncedAt: raw?.capacityManagement?.updatedAt || resolved.generatedAt,
  };
};

// ─── OverdueCarousel ──────────────────────────────────────────────────────────
const OverdueCarousel = ({ pickups }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef   = useRef(null);
  const isDragging  = useRef(false);
  const startX      = useRef(0);
  const scrollStart = useRef(0);

  const scrollToIndex = (index) => {
    const el = scrollRef.current;
    if (!el) return;
    const clamped = Math.min(Math.max(index, 0), pickups.length - 1);
    el.children[clamped]?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
    setActiveIndex(clamped);
  };

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el || pickups.length === 0) return;
    const cards   = Array.from(el.children);
    const closest = cards.reduce((best, card, i) =>
      Math.abs(card.offsetLeft - el.scrollLeft) < Math.abs(cards[best].offsetLeft - el.scrollLeft) ? i : best, 0);
    setActiveIndex(closest);
  };

  const onPointerDown  = (e) => { isDragging.current = true; startX.current = e.clientX; scrollStart.current = scrollRef.current?.scrollLeft ?? 0; scrollRef.current?.setPointerCapture(e.pointerId); };
  const onPointerMove  = (e) => { if (!isDragging.current) return; if (scrollRef.current) scrollRef.current.scrollLeft = scrollStart.current + (startX.current - e.clientX); };
  const onPointerUp    = (e) => {
    if (!isDragging.current) return;
    isDragging.current = false;
    const delta     = startX.current - e.clientX;
    const cardWidth = scrollRef.current?.firstElementChild?.offsetWidth ?? 0;
    scrollToIndex(Math.abs(delta) > cardWidth * 0.2 ? activeIndex + (delta > 0 ? 1 : -1) : activeIndex);
  };

  if (pickups.length === 0) return (
    <p className="mt-4 text-[0.78rem] text-[var(--color-primary)] opacity-70">No overdue pickups match the current filter.</p>
  );

  return (
    <div className="mt-4 w-full min-w-0">
      <div className="w-full overflow-hidden rounded-[0.75rem]">
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          className="flex w-full snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain pb-1 cursor-grab active:cursor-grabbing select-none [touch-action:pan-x] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {pickups.map((pickup) => {
            const actions        = getCustomerContactActions(pickup);
            const contactSummary = getContactSummary(pickup);
            return (
              <article
                key={`${pickup.id}-${pickup.scheduledDate}`}
                className="w-full shrink-0 snap-center snap-always rounded-[0.85rem] bg-white p-4 shadow-[0_4px_16px_rgba(15,23,42,0.06)]"
              >
                <div className="flex flex-wrap items-start gap-2">
                  <h3 className="text-[0.95rem] font-semibold text-slate-900">#{pickup.id}</h3>
                  <span className="text-[0.84rem] text-slate-500">- {pickup.customer}</span>
                </div>
                <p className="mt-3 text-[0.78rem] leading-5 text-slate-500">Originally scheduled: {pickup.scheduledDate}</p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-[#f7dada] px-2.5 py-1 text-[0.72rem] font-semibold text-[var(--color-primary)]">
                    {pickup.overdueText}
                  </span>
                  <span className="text-[0.78rem] text-slate-600">{pickup.items} items</span>
                </div>
                {contactSummary && <p className="mt-3 text-[0.76rem] text-slate-500 break-all">{contactSummary}</p>}
                <div className="mt-4 flex flex-wrap gap-2">
                  {actions.length > 0 ? (
                    actions.map((action, i) => (
                      <Button
                        key={`${pickup.id}-${action.id}`}
                        variant={i === 0 ? "primary" : "secondary"}
                        size="md"
                        onClick={() => launchContactAction(action.href)}
                        className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-[0.78rem] font-semibold transition-all duration-150 active:scale-[0.97]"
                      >
                        <action.Icon className="h-3.5 w-3.5 shrink-0" />
                        <span className="whitespace-nowrap">{action.label}</span>
                      </Button>
                    ))
                  ) : (
                    <span className="text-[0.78rem] font-medium text-slate-400">Contact unavailable</span>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {pickups.length > 1 && (
        <div className="mt-3 flex justify-center gap-1.5">
          {pickups.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to pickup ${i + 1}`}
              onClick={() => scrollToIndex(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === activeIndex ? "w-5 bg-[var(--color-primary)]" : "w-1.5 bg-[rgba(44,74,125,0.3)] hover:bg-[rgba(44,74,125,0.5)]"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// ─── PickupSchedule ───────────────────────────────────────────────────────────
const PickupSchedule = () => {
  const todayValue = getTodayDateValue();

  // date
  const [selectedDate, setSelectedDate] = useState(todayValue);
  const dateInputRef = useRef(null);

  // panel toggles
  const [showSlotsPanel,    setShowSlotsPanel]    = useState(false);
  const [activeQuickAction, setActiveQuickAction] = useState(null);
  const [showSearch,        setShowSearch]        = useState(false);
  const [searchQuery,       setSearchQuery]       = useState("");
  const searchInputRef = useRef(null);
  const quickActionResetTimeoutRef = useRef(null);

  // order filter
  const [activeFilter,   setActiveFilter]   = useState("all");
  const [pickedUpOrders, setPickedUpOrders] = useState(new Set());

  // data
  const { pickupSchedule, isLoading, error } = useStaffPickupSchedule(selectedDate);
  const resolved = useMemo(() => mergePickupScheduleData(pickupSchedule), [pickupSchedule]);
  const capacity = useMemo(() => buildCapacitySummary(pickupSchedule, resolved), [pickupSchedule, resolved]);

  // set of overdue order IDs for O(1) lookup and badge on order cards
  const overdueIds = useMemo(
    () => new Set(resolved.overduePickups.map((p) => String(p.id))),
    [resolved.overduePickups],
  );

  // filtered schedule sections (empty sections are removed)
  const filteredSections = useMemo(
    () => resolved.scheduleSections
      .map((section) => applyFiltersToSection(section, activeFilter, searchQuery, overdueIds))
      .filter((section) => section.orders.length > 0),
    [resolved.scheduleSections, activeFilter, searchQuery, overdueIds],
  );

  // overdue carousel respects search; only visible on "all" or "overdue" filter
  const filteredOverdue = useMemo(() => {
    if (activeFilter !== "all" && activeFilter !== "overdue") return [];
    return resolved.overduePickups.filter((p) => matchesSearch(p, searchQuery));
  }, [resolved.overduePickups, activeFilter, searchQuery]);

  // total visible order count shown in filter pills
  const totalVisible = useMemo(
    () => filteredSections.reduce((sum, s) => sum + s.orders.length, 0) + filteredOverdue.length,
    [filteredSections, filteredOverdue],
  );

  const isToday          = selectedDate === todayValue;
  const isDatePickerActive = !isToday;

  // ── handlers ─────────────────────────────────────────────────────────────────
  const handleFilterChange = (key) => { setActiveFilter(key); setSearchQuery(""); };

  const handleStatCardClick = (cardId) => {
    const key = STAT_CARD_FILTER_MAP[cardId];
    if (key) handleFilterChange(key);
  };

  const handleMarkPickedUp = (orderId) => {
    setPickedUpOrders((prev) => {
      const next = new Set(prev);
      next.has(orderId) ? next.delete(orderId) : next.add(orderId);
      return next;
    });
  };

  const handleQuickAction = (actionId) => {
    if (quickActionResetTimeoutRef.current) {
      clearTimeout(quickActionResetTimeoutRef.current);
      quickActionResetTimeoutRef.current = null;
    }

    if (actionId === "check-in") {
      setActiveFilter("ready");
      setShowSearch(true);
      setActiveQuickAction(actionId);
      setTimeout(() => searchInputRef.current?.focus(), 50);
      return;
    }

    if (actionId === "manual-entry") {
      const next = !showSearch;
      setActiveFilter("all");
      setShowSearch(next);
      setActiveQuickAction(next ? actionId : null);
      if (next) setTimeout(() => searchInputRef.current?.focus(), 50);
      return;
    }

    if (actionId === "print") {
      setActiveQuickAction(actionId);
      if (typeof window !== "undefined") {
        window.print();
      }
      quickActionResetTimeoutRef.current = setTimeout(() => {
        setActiveQuickAction((prev) => (prev === actionId ? null : prev));
        quickActionResetTimeoutRef.current = null;
      }, 300);
      return;
    }

    setActiveQuickAction((prev) => (prev === actionId ? null : actionId));
  };

  useEffect(() => {
    return () => {
      if (quickActionResetTimeoutRef.current) {
        clearTimeout(quickActionResetTimeoutRef.current);
      }
    };
  }, []);

  // ── render ────────────────────────────────────────────────────────────────────
  return (
    <section className="mx-auto w-full min-w-0 max-w-[1500px] overflow-x-hidden px-4 sm:px-6 lg:px-8">
      <div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1fr)_300px] xl:gap-8 xl:items-start">

        {/* ────────── Main column ────────── */}
        <div className="min-w-0 w-full overflow-hidden space-y-5 sm:space-y-6">

          {/* Header */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
            <div className="min-w-0">
              <h1 className="text-[1.35rem] font-semibold tracking-[-0.03em] text-[#2c4a7d] sm:text-[1.6rem]">
                Pickup Schedule
              </h1>
              <p className="mt-1 text-[0.76rem] text-slate-500 sm:text-[0.8rem]">
                Workflow-synced schedule for {selectedDate}
              </p>
            </div>

            <div className="flex flex-wrap gap-2 sm:shrink-0 sm:items-center">
              {/* Today */}
              <button
                type="button"
                onClick={() => setSelectedDate(todayValue)}
                className={`inline-flex items-center rounded-xl px-3 py-2 text-[0.72rem] font-semibold transition-all duration-150 sm:px-4 sm:text-[0.8rem] ${
                  isToday ? activePrimaryBtn : "bg-[#2c4a7d] text-white hover:bg-[#243f6b] active:scale-[0.97]"
                }`}
              >
                Today
              </button>

              {/* Date Picker */}
              <button
                type="button"
                onClick={() => { dateInputRef.current?.showPicker?.(); dateInputRef.current?.click(); }}
                className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-[0.72rem] font-medium transition-all duration-150 sm:gap-2 sm:px-4 sm:text-[0.8rem] ${
                  isDatePickerActive ? activeHeaderControlBtn : "border-slate-200 bg-white text-slate-700 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] active:scale-[0.97]"
                }`}
              >
                <CalendarDays className="h-3.5 w-3.5 shrink-0" />
                <span>Date Picker</span>
              </button>

              {/* Manage Time Slots */}
              <button
                type="button"
                onClick={() => setShowSlotsPanel((v) => !v)}
                className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-[0.72rem] font-medium transition-all duration-150 sm:gap-2 sm:px-4 sm:text-[0.8rem] ${
                  showSlotsPanel ? activeHeaderControlBtn : "border-slate-200 bg-white text-slate-700 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] active:scale-[0.97]"
                }`}
              >
                <Cog className={`h-3.5 w-3.5 shrink-0 transition-transform duration-300 ${showSlotsPanel ? "rotate-90" : ""}`} />
                <span className="sm:hidden">Slots</span>
                <span className="hidden sm:inline">Manage Time Slots</span>
              </button>

              <input
                ref={dateInputRef}
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="sr-only"
              />
            </div>
          </div>

          {/* Slots panel */}
          {showSlotsPanel && (
            <div className="rounded-[1.15rem] bg-white p-4 shadow-[0_6px_20px_rgba(15,23,42,0.06)] ring-1 ring-slate-100 sm:p-5">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-[0.95rem] font-semibold text-slate-900 sm:text-[1rem]">Time Slot Capacity</h3>
                <span className="rounded-full bg-[var(--color-primary-soft)] px-3 py-1 text-[0.72rem] font-semibold text-[var(--color-primary)]">
                  {capacity.utilization}% used
                </span>
              </div>
              <div className="mt-4 space-y-3">
                {capacity.slots.map((slot) => (
                  <div key={slot.id} className="rounded-[0.85rem] border border-slate-100 p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-[0.85rem] font-semibold text-slate-900">{slot.label}</p>
                        <p className="mt-0.5 text-[0.7rem] text-slate-500">{slot.statusLabel}</p>
                      </div>
                      <p className="shrink-0 text-[0.85rem] font-semibold text-[var(--color-primary)]">
                        {slot.filled}/{slot.capacity}
                      </p>
                    </div>
                    <div className="mt-3 h-2 rounded-full bg-[var(--color-primary-soft)]">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${slot.isBlocked ? "bg-slate-400" : "bg-[var(--color-primary)]"}`}
                        style={{ width: `${slot.utilization}%` }}
                      />
                    </div>
                    {slot.blockReason && <p className="mt-2 text-[0.7rem] text-slate-500">{slot.blockReason}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {error    && <div className="rounded-[1rem] bg-red-50 px-4 py-3 text-[0.82rem] text-red-600">{error}</div>}
          {isLoading && <div className="rounded-[1rem] bg-white px-4 py-4 text-[0.82rem] text-slate-500 shadow-[0_6px_20px_rgba(15,23,42,0.06)] ring-1 ring-slate-100">Loading pickup schedule...</div>}

          {/* Past Due Pickups — hidden when filter excludes overdue */}
          {(activeFilter === "all" || activeFilter === "overdue") && (
            <section className="w-full min-w-0 overflow-hidden rounded-[1.35rem] bg-[#f7dada] p-4 shadow-[0_6px_24px_rgba(15,23,42,0.06)]">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <AlertTriangle className="h-4 w-4 shrink-0 text-[var(--color-primary)]" />
                  <h2 className="text-[0.92rem] font-semibold text-[var(--color-primary)] sm:text-[0.98rem]">
                    Past Due Pickups
                  </h2>
                </div>
                {/* Badge doubles as an "Overdue" filter shortcut */}
                <button
                  type="button"
                  onClick={() => handleFilterChange(activeFilter === "overdue" ? "all" : "overdue")}
                  className={`shrink-0 rounded-full px-3 py-1 text-[0.78rem] font-semibold transition-all duration-150 active:scale-[0.96] ${
                    activeFilter === "overdue"
                      ? "bg-[var(--color-primary)] text-white"
                      : "bg-white/60 text-[var(--color-primary)] hover:bg-white"
                  }`}
                >
                  {resolved.overduePickups.length} overdue
                </button>
              </div>
              <OverdueCarousel pickups={filteredOverdue} />
            </section>
          )}

          {/* Stat Cards — clickable shortcuts into filters */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {resolved.statCards.map((card) => {
              const targetFilter = STAT_CARD_FILTER_MAP[card.id];
              const isCardActive = targetFilter !== null && activeFilter === targetFilter;
              return (
                <article
                  key={card.id}
                  onClick={() => handleStatCardClick(card.id)}
                  className={`min-w-0 rounded-[1rem] bg-white p-3 shadow-[0_6px_20px_rgba(15,23,42,0.06)] ring-1 transition-all duration-150 sm:p-4 ${
                    targetFilter
                      ? "cursor-pointer hover:ring-[var(--color-primary)] hover:shadow-[0_6px_24px_rgba(44,74,125,0.14)] active:scale-[0.98]"
                      : "cursor-default"
                  } ${isCardActive ? "ring-[var(--color-primary)] bg-[var(--color-primary-soft)]" : "ring-slate-100"}`}
                >
                  <div className="flex items-center gap-2 sm:gap-3">
                    {card.Icon && <card.Icon className="h-3.5 w-3.5 shrink-0 text-[var(--color-primary)] sm:h-4 sm:w-4" />}
                    <p className="text-[0.72rem] text-slate-500 sm:text-[0.82rem] leading-tight">{card.label}</p>
                  </div>
                  <p className="mt-2 text-[1.2rem] font-semibold tracking-[-0.03em] text-[var(--color-primary)] sm:mt-3 sm:text-[1.5rem]">
                    {card.value}
                  </p>
                  {targetFilter && (
                    <p className="mt-1 text-[0.62rem] text-slate-400 sm:text-[0.68rem]">
                      {isCardActive ? "Filtering now ✓" : "Click to filter"}
                    </p>
                  )}
                </article>
              );
            })}
          </div>

          {/* ── Filter bar ── */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {ORDER_FILTERS.map((f) => (
              <button
                key={f.key}
                type="button"
                onClick={() => handleFilterChange(f.key)}
                className={`shrink-0 rounded-full px-3.5 py-1.5 text-[0.76rem] font-semibold transition-all duration-150 active:scale-[0.96] sm:text-[0.8rem] ${
                  activeFilter === f.key
                    ? "bg-[#2c4a7d] text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {f.label}
                {activeFilter === f.key && totalVisible > 0 && (
                  <span className="ml-1.5 rounded-full bg-white/25 px-1.5 py-0.5 text-[0.64rem]">
                    {totalVisible}
                  </span>
                )}
              </button>
            ))}

            {/* Clear pill */}
            {(activeFilter !== "all" || searchQuery) && (
              <button
                type="button"
                onClick={() => { setActiveFilter("all"); setSearchQuery(""); }}
                className="shrink-0 inline-flex items-center gap-1 rounded-full bg-slate-200 px-3 py-1.5 text-[0.74rem] font-medium text-slate-600 transition-all hover:bg-slate-300 active:scale-[0.96]"
              >
                <X className="h-3 w-3" />
                Clear
              </button>
            )}
          </div>

          {/* ── Search input (opened by Manual Pickup Entry quick action) ── */}
          {showSearch && (
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by order ID or customer name…"
                className="w-full rounded-[1rem] border border-slate-200 bg-white py-2.5 pl-10 pr-10 text-[0.84rem] text-slate-800 placeholder-slate-400 shadow-sm outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-soft)]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => { setSearchQuery(""); searchInputRef.current?.focus(); }}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          )}

          {/* ── Schedule Sections ── */}
          <div className="space-y-6 sm:space-y-7">
            {filteredSections.length > 0 ? (
              filteredSections.map((section) => (
                <section key={section.id || section.title} className="min-w-0">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
                    <div className="flex flex-wrap items-center gap-2 min-w-0 sm:gap-3">
                      <h2 className="text-[1rem] font-semibold text-slate-900 sm:text-[1.2rem]">{section.title}</h2>
                      <span className="rounded-full bg-[var(--color-primary-soft)] px-3 py-1 text-[0.74rem] font-semibold text-[var(--color-primary)] sm:text-[0.78rem]">
                        {section.fillText}
                      </span>
                    </div>
                    <span className={`self-start shrink-0 rounded-full px-3 py-1 text-[0.7rem] font-semibold sm:self-auto sm:text-[0.72rem] ${section.statusClassName}`}>
                      {section.statusText}
                    </span>
                  </div>

                  <div className="mt-3 space-y-3">
                    {section.orders.map((order) => {
                      const contactActions = getCustomerContactActions(order);
                      const contactSummary = getContactSummary(order);
                      const isPickedUp     = pickedUpOrders.has(order.id);
                      const isOverdue      = overdueIds.has(String(order.id));
                      return (
                        <article
                          key={`${section.id || section.title}-${order.id}`}
                          className={`flex flex-col gap-3 rounded-[1rem] bg-white px-4 py-4 shadow-[0_6px_20px_rgba(15,23,42,0.06)] ring-1 min-w-0 sm:gap-4 md:flex-row md:items-center md:justify-between ${
                            isOverdue ? "ring-red-200" : "ring-slate-100"
                          }`}
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                              <h3 className="text-[0.88rem] font-semibold text-slate-900 sm:text-[0.95rem]">
                                #{order.id}
                              </h3>
                              <span className="text-[0.88rem] text-slate-700 sm:text-[0.95rem] truncate">{order.customer}</span>
                              {isOverdue && (
                                <span className="rounded-full bg-[#f7dada] px-2 py-0.5 text-[0.66rem] font-semibold text-[var(--color-primary)]">
                                  Overdue
                                </span>
                              )}
                              {contactSummary && (
                                <span className="text-[0.72rem] text-slate-500 break-all sm:text-[0.76rem]">{contactSummary}</span>
                              )}
                            </div>
                            <div className="mt-2 flex flex-wrap items-center gap-1.5 sm:gap-2">
                              <span className={`rounded-full px-2.5 py-0.5 text-[0.68rem] font-semibold sm:text-[0.72rem] ${order.itemBadgeClassName}`}>
                                {order.items} items
                              </span>
                              <span className={`rounded-full px-2.5 py-0.5 text-[0.68rem] font-semibold sm:text-[0.72rem] ${order.statusBadgeClassName}`}>
                                {order.status}
                              </span>
                              <span className="text-[0.72rem] text-slate-600 sm:text-[0.76rem]">{order.scheduleText}</span>
                              {order.readyText && (
                                <span className="text-[0.72rem] text-slate-600 sm:text-[0.76rem]">{order.readyText}</span>
                              )}
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-2 sm:gap-3 md:shrink-0">
                            <div className="flex flex-wrap gap-2">
                              {contactActions.length > 0 ? (
                                contactActions.map((action, i) => (
                                  <button
                                    key={`${order.id}-${action.id}`}
                                    type="button"
                                    onClick={() => launchContactAction(action.href)}
                                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[0.72rem] font-medium transition-all duration-150 sm:text-[0.76rem] active:scale-[0.96] ${
                                      i === 0
                                        ? "bg-[var(--color-primary-soft)] text-[var(--color-primary)] hover:bg-[#dce8f8]"
                                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                    }`}
                                  >
                                    <action.Icon className="h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0" />
                                    <span>{action.label}</span>
                                  </button>
                                ))
                              ) : (
                                <span className="text-[0.76rem] text-slate-400">No contact method</span>
                              )}
                            </div>
                            <button
                              type="button"
                              onClick={() => handleMarkPickedUp(order.id)}
                              className={`w-full rounded-xl px-4 py-2 text-[0.76rem] font-semibold transition-all duration-150 sm:w-auto sm:text-[0.78rem] active:scale-[0.97] ${
                                isPickedUp
                                  ? "bg-emerald-600 text-white shadow-[inset_0_2px_4px_rgba(0,0,0,0.15)]"
                                  : "bg-[#2c4a7d] text-white hover:bg-[#243f6b]"
                              }`}
                            >
                              {isPickedUp ? "✓ Picked Up" : "Mark Picked Up"}
                            </button>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </section>
              ))
            ) : (
              /* Empty state */
              <div className="rounded-[1rem] bg-white px-4 py-8 text-center shadow-[0_6px_20px_rgba(15,23,42,0.06)] ring-1 ring-slate-100">
                <p className="text-[0.84rem] text-slate-500">
                  No orders match{" "}
                  <span className="font-semibold">
                    "{ORDER_FILTERS.find((f) => f.key === activeFilter)?.label}"
                  </span>
                  {searchQuery && <> for "<span className="font-semibold">{searchQuery}</span>"</>}.
                </p>
                <button
                  type="button"
                  onClick={() => { setActiveFilter("all"); setSearchQuery(""); }}
                  className="mt-3 text-[0.82rem] font-medium text-[var(--color-primary)] underline underline-offset-2 hover:no-underline"
                >
                  Clear filter
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ────────── Sidebar ────────── */}
        <aside className="min-w-0 space-y-4 sm:space-y-5 xl:sticky xl:top-6 xl:self-start">

          {/* Capacity Management */}
          <section className="min-w-0 rounded-[1.2rem] bg-white p-4 shadow-[0_6px_20px_rgba(15,23,42,0.06)] ring-1 ring-slate-100 sm:p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h2 className="text-[1.05rem] font-semibold text-slate-900 sm:text-[1.2rem]">Capacity Management</h2>
                <p className="mt-1 text-[0.72rem] text-slate-500 sm:text-[0.76rem]">Synced with the live pickup workflow</p>
              </div>
              <span className="shrink-0 rounded-full bg-[var(--color-primary-soft)] px-3 py-1 text-[0.72rem] font-semibold text-[var(--color-primary)]">
                {capacity.utilization}% used
              </span>
            </div>

            <div className="mt-5 sm:mt-6">
              <h3 className="text-[0.95rem] font-semibold text-slate-900 sm:text-[1rem]">Adjust Capacity</h3>
              <div className="mt-3 space-y-3 sm:mt-4">
                {capacity.slots.map((slot) => (
                  <div key={slot.id} className="rounded-[1rem] border border-slate-100 p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-[0.85rem] font-semibold text-slate-900 sm:text-[0.9rem]">{slot.label}</p>
                        <p className="mt-1 text-[0.7rem] text-slate-500 sm:text-[0.76rem]">{slot.statusLabel}</p>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="text-[0.85rem] font-semibold text-[var(--color-primary)] sm:text-[0.92rem]">
                          {slot.filled}/{slot.capacity}
                        </p>
                        <p className="text-[0.68rem] text-slate-500 sm:text-[0.72rem]">scheduled</p>
                      </div>
                    </div>
                    <div className="mt-3 h-2 rounded-full bg-[var(--color-primary-soft)]">
                      <div
                        className={`h-2 rounded-full ${slot.isBlocked ? "bg-slate-400" : "bg-[var(--color-primary)]"}`}
                        style={{ width: `${slot.utilization}%` }}
                      />
                    </div>
                    {slot.blockReason && <p className="mt-2 text-[0.7rem] text-slate-500">{slot.blockReason}</p>}
                  </div>
                ))}
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2 sm:mt-5 sm:gap-3">
                {[
                  { label: "Scheduled", value: capacity.totalFilled    },
                  { label: "Open",      value: capacity.totalAvailable  },
                  { label: "Current",   value: capacity.currentSlotLabel },
                ].map((item) => (
                  <div key={item.label} className="rounded-[1rem] bg-slate-50 px-2 py-2.5 text-center sm:px-3 sm:py-3">
                    <p className="text-[0.6rem] font-medium uppercase tracking-[0.08em] text-slate-500 sm:text-[0.7rem]">{item.label}</p>
                    <p className="mt-1 text-[0.8rem] font-semibold text-slate-900 sm:text-[0.9rem] break-words">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 sm:mt-6">
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-[0.95rem] font-semibold text-slate-900 sm:text-[1rem]">Block Time Slot</h3>
                <span className={`shrink-0 rounded-full px-3 py-1 text-[0.72rem] font-semibold ${
                  capacity.blockedSlots.length > 0
                    ? "bg-[#f7dada] text-[var(--color-primary)]"
                    : "bg-[var(--color-primary-soft)] text-[var(--color-primary)]"
                }`}>
                  {capacity.blockedSlots.length > 0 ? `${capacity.blockedSlots.length} blocked` : "Open"}
                </span>
              </div>
              <p className="mt-3 text-[0.76rem] leading-6 text-slate-500 sm:text-[0.8rem]">{capacity.blockSummary}</p>
              {capacity.blockedSlots.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {capacity.blockedSlots.map((slot) => (
                    <span key={`blocked-${slot.id}`} className="rounded-full bg-slate-100 px-3 py-1 text-[0.72rem] font-medium text-slate-600">
                      {slot.label}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-5 sm:mt-6">
              <h3 className="text-[0.95rem] font-semibold text-slate-900 sm:text-[1rem]">Special Hours</h3>
              <div className="mt-3 rounded-[1rem] bg-slate-50 px-4 py-4 sm:mt-4">
                <div className="flex items-center gap-2 text-[var(--color-primary)]">
                  <Plus className="h-4 w-4 shrink-0" />
                  <span className="text-[0.74rem] font-semibold sm:text-[0.78rem]">Workflow Overrides</span>
                </div>
                <p className="mt-2 text-[0.76rem] leading-6 text-slate-500 sm:text-[0.8rem]">{capacity.specialHoursText}</p>
              </div>
              <p className="mt-3 text-[0.7rem] text-slate-400 sm:text-[0.72rem]">
                Last synced: {capacity.syncedAt || "Unavailable"}
              </p>
            </div>
          </section>

          <QuickActions
            activeActionId={activeQuickAction}
            items={quickActions}
            onActionClick={handleQuickAction}
            title="Quick Actions"
          />
        </aside>
      </div>
    </section>
  );
};

export default PickupSchedule;
