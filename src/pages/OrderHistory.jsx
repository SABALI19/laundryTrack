import { useMemo, useState } from "react";
import Button from "../components/Button";
import OrderShareModal from "../components/OrderShareModal.jsx";
import FabButton from "../components/common/FabButton.jsx";
import {
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Cuboid,
  Plus,
  RefreshCw,
  QrCode,
  Search,
  Shirt,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import useCustomerOrders from "../hooks/useCustomerOrders.js";
import { apiRequest } from "../utils/auth.js";
import {
  normalizeApiOrderForHistoryCard,
  staticHistoryOrders,
} from "../utils/customerOrderDisplay.js";
import { buildSharedOrderUrl } from "../utils/orderShare.js";

const dateRangeOptions = [
  { id: "all", label: "All Time" },
  { id: "7days", label: "Last 7 days" },
  { id: "30days", label: "Last 30 days" },
  { id: "90days", label: "Last 90 days" },
];

const sortOptions = [
  { id: "newest", label: "Newest First" },
  { id: "oldest", label: "Oldest First" },
];

const summaryCards = [
  {
    id: "completed",
    icon: Check,
    title: "47",
    subtitle: "Orders Completed",
  },
  {
    id: "items",
    icon: Cuboid,
    title: "432",
    subtitle: "Items Cleaned",
  },
  {
    id: "frequent",
    icon: Shirt,
    title: "Dress Shirts",
    subtitle: "Most Frequent Item",
  },
];

const getDateThreshold = (rangeId) => {
  const now = new Date();
  if (rangeId === "7days") return new Date(now.setDate(now.getDate() - 7));
  if (rangeId === "30days") return new Date(now.setDate(now.getDate() - 30));
  if (rangeId === "90days") return new Date(now.setDate(now.getDate() - 90));
  return null;
};

const OrderHistory = () => {
  const { orders: customerOrders } = useCustomerOrders();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSort, setActiveSort] = useState("newest");
  const [activeStatus, setActiveStatus] = useState("All Status");
  const [activeDateRange, setActiveDateRange] = useState("all");
  const [shareModalOrder, setShareModalOrder] = useState(null);
  const [shareUrl, setShareUrl] = useState("");
  const [shareError, setShareError] = useState("");
  const [isGeneratingShare, setIsGeneratingShare] = useState(false);

  const allOrders = useMemo(() => {
    const liveOrders = customerOrders.map(normalizeApiOrderForHistoryCard);
    return [...liveOrders, ...staticHistoryOrders];
  }, [customerOrders]);

  const statusOptions = useMemo(
    () => ["All Status", ...new Set(allOrders.map((order) => order.status))],
    [allOrders],
  );

  const hasActiveFilters =
    searchQuery !== "" ||
    activeStatus !== "All Status" ||
    activeSort !== "newest" ||
    activeDateRange !== "all";

  const clearFilters = () => {
    setSearchQuery("");
    setActiveStatus("All Status");
    setActiveSort("newest");
    setActiveDateRange("all");
  };

  const closeShareModal = () => {
    setShareModalOrder(null);
    setShareUrl("");
    setShareError("");
    setIsGeneratingShare(false);
  };

  const handleShareGenerate = async () => {
    if (!shareModalOrder?.routeId) {
      return;
    }

    try {
      setIsGeneratingShare(true);
      setShareError("");
      const data = await apiRequest(`/orders/${shareModalOrder.routeId}/share`, {
        method: "POST",
      });
      const nextShareUrl = buildSharedOrderUrl(data.share?.shareToken);
      setShareUrl(nextShareUrl);
    } catch (requestError) {
      setShareError(requestError.message || "Unable to generate a pickup QR code.");
    } finally {
      setIsGeneratingShare(false);
    }
  };

  const filteredOrders = useMemo(() => {
    let result = [...allOrders];

    // search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (o) =>
          o.id.toLowerCase().includes(q) ||
          o.eventDate.toLowerCase().includes(q)
      );
    }

    // status filter
    if (activeStatus !== "All Status") {
      result = result.filter((o) => o.status === activeStatus);
    }

    // date range filter
    const threshold = getDateThreshold(activeDateRange);
    if (threshold) {
      result = result.filter((o) => o.date >= threshold);
    }

    // sort
    result.sort((a, b) =>
      activeSort === "newest" ? b.date - a.date : a.date - b.date
    );

    return result;
  }, [allOrders, searchQuery, activeStatus, activeSort, activeDateRange]);

  return (
    <section className="mx-auto w-full">
      <FabButton />
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-base font-bold text-slate-800">Order History</h1>
          <p className="mt-1 text-xs text-slate-500">
            Complete archive of your past laundry orders ({allOrders.length} total orders)
          </p>
        </div>
        <Link to="/new-order" className="hidden self-start sm:block">
          <Button
            variant="primary"
            size="md"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#2c4a7d] px-4 py-2 text-sm font-semibold text-white hover:bg-[#415a81]"
          >
            <Plus className="h-4 w-4" />
            <span className="font-inter">New Order</span>
          </Button>
        </Link>
      </div>

      <div className="mt-4 rounded-lg bg-white p-4 shadow-sm ring-1 ring-slate-100">
        <div className="flex flex-col gap-3 xl:flex-row">
          <label className="flex h-9 flex-1 items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 text-slate-400">
            <Search className="h-4 w-4 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by order ID or date..."
              className="w-full border-0 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
            />
          </label>
          <div className="flex gap-2">
            {/* Date range filter - STYLED & RESPONSIVE */}
            <div className="relative flex-1 sm:flex-initial">
              <select
                value={activeDateRange}
                onChange={(e) => setActiveDateRange(e.target.value)}
                className="h-9 w-full appearance-none rounded-lg border border-[#2c4a7d]/20 bg-white pl-3 pr-8 text-xs text-slate-700 outline-none transition-all duration-200 hover:border-[#2c4a7d]/40 hover:bg-[#2c4a7d]/5 focus:border-[#2c4a7d] focus:ring-1 focus:ring-[#2c4a7d]/20 sm:w-auto sm:min-w-[130px] sm:text-sm"
              >
                {dateRangeOptions.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-[#2c4a7d]/60 transition-colors group-hover:text-[#2c4a7d] sm:h-4 sm:w-4" />

              {/* Active filter indicator */}
  {activeDateRange !== 'all' && (
    <span className="absolute -right-1 -top-4 flex h-2 w-2">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#2c4a7d] opacity-75"></span>
      <span className="relative inline-flex h-2 w-2 rounded-full bg-[#2c4a7d]"></span>
    </span>)
    }
            </div>

            {/* Status filter - STYLED & RESPONSIVE */}
            <div className="relative flex-1 sm:flex-initial">
              <select
                value={activeStatus}
                onChange={(e) => setActiveStatus(e.target.value)}
                className="h-9 w-full appearance-none rounded-lg border border-[#2c4a7d]/20 bg-white pl-3 pr-8 text-xs text-slate-700 outline-none transition-all duration-200 hover:border-[#2c4a7d]/40 hover:bg-[#2c4a7d]/5 focus:border-[#2c4a7d] focus:ring-1 focus:ring-[#2c4a7d]/20 sm:w-auto sm:min-w-[120px] sm:text-sm"
              >
                {statusOptions.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-[#2c4a7d]/60 transition-colors group-hover:text-[#2c4a7d] sm:h-4 sm:w-4" />
            </div>
          </div>
        </div>

        {/* Sort buttons */}
        <div className="mt-3 flex items-center justify-between">
          <div className="flex gap-2">
            {sortOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setActiveSort(option.id)}
                className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
                  activeSort === option.id
                    ? "bg-[#415a81] text-white"
                    : "border border-slate-200 bg-white text-slate-600"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-[#415a81] transition-colors hover:text-[#2c4a7d]"
            >
              <X className="h-3.5 w-3.5" />
              <span className="text-xs sm:text-sm">Clear Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Orders listing */}
      <div className="mt-4 space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white px-5 py-10 text-center text-sm text-slate-500">
            No orders match your filters.
          </div>
        ) : (
          filteredOrders.map((order) => (
            <article
              key={order.id}
              className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white px-5 py-5 shadow-sm sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between sm:justify-start sm:gap-4">
                  <h2 className="text-sm font-semibold text-slate-900">
                    Order #{order.displayId || order.id}
                  </h2>
                  <span
                    className={`inline-flex rounded-full px-3 py-0.5 text-xs font-medium ${order.statusClassName}`}
                  >
                    {order.status}
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-slate-500">
                  {order.completedText}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {order.previewImages.map((image, index) => (
                    <div
                      key={`${order.id}-${index}`}
                      className="h-12 w-12 overflow-hidden rounded-lg bg-slate-100"
                    >
                      <img
                        src={image}
                        alt={`Order ${order.id} item ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ))}
                  <span className="text-xs text-slate-500">
                    {order.itemsCount} items
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-6 sm:shrink-0">
                <div className="text-right">
                  <p className="text-xs text-slate-500">{order.eventLabel}</p>
                  <p className="text-xs font-semibold text-slate-900">
                    {order.eventDate}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Link
                    to={`/order-tracking/${order.routeId || order.id}`}
                    className="text-xs font-medium text-[#2c4a7d] hover:text-[#415a81]"
                  >
                    View Details
                  </Link>
                  <Link to="/new-order">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="inline-flex items-center gap-1.5 rounded-lg border border-[#415a81] px-3 py-1.5 text-xs font-medium text-[#415a81] transition-colors hover:bg-[#2c4a7d] hover:text-white"
                    >
                      <RefreshCw className="h-3 w-3" />
                      <span>Reorder</span>
                    </Button>
                  </Link>
                  {order.canGeneratePickupShare && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        setShareModalOrder(order);
                        setShareUrl("");
                        setShareError("");
                      }}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
                    >
                      <QrCode className="h-3 w-3" />
                      <span>Generate QR</span>
                    </Button>
                  )}
                </div>
              </div>
            </article>
          ))
        )}
      </div>

      {/* Pagination */}
      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-slate-500">
          Showing {filteredOrders.length} of {allOrders.length} orders
        </p>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <button type="button" className="rounded-full p-1.5 transition-colors hover:bg-slate-100">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#415a81] font-semibold text-white transition-colors hover:bg-[#2c4a7d]"
          >
            1
          </button>
          <button type="button" className="font-medium text-slate-700 transition-colors hover:text-[#2c4a7d]">2</button>
          <button type="button" className="font-medium text-slate-700 transition-colors hover:text-[#2c4a7d]">3</button>
          <span>...</span>
          <button type="button" className="font-medium text-slate-700 transition-colors hover:text-[#2c4a7d]">25</button>
          <button
            type="button"
            className="rounded-full p-1.5 transition-colors hover:bg-slate-100"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mt-16">
        <h2 className="text-sm font-semibold text-slate-900">
          This Year's Summary
        </h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {summaryCards.map((card) => (
            <article
              key={card.id}
              className="rounded-2xl bg-white px-5 py-4 shadow-sm ring-1 ring-slate-100 transition-shadow hover:shadow-md"
            >
              <div className="flex items-center gap-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#d7ecf1] text-[#118a8a]">
                  <card.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xl font-semibold text-slate-900">
                    {card.title}
                  </p>
                  <p className="text-xs text-slate-500">{card.subtitle}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <OrderShareModal
        error={shareError}
        isGenerating={isGeneratingShare}
        isOpen={Boolean(shareModalOrder)}
        onClose={closeShareModal}
        onGenerate={handleShareGenerate}
        orderLabel={shareModalOrder?.displayId ? `order #${shareModalOrder.displayId}` : "this order"}
        shareUrl={shareUrl}
      />
    </section>
  );
};

export default OrderHistory;
