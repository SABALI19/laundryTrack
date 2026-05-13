import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowUpDown, LoaderCircle, Search } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import Button from "../../components/Button";
import jacketImage from "../../assets/images/jacket.jpg";
import laundry1Image from "../../assets/images/laundry1.jpg";
import laundry2Image from "../../assets/images/laundry2.jpg";
import laundry4Image from "../../assets/images/laundry4.jpg";
import laundry7Image from "../../assets/images/laundry7.jpg";
import yellowTImage from "../../assets/images/Yellow-T.jpg";
import { useDashboardLayout } from "../DashboardLayoutContext.jsx";
import useStaffDashboard from "../../hooks/useStaffDashboard.js";
import { apiRequest, resolveApiAssetUrl } from "../../utils/auth.js";
import QuickActions from "./QuickActions.jsx";
import Quickfilter from "./Quickfilter.jsx";
import ShiftInformation from "./ShiftInformation.jsx";
import TodaySummary from "./TodaySummary.jsx";

const emptyDashboard = {
  generatedAt: null,
  inProcessOrders: [],
  pendingVerificationOrders: [],
  pickupSections: [],
  quickActions: [],
  quickFilters: [],
  shiftInformation: {},
  summaryItems: [],
};

const dummyPendingVerificationOrders = [
  {
    customer: "Emily Chen",
    id: "LT-2024-0315",
    images: [laundry1Image, laundry7Image, yellowTImage],
    items: 8,
    rush: true,
    submittedAt: "Today at 1:45 PM",
  },
  {
    customer: "Michael Rodriguez",
    id: "LT-2024-0314",
    images: [jacketImage, laundry1Image, laundry4Image],
    items: 5,
    rush: false,
    submittedAt: "Today at 11:20 AM",
  },
];

const dummyInProcessOrders = [
  {
    badgeClassName: "bg-[var(--color-primary-soft)] text-[var(--color-primary)]",
    id: "LT-2024-0312",
    image: laundry2Image,
    progress: 34,
    stage: "Washing",
    statusKey: "in-progress",
    time: "25 minutes ago",
  },
  {
    badgeClassName: "bg-[var(--color-warm-soft)] text-[var(--color-primary)]",
    id: "LT-2024-0311",
    image: laundry7Image,
    progress: 67,
    stage: "Drying",
    statusKey: "in-progress",
    time: "15 minutes ago",
  },
];

const dummyPickupSections = [
  {
    label: "Morning (9:00 AM - 12:00 PM)",
    orders: [
      {
        actionLabel: "Ready for Pickup",
        customer: "David Kim",
        id: "LT-2024-0308",
        isActionActive: true,
        isOverdue: false,
        items: 6,
        status: "Ready",
        statusClassName: "bg-[var(--color-primary-soft)] text-[var(--color-primary)]",
        statusKey: "completed",
        time: "10:30 AM",
      },
    ],
  },
  {
    label: "Afternoon (12:00 PM - 6:00 PM)",
    orders: [
      {
        actionLabel: "Update Status",
        customer: "Lisa Wang",
        id: "LT-2024-0307",
        isActionActive: false,
        isOverdue: false,
        items: 9,
        status: "Preparing",
        statusClassName: "bg-[var(--color-warm-soft)] text-[var(--color-primary)]",
        statusKey: "confirmed",
        time: "2:15 PM",
      },
      {
        actionLabel: "Confirm Pickup",
        customer: "Robert Taylor",
        id: "LT-2024-0306",
        isActionActive: true,
        isOverdue: true,
        items: 4,
        status: "Needs Verification",
        statusClassName: "bg-slate-100 text-slate-600",
        statusKey: "pending",
        time: "4:00 PM",
      },
    ],
  },
];

const fallbackShiftInformation = {
  currentShift: "8:00 AM - 4:00 PM",
  role: "Processing Specialist",
  staffMember: "Sarah Johnson",
};

const formatHeaderTimestamp = (value) => {
  if (!value) {
    return "";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
};

const resolveStaffImageSrc = (value) => {
  const normalizedValue = String(value || "").trim();

  if (!normalizedValue) {
    return "";
  }

  if (
    normalizedValue.startsWith("/assets/") ||
    normalizedValue.startsWith("assets/") ||
    normalizedValue.startsWith("blob:") ||
    normalizedValue.startsWith("data:") ||
    normalizedValue.startsWith("http://") ||
    normalizedValue.startsWith("https://")
  ) {
    return normalizedValue;
  }

  return resolveApiAssetUrl(normalizedValue);
};

const filterPendingVerificationOrders = (orders, activeFilter) => {
  if (activeFilter === "all" || activeFilter === "pending") {
    return orders;
  }

  return [];
};

const filterInProcessOrders = (orders, activeFilter) => {
  if (activeFilter === "all" || activeFilter === "in-progress") {
    return orders;
  }

  return [];
};

const filterPickupSections = (sections, activeFilter) => {
  if (activeFilter === "all") {
    return sections;
  }

  return sections
    .map((section) => ({
      ...section,
      orders: section.orders.filter((order) => {
        if (activeFilter === "completed") {
          return order.statusKey === "completed";
        }

        if (activeFilter === "overdue") {
          return order.isOverdue;
        }

        return false;
      }),
    }))
    .filter((section) => section.orders.length > 0);
};

const buildDashboardWithSeedData = (dashboard) => {
  const hasLiveDashboard = Boolean(dashboard?.generatedAt);
  const resolvedPendingVerificationOrders = hasLiveDashboard
    ? dashboard?.pendingVerificationOrders || []
    : dummyPendingVerificationOrders;
  const resolvedInProcessOrders = hasLiveDashboard
    ? dashboard?.inProcessOrders || []
    : dummyInProcessOrders;
  const resolvedPickupSections = hasLiveDashboard
    ? dashboard?.pickupSections || []
    : dummyPickupSections;
  const pickupOrders = resolvedPickupSections.flatMap((section) => section.orders);
  const trackedOrderIds = new Set([
    ...resolvedPendingVerificationOrders.map((order) => order.id),
    ...resolvedInProcessOrders.map((order) => order.id),
    ...pickupOrders.map((order) => order.id),
  ]);

  return {
    generatedAt: dashboard?.generatedAt || new Date().toISOString(),
    inProcessOrders: resolvedInProcessOrders,
    pendingVerificationOrders: resolvedPendingVerificationOrders,
    pickupSections: resolvedPickupSections,
    quickActions: [
      {
        count: resolvedPendingVerificationOrders.length,
        id: "scan",
        label: "Scan Order QR Code",
        variant: "primary",
      },
      {
        count: trackedOrderIds.size,
        id: "lookup",
        label: "Manual Order Lookup",
        variant: "secondary",
      },
      {
        count: pickupOrders.filter((order) => order.isOverdue).length,
        id: "issue",
        label: "Report Issue",
        variant: "secondary",
      },
    ],
    quickFilters: [
      {
        count: trackedOrderIds.size,
        key: "all",
        label: "All Orders",
      },
      {
        count: resolvedPendingVerificationOrders.length,
        key: "pending",
        label: "Needs Verification",
      },
      {
        count: resolvedInProcessOrders.length,
        key: "in-progress",
        label: "In Process",
      },
      {
        count: pickupOrders.filter((order) => order.statusKey === "completed").length,
        key: "completed",
        label: "Ready for Pickup",
      },
      {
        count: pickupOrders.filter((order) => order.isOverdue).length,
        key: "overdue",
        label: "Overdue",
      },
    ],
    shiftInformation: dashboard?.shiftInformation || fallbackShiftInformation,
    summaryItems: [
      {
        label: "Pending verification",
        value: resolvedPendingVerificationOrders.length,
      },
      {
        label: "In-process orders",
        value: resolvedInProcessOrders.length,
      },
      {
        label: "Ready for pickup",
        value: pickupOrders.filter((order) => order.statusKey === "completed").length,
      },
      {
        label: "Today's pickups",
        value: pickupOrders.length,
      },
    ],
  };
};

const StaffDashboard = () => {
  const navigate = useNavigate();
  const dashboardLayout = useDashboardLayout();
  const setMobileSidebarContent = dashboardLayout?.setMobileSidebarContent;
  const closeMobileSidebar = dashboardLayout?.closeMobileSidebar;
  const { dashboard, error, isLoading } = useStaffDashboard();
  const [activeFilter, setActiveFilter] = useState("all");
  const [activeQuickAction, setActiveQuickAction] = useState(null);
  const [lookupOrderId, setLookupOrderId] = useState("");
  const [lookupError, setLookupError] = useState("");
  const [isLookupLoading, setIsLookupLoading] = useState(false);
  const lookupInputRef = useRef(null);
  const resolvedDashboard = useMemo(
    () => buildDashboardWithSeedData(dashboard || emptyDashboard),
    [dashboard],
  );
  const pendingVerificationOrders = useMemo(
    () => filterPendingVerificationOrders(resolvedDashboard.pendingVerificationOrders, activeFilter),
    [activeFilter, resolvedDashboard.pendingVerificationOrders],
  );
  const inProcessOrders = useMemo(
    () => filterInProcessOrders(resolvedDashboard.inProcessOrders, activeFilter),
    [activeFilter, resolvedDashboard.inProcessOrders],
  );
  const pickupSections = useMemo(
    () => filterPickupSections(resolvedDashboard.pickupSections, activeFilter),
    [activeFilter, resolvedDashboard.pickupSections],
  );
  const fallbackVerificationOrderId = useMemo(() => {
    const pickupOrderIds = resolvedDashboard.pickupSections.flatMap((section) =>
      section.orders.map((order) => order.id),
    );

    return (
      resolvedDashboard.pendingVerificationOrders[0]?.id ||
      resolvedDashboard.inProcessOrders[0]?.id ||
      pickupOrderIds[0] ||
      ""
    );
  }, [
    resolvedDashboard.inProcessOrders,
    resolvedDashboard.pendingVerificationOrders,
    resolvedDashboard.pickupSections,
  ]);
  const issueVerificationOrderId = useMemo(() => {
    const overduePickupOrderId = resolvedDashboard.pickupSections
      .flatMap((section) => section.orders)
      .find((order) => order.isOverdue)?.id;

    return (
      resolvedDashboard.pendingVerificationOrders[0]?.id ||
      overduePickupOrderId ||
      resolvedDashboard.inProcessOrders[0]?.id ||
      fallbackVerificationOrderId
    );
  }, [
    fallbackVerificationOrderId,
    resolvedDashboard.inProcessOrders,
    resolvedDashboard.pendingVerificationOrders,
    resolvedDashboard.pickupSections,
  ]);

  const handleSidebarFilterChange = useCallback(
    (nextFilter) => {
      setActiveFilter(nextFilter);
      closeMobileSidebar?.();
    },
    [closeMobileSidebar],
  );

  const openVerificationWorkflow = useCallback(
    (orderId, actionId) => {
      if (!orderId) {
        setLookupError(
          actionId === "issue"
            ? "No order is available for issue reporting right now."
            : "No verification order is available right now.",
        );
        return;
      }

      setLookupError("");
      setActiveQuickAction(actionId);
      closeMobileSidebar?.();
      navigate(`/staff/verification/${encodeURIComponent(orderId)}`);
    },
    [closeMobileSidebar, navigate],
  );

  const handleQuickAction = useCallback(
    (actionId) => {
      if (actionId === "lookup") {
        setActiveQuickAction((previousValue) =>
          previousValue === "lookup" ? null : "lookup",
        );
        setLookupError("");
        return;
      }

      if (actionId === "scan") {
        openVerificationWorkflow(fallbackVerificationOrderId, actionId);
        return;
      }

      if (actionId === "issue") {
        openVerificationWorkflow(issueVerificationOrderId, actionId);
      }
    },
    [
      fallbackVerificationOrderId,
      issueVerificationOrderId,
      openVerificationWorkflow,
    ],
  );

  const handleLookupSubmit = useCallback(
    async (event) => {
      event.preventDefault();

      const normalizedOrderId = lookupOrderId.trim().toUpperCase();

      if (!normalizedOrderId) {
        setLookupError("Enter an order ID to open the verification workflow.");
        return;
      }

      try {
        setIsLookupLoading(true);
        setLookupError("");
        await apiRequest(
          `/orders/staff/verification/${encodeURIComponent(normalizedOrderId)}`,
        );
        setActiveQuickAction("lookup");
        closeMobileSidebar?.();
        navigate(`/staff/verification/${encodeURIComponent(normalizedOrderId)}`);
      } catch (requestError) {
        setLookupError(
          requestError.message || "Unable to find that verification order.",
        );
      } finally {
        setIsLookupLoading(false);
      }
    },
    [closeMobileSidebar, lookupOrderId, navigate],
  );

  useEffect(() => {
    if (activeQuickAction !== "lookup") {
      return;
    }

    lookupInputRef.current?.focus();
  }, [activeQuickAction]);

  const sidebarContent = useMemo(
    () => (
      <div className="space-y-6">
        <TodaySummary summaryItems={resolvedDashboard.summaryItems} />
        <Quickfilter
          activeFilter={activeFilter}
          filters={resolvedDashboard.quickFilters}
          onFilterChange={handleSidebarFilterChange}
        />
        <ShiftInformation {...resolvedDashboard.shiftInformation} />
        <QuickActions
          activeActionId={activeQuickAction}
          items={resolvedDashboard.quickActions}
          onActionClick={handleQuickAction}
        />
        {activeQuickAction === "lookup" && (
          <section className="rounded-[1.4rem] bg-white p-4 shadow-[0_6px_20px_rgba(15,23,42,0.06)] ring-1 ring-slate-100">
            <h2 className="text-[0.95rem] font-semibold text-slate-900">
              Manual Lookup
            </h2>
            <p className="mt-2 text-[0.78rem] leading-6 text-slate-500">
              Enter an order ID to validate it against the staff verification
              endpoint and open the workflow.
            </p>
            <form className="mt-4 space-y-3" onSubmit={handleLookupSubmit}>
              <label className="flex items-center gap-3 rounded-[0.95rem] border border-slate-200 bg-slate-50 px-3 py-2.5 focus-within:border-[var(--color-primary)] focus-within:bg-white">
                <Search className="h-4 w-4 shrink-0 text-slate-400" />
                <input
                  ref={lookupInputRef}
                  type="text"
                  value={lookupOrderId}
                  onChange={(event) => setLookupOrderId(event.target.value)}
                  placeholder="Enter order ID"
                  className="w-full border-0 bg-transparent text-[0.82rem] text-slate-700 outline-none placeholder:text-slate-400"
                />
              </label>
              {lookupError && (
                <p className="text-[0.75rem] font-medium text-red-600">
                  {lookupError}
                </p>
              )}
              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={isLookupLoading}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-[0.8rem] font-semibold"
              >
                {isLookupLoading ? (
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
                <span>
                  {isLookupLoading ? "Opening order..." : "Open Verification"}
                </span>
              </Button>
            </form>
          </section>
        )}
      </div>
    ),
    [
      activeFilter,
      activeQuickAction,
      handleLookupSubmit,
      handleQuickAction,
      handleSidebarFilterChange,
      isLookupLoading,
      lookupError,
      lookupOrderId,
      resolvedDashboard.quickActions,
      resolvedDashboard.quickFilters,
      resolvedDashboard.shiftInformation,
      resolvedDashboard.summaryItems,
    ],
  );

  useEffect(() => {
    if (!setMobileSidebarContent) {
      return undefined;
    }

    setMobileSidebarContent(sidebarContent);

    return () => {
      setMobileSidebarContent(null);
      closeMobileSidebar?.();
    };
  }, [closeMobileSidebar, setMobileSidebarContent, sidebarContent]);

  return (
    <section className="mx-auto w-full min-w-0 max-w-[1450px]">
      <div className="grid min-w-0 gap-8 xl:grid-cols-[minmax(0,1fr)_300px]">
        <div className="min-w-0">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <h1 className="text-[1.85rem] font-semibold tracking-[-0.03em] text-slate-900">
              Staff Dashboard
            </h1>
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-[0.95rem] break-words text-slate-500">
                {formatHeaderTimestamp(resolvedDashboard.generatedAt) || "Dashboard unavailable"}
              </p>
              <span className="rounded-full bg-[var(--color-primary-soft)] px-3 py-1.5 text-[0.82rem] font-semibold text-[var(--color-primary)]">
                Live Queue
              </span>
            </div>
          </div>

          {error && (
            <div className="mt-6 rounded-2xl bg-red-50 px-4 py-3 text-[0.84rem] text-red-600">
              {error}
            </div>
          )}

          {isLoading && (
            <div className="mt-6 rounded-2xl bg-white px-4 py-5 text-[0.84rem] text-slate-500 shadow-[0_6px_20px_rgba(15,23,42,0.06)] ring-1 ring-slate-100">
              Loading live staff dashboard data...
            </div>
          )}

          <div className="mt-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-[1.2rem] font-semibold text-slate-900">
                Pending Verification ({pendingVerificationOrders.length} orders)
              </h2>
              <button
                type="button"
                onClick={() => setActiveFilter("pending")}
                className="inline-flex items-center gap-2 text-[0.82rem] font-medium text-[var(--color-primary)]"
              >
                <ArrowUpDown className="h-3.5 w-3.5" />
                <span>Focus Queue</span>
              </button>
            </div>

            <div className="mt-4 space-y-4">
              {pendingVerificationOrders.length > 0 ? (
                pendingVerificationOrders.map((order) => (
                  <article
                    key={order.id}
                    className="rounded-[1.15rem] bg-white p-4 shadow-[0_6px_20px_rgba(15,23,42,0.06)] ring-1 ring-slate-100"
                  >
                    <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-[0.98rem] font-semibold text-slate-900">
                            #{order.id}
                          </h3>
                          <span className="text-[0.98rem] text-slate-500">
                            - {order.customer}
                          </span>
                          {order.rush && (
                            <span className="rounded-full bg-[var(--color-warm-soft)] px-2.5 py-0.5 text-[0.68rem] font-semibold text-[var(--color-primary)]">
                              RUSH
                            </span>
                          )}
                        </div>
                        <p className="mt-3 text-[0.84rem] text-slate-500">
                          Submitted: {order.submittedAt}
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {order.images.length > 0 ? (
                            order.images.map((image, index) => (
                              <div
                                key={`${order.id}-${index}`}
                                className="h-11 w-11 overflow-hidden rounded-lg bg-slate-100"
                              >
                                  <img
                                  src={resolveStaffImageSrc(image)}
                                  alt={`${order.id} item ${index + 1}`}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                            ))
                          ) : (
                            <div className="rounded-lg bg-slate-100 px-3 py-2 text-[0.72rem] text-slate-500">
                              No item photos yet
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex w-full flex-col items-start gap-3 sm:w-auto sm:items-end">
                        <span className="rounded-full bg-[var(--color-primary-soft)] px-3 py-1 text-[0.78rem] font-semibold text-[var(--color-primary)]">
                          {order.items} items
                        </span>
                        <Link to={`/staff/verification/${order.id}`} className="w-full sm:w-auto">
                          <Button
                            variant="primary"
                            size="md"
                            className="w-full rounded-xl px-4 py-2.5 text-[0.8rem] font-semibold sm:w-auto sm:px-5 sm:text-[0.82rem]"
                          >
                            Start Verification
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </article>
                ))
              ) : (
                <div className="rounded-[1.15rem] bg-white p-4 text-[0.84rem] text-slate-500 shadow-[0_6px_20px_rgba(15,23,42,0.06)] ring-1 ring-slate-100">
                  No pending verification orders for the selected filter.
                </div>
              )}
            </div>
          </div>

          <div className="mt-10">
            <h2 className="text-[1.2rem] font-semibold text-slate-900">
              In Process ({inProcessOrders.length} orders)
            </h2>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {inProcessOrders.length > 0 ? (
                inProcessOrders.map((order) => (
                  <article
                    key={order.id}
                    className="rounded-[1rem] bg-white p-4 shadow-[0_6px_20px_rgba(15,23,42,0.06)] ring-1 ring-slate-100"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <h3 className="text-[0.98rem] font-semibold text-slate-900">
                        #{order.id}
                      </h3>
                      <span
                        className={`rounded-full px-3 py-1 text-[0.72rem] font-semibold ${order.badgeClassName}`}
                      >
                        {order.stage}
                      </span>
                    </div>

                    <div className="mt-4 h-2.5 rounded-full bg-[var(--color-primary-soft)]">
                      <div
                        className="h-2.5 rounded-full bg-[var(--color-primary)]"
                        style={{ width: `${order.progress}%` }}
                      />
                    </div>

                    <p className="mt-3 text-[0.78rem] text-slate-500">
                      Last updated: {order.time}
                    </p>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                      <div className="h-10 w-10 overflow-hidden rounded-lg bg-slate-100">
                        {order.image ? (
                          <img
                            src={resolveStaffImageSrc(order.image)}
                            alt={order.id}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-[0.62rem] text-slate-400">
                            No image
                          </div>
                        )}
                      </div>
                      <Link
                        to={`/staff/verification/${order.id}`}
                        className="w-full sm:w-auto"
                      >
                        <Button
                          variant="secondary"
                          size="md"
                          className="w-full rounded-xl px-3 py-2 text-[0.76rem] font-semibold sm:w-auto sm:px-4 sm:text-[0.78rem]"
                        >
                          Update Status
                        </Button>
                      </Link>
                    </div>
                  </article>
                ))
              ) : (
                <div className="rounded-[1rem] bg-white p-4 text-[0.84rem] text-slate-500 shadow-[0_6px_20px_rgba(15,23,42,0.06)] ring-1 ring-slate-100 md:col-span-2">
                  No in-process orders for the selected filter.
                </div>
              )}
            </div>
          </div>

          <div className="mt-10">
            <h2 className="text-[1.2rem] font-semibold text-[#2c4a7d]">
              Scheduled Pickups
            </h2>

            <div className="mt-5 space-y-6">
              {pickupSections.length > 0 ? (
                pickupSections.map((section) => (
                  <div key={section.label}>
                    <h3 className="text-[0.95rem] font-semibold text-slate-900">
                      {section.label}
                    </h3>

                    <div className="mt-3 space-y-3">
                      {section.orders.map((order) => (
                        <article
                          key={`${section.label}-${order.id}`}
                          className="flex min-w-0 flex-col gap-4 rounded-[1rem] bg-white px-4 py-4 shadow-[0_6px_20px_rgba(15,23,42,0.06)] ring-1 ring-slate-100 md:flex-row md:items-center md:justify-between"
                        >
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <h4 className="text-[0.98rem] font-semibold text-slate-900">
                                #{order.id}
                              </h4>
                              <span className="text-[0.84rem] text-slate-500">
                                - {order.customer}
                              </span>
                            </div>
                            <div className="mt-2.5 flex flex-wrap items-center gap-2 text-[0.78rem] text-slate-500">
                              <span>{order.items} items</span>
                              <span>&bull;</span>
                              <span>{order.time}</span>
                              <span
                                className={`rounded-full px-2.5 py-0.5 text-[0.72rem] font-semibold ${order.statusClassName}`}
                              >
                                {order.status}
                              </span>
                            </div>
                          </div>

                          <Link
                            to={`/staff/verification/${order.id}`}
                            className="w-full sm:w-auto"
                          >
                            <Button
                              variant={order.isActionActive ? "primary" : "secondary"}
                              size="md"
                              className={`w-full rounded-xl px-3 py-2 text-[0.76rem] font-semibold sm:w-auto sm:px-4 sm:text-[0.78rem] md:self-auto ${
                                order.isActionActive
                                  ? ""
                                  : "border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white"
                              }`}
                            >
                              {order.actionLabel}
                            </Button>
                          </Link>
                        </article>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-[1rem] bg-white p-4 text-[0.84rem] text-slate-500 shadow-[0_6px_20px_rgba(15,23,42,0.06)] ring-1 ring-slate-100">
                  No scheduled pickups for the selected filter.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="hidden xl:block">
          {sidebarContent}
        </div>
      </div>
    </section>
  );
};

export default StaffDashboard;
