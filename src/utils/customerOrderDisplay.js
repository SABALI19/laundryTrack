import jacketImage from "../assets/images/jacket.jpg";
import laundry1Image from "../assets/images/laundry1.jpg";
import laundry2Image from "../assets/images/laundry2.jpg";
import laundry3Image from "../assets/images/laundry3.jpg";
import laundry4Image from "../assets/images/laundry4.jpg";
import laundry5Image from "../assets/images/laundry5.jpg";
import laundry6Image from "../assets/images/laundry6.jpg";
import laundry7Image from "../assets/images/laundry7.jpg";
import laundry8Image from "../assets/images/laundry8.jpg";
import yellowTImage from "../assets/images/Yellow-T.jpg";
import { resolveApiAssetUrl } from "./auth.js";

export const defaultOrderPreviewImages = [
  laundry1Image,
  laundry2Image,
  laundry3Image,
  laundry4Image,
  laundry5Image,
  laundry6Image,
  laundry7Image,
  laundry8Image,
  jacketImage,
  yellowTImage,
];

const apiStatusLabelMap = {
  pending: "Pending",
  confirmed: "Confirmed",
  "in-progress": "In Progress",
  completed: "Completed",
  cancelled: "Cancelled",
};

const apiStatusProgressMap = {
  pending: 20,
  confirmed: 40,
  "in-progress": 70,
  completed: 100,
  cancelled: 100,
};

const historyStatusClassMap = {
  Pending: "bg-[#eef3fb] text-[#2c4a7d]",
  Confirmed: "bg-[#dff2ec] text-[#15765d]",
  "In Progress": "bg-[#fff4db] text-[#8a5a12]",
  Completed: "bg-[#d7ecf1] text-[#2c4a7d]",
  Cancelled: "bg-[#f7dada] text-[#b7545b]",
};

const activeStatusClassMap = {
  Pending: "bg-slate-100 text-slate-700",
  Confirmed: "bg-teal-100 text-teal-700",
  "In Progress": "bg-amber-100 text-amber-700",
  Washing: "bg-teal-100 text-teal-700",
  Ironing: "bg-amber-100 text-amber-700",
  Drying: "bg-purple-100 text-purple-700",
  Completed: "bg-green-100 text-green-700",
  Cancelled: "bg-rose-100 text-rose-700",
};

const toValidDate = (value) => {
  if (!value) return null;

  const nextDate = new Date(value);
  return Number.isNaN(nextDate.getTime()) ? null : nextDate;
};

const formatDate = (value, options) => {
  const nextDate = toValidDate(value);

  if (!nextDate) {
    return "";
  }

  return new Intl.DateTimeFormat("en-US", options).format(nextDate);
};

const fallbackPreviewSlice = (limit) => defaultOrderPreviewImages.slice(0, limit);

export const staticActiveOrders = [
  {
    id: "LT2024001",
    routeId: "LT2024001",
    displayId: "LT2024001",
    date: "March 15, 2024",
    status: "Washing",
    items: 6,
    progress: 60,
    completion: "March 17, 2024 - 3:00 PM",
    images: [laundry1Image, laundry3Image, laundry6Image, laundry4Image, laundry5Image, laundry8Image],
  },
  {
    id: "LT2024002",
    routeId: "LT2024002",
    displayId: "LT2024002",
    date: "March 16, 2024",
    status: "Ironing",
    items: 4,
    progress: 85,
    completion: "March 16, 2024 - 6:00 PM",
    images: [laundry1Image, laundry3Image, laundry6Image, laundry4Image],
  },
  {
    id: "LT2024003",
    routeId: "LT2024003",
    displayId: "LT2024003",
    date: "March 16, 2024",
    status: "Drying",
    items: 4,
    progress: 95,
    completion: "March 16, 2024 - 6:00 PM",
    images: [laundry1Image, laundry3Image, laundry6Image, laundry4Image],
  },
];

export const staticHistoryOrders = [
  {
    id: "LT2024245",
    routeId: "LT2024245",
    displayId: "LT2024245",
    completedText: "Completed on March 12, 2024",
    status: "Completed",
    statusClassName: historyStatusClassMap.Completed,
    eventLabel: "Picked up",
    eventDate: "March 12, 2024",
    date: new Date("2024-03-12"),
    itemsCount: 8,
    previewImages: [laundry1Image, laundry7Image, laundry4Image, jacketImage],
  },
  {
    id: "LT2024244",
    routeId: "LT2024244",
    displayId: "LT2024244",
    completedText: "Completed on March 8, 2024",
    status: "Completed",
    statusClassName: historyStatusClassMap.Completed,
    eventLabel: "Picked up",
    eventDate: "March 8, 2024",
    date: new Date("2024-03-08"),
    itemsCount: 12,
    previewImages: [laundry1Image, laundry2Image, yellowTImage, jacketImage],
  },
  {
    id: "LT2024243",
    routeId: "LT2024243",
    displayId: "LT2024243",
    completedText: "Cancelled on March 5, 2024",
    status: "Cancelled",
    statusClassName: historyStatusClassMap.Cancelled,
    eventLabel: "Cancelled",
    eventDate: "March 5, 2024",
    date: new Date("2024-03-05"),
    itemsCount: 5,
    previewImages: [laundry1Image, laundry7Image, laundry4Image],
  },
  {
    id: "LT2024242",
    routeId: "LT2024242",
    displayId: "LT2024242",
    completedText: "Completed on March 1, 2024",
    status: "Completed",
    statusClassName: historyStatusClassMap.Completed,
    eventLabel: "Picked up",
    eventDate: "March 1, 2024",
    date: new Date("2024-03-01"),
    itemsCount: 9,
    previewImages: [yellowTImage, laundry1Image, laundry2Image, jacketImage],
  },
];

export const getDisplayOrderStatus = (status) =>
  apiStatusLabelMap[String(status || "").trim()] || "Pending";

export const getHistoryStatusClassName = (status) =>
  historyStatusClassMap[status] || "bg-slate-100 text-slate-600";

export const getActiveStatusClassName = (status) =>
  activeStatusClassMap[status] || "bg-slate-100 text-slate-600";

export const getTrackingStatusClassName = (status) => {
  if (status === "Completed") {
    return "rounded-full bg-emerald-100 px-4 py-1 text-sm font-semibold text-emerald-700";
  }

  if (status === "Cancelled") {
    return "rounded-full bg-rose-100 px-4 py-1 text-sm font-semibold text-rose-700";
  }

  if (status === "In Progress") {
    return "rounded-full bg-amber-100 px-4 py-1 text-sm font-semibold text-[#2c4a7d]";
  }

  if (status === "Confirmed") {
    return "rounded-full bg-teal-100 px-4 py-1 text-sm font-semibold text-teal-700";
  }

  return "rounded-full bg-slate-100 px-4 py-1 text-sm font-semibold text-slate-700";
};

export const countOrderItems = (items = []) =>
  items.reduce((total, item) => total + Math.max(Number(item.quantity) || 1, 1), 0);

export const formatOrderDate = (value) =>
  formatDate(value, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

export const formatOrderDateTime = (value) =>
  formatDate(value, {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

export const getOrderPreviewImages = (items = [], limit = 4) => {
  const previewImages = items
    .map((item) => resolveApiAssetUrl(item.imageUrl))
    .filter(Boolean);

  return previewImages.length ? previewImages.slice(0, limit) : fallbackPreviewSlice(limit);
};

export const normalizeApiOrderForActiveCard = (order) => {
  const status = getDisplayOrderStatus(order.status);
  const scheduledForText = formatOrderDateTime(order.scheduledFor);

  return {
    canGeneratePickupShare: true,
    id: order.orderNumber || order.id,
    routeId: order.id,
    displayId: order.orderNumber || order.id,
    date: formatOrderDate(order.createdAt),
    status,
    items: countOrderItems(order.items),
    progress: apiStatusProgressMap[order.status] || 20,
    completion: scheduledForText || "Awaiting pickup schedule",
    images: getOrderPreviewImages(order.items, 6),
  };
};

export const normalizeApiOrderForHistoryCard = (order) => {
  const status = getDisplayOrderStatus(order.status);
  const createdDate = toValidDate(order.createdAt) || new Date();
  const scheduledForText = formatOrderDate(order.scheduledFor);
  const updatedAtText = formatOrderDate(order.updatedAt);

  let completedText = `Created on ${formatOrderDate(order.createdAt)}`;
  let eventLabel = "Created";
  let eventDate = formatOrderDate(order.createdAt);

  if (status === "Completed") {
    completedText = `Completed on ${updatedAtText || formatOrderDate(order.createdAt)}`;
    eventLabel = "Picked up";
    eventDate = updatedAtText || formatOrderDate(order.createdAt);
  } else if (status === "Cancelled") {
    completedText = `Cancelled on ${updatedAtText || formatOrderDate(order.createdAt)}`;
    eventLabel = "Cancelled";
    eventDate = updatedAtText || formatOrderDate(order.createdAt);
  } else if (scheduledForText) {
    completedText = `Scheduled for ${scheduledForText}`;
    eventLabel = "Pickup";
    eventDate = scheduledForText;
  }

  return {
    canGeneratePickupShare: true,
    id: order.orderNumber || order.id,
    routeId: order.id,
    displayId: order.orderNumber || order.id,
    completedText,
    status,
    statusClassName: getHistoryStatusClassName(status),
    eventLabel,
    eventDate,
    date: createdDate,
    itemsCount: countOrderItems(order.items),
    previewImages: getOrderPreviewImages(order.items, 4),
  };
};
