const USERS_KEY = "washa.local.users";
const ORDERS_KEY = "washa.local.orders";
const DRAFTS_KEY = "washa.local.drafts";
const AUTH_KEY = "washa.auth";
const DAY_IN_MS = 24 * 60 * 60 * 1000;
const HOUR_IN_MS = 60 * 60 * 1000;

const defaultSuperAdminEmails = ["elsabalii007@gmail.com"];

const parseEmailList = (value) =>
  String(value || "")
    .split(",")
    .map((email) => email.toLowerCase().trim())
    .filter(Boolean);

const superAdminEmails = new Set([
  ...defaultSuperAdminEmails,
  ...parseEmailList(import.meta.env.VITE_SUPER_ADMIN_EMAILS),
  ...parseEmailList(import.meta.env.VITE_SUPERADMIN_EMAILS),
]);

const readJson = (key, fallback) => {
  if (typeof window === "undefined") return fallback;

  try {
    const value = window.localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

const writeJson = (key, value) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
};

const normalizeEmail = (value) => String(value || "").toLowerCase().trim();

const normalizeRole = (role) => {
  const nextRole = String(role || "")
    .trim()
    .replace(/[\s_-]+/g, "")
    .toLowerCase();

  return nextRole || "customer";
};

const isSuperAdminEmail = (email) => superAdminEmails.has(normalizeEmail(email));

const parseBody = (body) => {
  if (!body) return {};
  if (typeof body === "string") return JSON.parse(body || "{}");
  return body;
};

const getSession = () => readJson(AUTH_KEY, null);

const getCurrentUser = () => {
  const session = getSession();
  const sessionUserId = session?.user?.id;
  const users = readJson(USERS_KEY, []);
  return users.find((user) => user.id === sessionUserId) || session?.user || null;
};

const serializeUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  profileImage: user.profileImage || "",
  role: user.role,
  customerType: user.customerType || "personal",
  createdAt: user.createdAt,
});

const createSessionPayload = (user, rememberMe = true) => {
  const issuedAt = Date.now();
  const isCustomer = user.role === "customer";
  const durationMs = isCustomer && rememberMe ? 14 * DAY_IN_MS : user.role === "staff" ? DAY_IN_MS : 8 * HOUR_IN_MS;
  const expiresAt = issuedAt + durationMs;

  return {
    message: "Local authentication successful.",
    session: {
      durationMs,
      expiresAt: new Date(expiresAt).toISOString(),
      issuedAt: new Date(issuedAt).toISOString(),
      policy: `${Math.round(durationMs / HOUR_IN_MS)}-hour local session`,
      rememberMe: isCustomer ? rememberMe !== false : true,
    },
    token: `local-token-${user.id}-${issuedAt}`,
    tokenExpiresAt: new Date(expiresAt).toISOString(),
    tokenExpiresInMs: durationMs,
    user: serializeUser(user),
  };
};

const upsertUser = (nextUser) => {
  const users = readJson(USERS_KEY, []);
  const existingIndex = users.findIndex((user) => user.email === nextUser.email);

  if (existingIndex >= 0) {
    users[existingIndex] = { ...users[existingIndex], ...nextUser };
  } else {
    users.push(nextUser);
  }

  writeJson(USERS_KEY, users);
  return existingIndex >= 0 ? users[existingIndex] : nextUser;
};

const requireUser = () => {
  const user = getCurrentUser();

  if (!user?.id) {
    throw new Error("Authentication token is required.");
  }

  return user;
};

const buildOrderNumber = (orders) =>
  `LT${new Date().getFullYear()}${String(orders.length + 1).padStart(4, "0")}`;

const normalizeOrderItems = (items = []) =>
  items.map((item, index) => ({
    clientId: item.clientId || item.id || `item-${index + 1}`,
    imageUrl: item.imageData || item.imageUrl || "",
    itemName: item.itemName || item.name || `Item ${index + 1}`,
    notes: item.notes || "",
    quantity: Number(item.quantity) || 1,
    service: item.service || "Wash & Fold",
    unitPrice: Number(item.unitPrice) || 0,
  }));

const findOrder = (orderId) => {
  const orders = readJson(ORDERS_KEY, []);
  return orders.find((order) => order.id === orderId || order.orderNumber === orderId);
};

const createShare = (order) => {
  const shareToken = order.shareToken || `local-share-${order.id}`;
  const orders = readJson(ORDERS_KEY, []).map((existingOrder) =>
    existingOrder.id === order.id ? { ...existingOrder, shareToken } : existingOrder,
  );
  writeJson(ORDERS_KEY, orders);
  return { shareToken };
};

const getOrdersForUser = (user) => {
  const orders = readJson(ORDERS_KEY, []);
  if (["admin", "staff", "superadmin"].includes(normalizeRole(user.role))) return orders;
  return orders.filter((order) => order.customerId === user.id);
};

const getDashboardStats = (orders) => {
  const activeOrders = orders.filter((order) => !["completed", "cancelled"].includes(order.status));

  return {
    alerts: [],
    currentOrderStatus: {
      items: [
        { label: "Pending", value: orders.filter((order) => order.status === "pending").length },
        { label: "In Progress", value: orders.filter((order) => order.status === "in-progress").length },
        { label: "Completed", value: orders.filter((order) => order.status === "completed").length },
      ],
    },
    generatedAt: new Date().toISOString(),
    orderVolumeTrend: {
      dataPoints: [2, 4, 3, 5, Math.max(orders.length, 1)],
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    },
    quickActions: ["View All Orders", "Dispute Management", "Performance Reports", "Staff Schedule"],
    recentActivity: orders.slice(-5).reverse().map((order) => ({
      id: order.id,
      message: `Order ${order.orderNumber} was created`,
      time: order.createdAt,
      title: "New order",
    })),
    stats: [
      { id: "orders-today", title: "Orders Today", value: String(orders.length), change: "+0%" },
      { id: "active-orders", title: "Active Orders", value: String(activeOrders.length), change: "+0%" },
      { id: "revenue-today", title: "Revenue Today", value: "$0", change: "+0%" },
      { id: "customer-satisfaction", title: "Customer Satisfaction", value: "4.8", reviewCount: 0 },
    ],
  };
};

const handleAuth = (path, options) => {
  const body = parseBody(options.body);
  const email = normalizeEmail(body.email);
  const users = readJson(USERS_KEY, []);
  const isSuperAdminPath = path === "/auth/superadmin" || path === "/auth/super-admin";

  if (!email || !body.password) {
    throw new Error("Email and password are required.");
  }

  if (isSuperAdminPath && !isSuperAdminEmail(email)) {
    throw new Error("This email is not authorized for super admin access.");
  }

  if (path === "/auth/login" || isSuperAdminPath) {
    let user = users.find((existingUser) => existingUser.email === email);
    const requestedRole = normalizeRole(body.role || user?.role || "customer");

    if (!user && (isSuperAdminPath || ["admin", "staff"].includes(requestedRole))) {
      user = upsertUser({
        createdAt: new Date().toISOString(),
        customerType: requestedRole === "staff" ? "personal" : "business",
        email,
        id: `local-user-${Date.now()}`,
        name: body.name || (isSuperAdminPath ? "Super Admin" : `${requestedRole[0].toUpperCase()}${requestedRole.slice(1)} User`),
        password: body.password,
        phone: body.phone || "0000000000",
        role: isSuperAdminPath ? "superadmin" : requestedRole,
      });
    }

    if (!user || user.password !== body.password) {
      throw new Error("Invalid email or password.");
    }

    if (isSuperAdminEmail(email) && user.role !== "superadmin") {
      user = upsertUser({ ...user, role: "superadmin" });
    }

    if (!isSuperAdminEmail(email) && ["admin", "staff", "superadmin"].includes(requestedRole) && user.role !== requestedRole) {
      throw new Error(`This account is not registered as a ${requestedRole}.`);
    }

    return createSessionPayload(user, body.rememberMe);
  }

  if (path === "/auth/signup") {
    if (users.some((user) => user.email === email)) {
      throw new Error("An account with this email already exists.");
    }

    const role = isSuperAdminEmail(email) ? "superadmin" : normalizeRole(body.role || "customer");
    const user = upsertUser({
      createdAt: new Date().toISOString(),
      customerType: body.customerType || "personal",
      email,
      id: `local-user-${Date.now()}`,
      name: body.name || body.fullName,
      password: body.password,
      phone: body.phone || body.phoneNumber,
      role,
    });

    return createSessionPayload(user, body.rememberMe);
  }

  throw new Error("Unsupported local auth endpoint.");
};

export const runLocalApiRequest = async (path, options = {}) => {
  const method = String(options.method || "GET").toUpperCase();
  const url = new URL(path, "http://local");
  const pathname = url.pathname;

  if (pathname.startsWith("/auth/")) {
    return handleAuth(pathname, options);
  }

  if (pathname === "/orders/share/:token") {
    throw new Error("Invalid share token.");
  }

  if (pathname.startsWith("/orders/share/")) {
    const token = decodeURIComponent(pathname.replace("/orders/share/", ""));
    const order = readJson(ORDERS_KEY, []).find((existingOrder) => existingOrder.shareToken === token);
    if (!order) throw new Error("Shared order not found.");
    return { order };
  }

  const user = requireUser();

  if (pathname === "/orders" && method === "GET") {
    return { orders: getOrdersForUser(user) };
  }

  if (pathname === "/orders" && method === "POST") {
    const body = parseBody(options.body);
    const orders = readJson(ORDERS_KEY, []);
    const now = new Date().toISOString();
    const order = {
      createdAt: now,
      customerId: user.id,
      deliveryAddress: body.deliveryAddress || "",
      id: `local-order-${Date.now()}`,
      items: normalizeOrderItems(body.items),
      notes: body.notes || "",
      orderNumber: buildOrderNumber(orders),
      pickupAddress: body.pickupAddress || "",
      scheduledFor: body.scheduledFor || now,
      serviceType: body.serviceType || "Wash & Fold",
      status: "pending",
      totalAmount: Number(body.totalAmount) || 0,
      updatedAt: now,
    };
    orders.push(order);
    writeJson(ORDERS_KEY, orders);
    return { message: "Order created locally.", order };
  }

  if (pathname === "/orders/drafts/latest" && method === "GET") {
    const draft = readJson(DRAFTS_KEY, {})[user.id];
    if (!draft) throw new Error("No draft order found.");
    return { draft };
  }

  if (pathname === "/orders/drafts" && method === "POST") {
    const draft = {
      ...parseBody(options.body),
      id: `local-draft-${Date.now()}`,
      updatedAt: new Date().toISOString(),
    };
    writeJson(DRAFTS_KEY, { ...readJson(DRAFTS_KEY, {}), [user.id]: draft });
    return { draft };
  }

  if (pathname.startsWith("/orders/drafts/")) {
    const drafts = readJson(DRAFTS_KEY, {});
    const draftId = pathname.replace("/orders/drafts/", "");

    if (method === "DELETE") {
      delete drafts[user.id];
      writeJson(DRAFTS_KEY, drafts);
      return { message: "Draft deleted locally." };
    }

    if (method === "PATCH") {
      const draft = {
        ...drafts[user.id],
        ...parseBody(options.body),
        id: draftId,
        updatedAt: new Date().toISOString(),
      };
      writeJson(DRAFTS_KEY, { ...drafts, [user.id]: draft });
      return { draft };
    }
  }

  if (pathname === "/orders/staff/dashboard") {
    return { dashboard: getDashboardStats(readJson(ORDERS_KEY, [])) };
  }

  if (pathname.startsWith("/orders/staff/pickups")) {
    return {
      pickupSchedule: {
        orders: readJson(ORDERS_KEY, []),
        selectedDate: url.searchParams.get("date") || new Date().toISOString().split("T")[0],
      },
    };
  }

  if (pathname.startsWith("/orders/staff/verification/")) {
    const orderId = decodeURIComponent(pathname.replace("/orders/staff/verification/", ""));
    const order = findOrder(orderId);
    if (!order) throw new Error("Order not found.");
    return { verificationOrder: order };
  }

  if (pathname === "/admin/dashboard") {
    return { dashboard: getDashboardStats(readJson(ORDERS_KEY, [])) };
  }

  if (pathname.startsWith("/admin/analytics")) {
    return { analytics: getDashboardStats(readJson(ORDERS_KEY, [])) };
  }

  if (pathname === "/admin/disputes") {
    return { disputesDashboard: { disputes: [], generatedAt: new Date().toISOString(), stats: [] } };
  }

  const shareMatch = pathname.match(/^\/orders\/([^/]+)\/share$/);
  if (shareMatch && method === "POST") {
    const order = findOrder(decodeURIComponent(shareMatch[1]));
    if (!order) throw new Error("Order not found.");
    return { share: createShare(order) };
  }

  const orderMatch = pathname.match(/^\/orders\/([^/]+)$/);
  if (orderMatch) {
    const order = findOrder(decodeURIComponent(orderMatch[1]));
    if (!order) throw new Error("Order not found.");
    return { order };
  }

  return {};
};
