import { runLocalApiRequest } from "./localApi.js";

const DEFAULT_API_BASE_URL = "http://localhost:9000/api";
const AUTH_STORAGE_KEY = "washa.auth";
const AUTH_SESSION_CHANGE_EVENT = "washa:auth-session-change";
const HOUR_IN_MS = 60 * 60 * 1000;
const DAY_IN_MS = 24 * HOUR_IN_MS;
let cachedAuthSessionRaw = null;
let cachedAuthSessionValue = null;

const normalizeApiBaseUrl = (value) => {
  const configuredBaseUrl = String(value || "").trim();

  if (!configuredBaseUrl) {
    return DEFAULT_API_BASE_URL;
  }

  const withoutTrailingSlash = configuredBaseUrl.replace(/\/+$/, "");

  if (withoutTrailingSlash.endsWith("/api")) {
    return withoutTrailingSlash;
  }

  return `${withoutTrailingSlash}/api`;
};

const API_BASE_URL = normalizeApiBaseUrl(import.meta.env.VITE_API_BASE_URL);
const API_ORIGIN = API_BASE_URL.replace(/\/api$/, "");
const USE_LOCAL_STORAGE_API = import.meta.env.VITE_USE_LOCAL_STORAGE_API === "true";
const DEFAULT_SUPER_ADMIN_EMAILS = ["elsabalii007@gmail.com"];

const parseEmailList = (value) =>
  String(value || "")
    .split(",")
    .map((email) => email.toLowerCase().trim())
    .filter(Boolean);

const SUPER_ADMIN_EMAILS = new Set([
  ...DEFAULT_SUPER_ADMIN_EMAILS,
  ...parseEmailList(import.meta.env.VITE_SUPER_ADMIN_EMAILS),
  ...parseEmailList(import.meta.env.VITE_SUPERADMIN_EMAILS),
]);

const SESSION_POLICIES = {
  admin: {
    durationMs: 8 * HOUR_IN_MS,
    checkboxDisabled: true,
    checkboxLabel: "Admin sessions expire after 8 hours",
    helperText: "Admins need a fresh sign-in every 8 hours for tighter security.",
    summary: "8-hour admin session",
  },
  superadmin: {
    durationMs: 8 * HOUR_IN_MS,
    checkboxDisabled: true,
    checkboxLabel: "Super admin sessions expire after 8 hours",
    helperText: "Super admins need a fresh sign-in every 8 hours for tighter security.",
    summary: "8-hour super admin session",
  },
  customer: {
    durationMs: 14 * DAY_IN_MS,
    checkboxDisabled: false,
    checkboxLabel: "Keep me signed in for 2 weeks",
    helperText: "Customer sessions can stay active for up to 14 days.",
    summary: "2-week customer session",
  },
  default: {
    durationMs: DAY_IN_MS,
    checkboxDisabled: true,
    checkboxLabel: "Session expires after 24 hours",
    helperText: "This account will need a fresh sign-in after 24 hours.",
    summary: "24-hour session",
  },
  staff: {
    durationMs: DAY_IN_MS,
    checkboxDisabled: true,
    checkboxLabel: "Staff sessions expire after 24 hours",
    helperText: "Staff accounts automatically need a fresh sign-in every 24 hours.",
    summary: "24-hour staff session",
  },
};

let refreshPromise = null;

const parseTimestamp = (value) => {
  if (!value) {
    return null;
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  const parsedValue = Date.parse(String(value));
  return Number.isNaN(parsedValue) ? null : parsedValue;
};

const parseDurationMs = (value) => {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue) || numericValue <= 0) {
    return null;
  }

  return numericValue;
};

const readStoredAuthSession = () => {
  if (typeof window === "undefined") {
    return null;
  }

  const rawValue = localStorage.getItem(AUTH_STORAGE_KEY);

  if (!rawValue) {
    cachedAuthSessionRaw = null;
    cachedAuthSessionValue = null;
    return null;
  }

  if (rawValue === cachedAuthSessionRaw) {
    return cachedAuthSessionValue;
  }

  try {
    const parsedSession = JSON.parse(rawValue);
    cachedAuthSessionRaw = rawValue;
    cachedAuthSessionValue = parsedSession;
    return parsedSession;
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    cachedAuthSessionRaw = null;
    cachedAuthSessionValue = null;
    return null;
  }
};

const dispatchAuthSessionChange = (detail = {}) => {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new CustomEvent(AUTH_SESSION_CHANGE_EVENT, { detail }));
};

const getStoredSessionMeta = (session) => session?.session || {};

const getStoredSessionExpiration = (session) =>
  parseTimestamp(getStoredSessionMeta(session).expiresAt);

const getStoredAccessTokenExpiration = (session) =>
  parseTimestamp(getStoredSessionMeta(session).accessTokenExpiresAt) ||
  parseTimestamp(session?.tokenExpiresAt);

const getStoredSessionIssuedAt = (session) =>
  parseTimestamp(getStoredSessionMeta(session).issuedAt) || Date.now();

const buildSessionMetadata = (session, options = {}) => {
  const role = session?.user?.role || options.role || "customer";
  const policy = getSessionPolicyForRole(role);
  const rememberMe =
    options.rememberMe ?? getStoredSessionMeta(session).rememberMe ?? role !== "customer";
  const issuedAtMs = parseTimestamp(options.issuedAt) || getStoredSessionIssuedAt(session);
  const sessionDurationMs =
    parseDurationMs(options.durationMs) ||
    parseDurationMs(getStoredSessionMeta(session).durationMs) ||
    policy.durationMs;
  const sessionExpiresAtMs =
    parseTimestamp(options.expiresAt) ||
    getStoredSessionExpiration(session) ||
    issuedAtMs + sessionDurationMs;
  const accessTokenExpiresAtMs =
    parseTimestamp(options.accessTokenExpiresAt) ||
    getStoredAccessTokenExpiration(session) ||
    sessionExpiresAtMs;

  return {
    accessTokenExpiresAt: new Date(accessTokenExpiresAtMs).toISOString(),
    durationMs: sessionDurationMs,
    expiresAt: new Date(sessionExpiresAtMs).toISOString(),
    issuedAt: new Date(issuedAtMs).toISOString(),
    policy: options.policy || getStoredSessionMeta(session).policy || policy.summary,
    rememberMe,
  };
};

const pruneInvalidAuthSession = (reason = "expired") => {
  if (typeof window === "undefined") {
    return null;
  }

  const session = readStoredAuthSession();

  if (!session) {
    return null;
  }

  if (!isAuthSessionExpired(session)) {
    return session;
  }

  localStorage.removeItem(AUTH_STORAGE_KEY);
  dispatchAuthSessionChange({ reason });
  return null;
};

const performRefreshRequest = async () => {
  const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Unable to refresh session.");
  }

  return data;
};

const shouldAttemptRefreshForPath = (path) =>
  !path.startsWith("/auth/login") &&
  !path.startsWith("/auth/signup") &&
  !path.startsWith("/auth/refresh") &&
  !path.startsWith("/auth/logout");

const getFetchBodyType = (body) => body instanceof FormData;

const buildRequestHeaders = (headers, body) => {
  const nextHeaders = {
    ...(headers || {}),
  };

  if (!getFetchBodyType(body) && !nextHeaders["Content-Type"]) {
    nextHeaders["Content-Type"] = "application/json";
  }

  return nextHeaders;
};

const runAuthorizedFetch = async (path, options = {}, sessionOverride) => {
  const { headers: customHeaders, ...fetchOptions } = options;
  const headers = buildRequestHeaders(customHeaders, fetchOptions.body);
  const resolvedSession = sessionOverride || getAuthSession();

  if (resolvedSession?.token && !headers.Authorization) {
    headers.Authorization = `Bearer ${resolvedSession.token}`;
  }

  return fetch(`${API_BASE_URL}${path}`, {
    credentials: "include",
    headers,
    ...fetchOptions,
  });
};

export const accountRoleLabelMap = {
  Customer: "customer",
  Staff: "staff",
  Admin: "admin",
  "Super Admin": "superadmin",
};

export const isSuperAdminEmail = (email) =>
  SUPER_ADMIN_EMAILS.has(String(email || "").toLowerCase().trim());

export const customerTypeLabelMap = {
  "Personal Customer": "personal",
  "Business Customer": "business",
};

export const normalizeUserRole = (role) => {
  const normalizedRole = String(role || "")
    .trim()
    .replace(/[\s_-]+/g, "")
    .toLowerCase();

  if (normalizedRole === "superadmin") {
    return "superadmin";
  }

  return normalizedRole;
};

export const getDashboardPathForRole = (role) => {
  switch (normalizeUserRole(role)) {
    case "superadmin":
      return "/super-admin/dashboard";
    case "admin":
      return "/admin/dashboard";
    case "staff":
      return "/staff/dashboard";
    case "customer":
    default:
      return "/dashboard/customer";
  }
};

export const getSessionPolicyForRole = (role) =>
  SESSION_POLICIES[normalizeUserRole(role)] || SESSION_POLICIES.default;

export const isAuthSessionExpired = (session) => {
  if (!normalizeUserRole(session?.user?.role)) {
    return true;
  }

  const expiresAtMs = getStoredSessionExpiration(session);

  if (!expiresAtMs) {
    return false;
  }

  return expiresAtMs <= Date.now();
};

export const isAccessTokenExpired = (session) => {
  if (!session?.token) {
    return true;
  }

  const expiresAtMs = getStoredAccessTokenExpiration(session);

  if (!expiresAtMs) {
    return false;
  }

  return expiresAtMs <= Date.now();
};

export const saveAuthSession = (session, options = {}) => {
  if (typeof window === "undefined") {
    return;
  }

  const normalizedSession = {
    ...session,
    session: {
      ...getStoredSessionMeta(session),
      ...buildSessionMetadata(session, {
        accessTokenExpiresAt: options.accessTokenExpiresAt || session?.tokenExpiresAt,
        durationMs: options.durationMs || session?.session?.durationMs,
        expiresAt: options.expiresAt || session?.session?.expiresAt,
        issuedAt: options.issuedAt || session?.session?.issuedAt,
        policy: options.policy || session?.session?.policy,
        rememberMe:
          options.rememberMe ??
          session?.session?.rememberMe ??
          getStoredSessionMeta(readStoredAuthSession()).rememberMe,
        role: options.role,
      }),
    },
  };

  cachedAuthSessionValue = normalizedSession;
  cachedAuthSessionRaw = JSON.stringify(normalizedSession);
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(normalizedSession));
  dispatchAuthSessionChange({ reason: "saved", session: normalizedSession });
};

export const getAuthSession = () => {
  const session = readStoredAuthSession();
  return session && !isAuthSessionExpired(session) ? session : null;
};

export const clearAuthSession = (reason = "manual") => {
  if (typeof window === "undefined") {
    return;
  }

  refreshPromise = null;
  cachedAuthSessionRaw = null;
  cachedAuthSessionValue = null;
  localStorage.removeItem(AUTH_STORAGE_KEY);
  dispatchAuthSessionChange({ reason });
};

export const refreshAuthSession = async ({ force = false } = {}) => {
  if (typeof window === "undefined") {
    return null;
  }

  if (USE_LOCAL_STORAGE_API) {
    const storedSession = readStoredAuthSession();

    if (!storedSession || isAuthSessionExpired(storedSession)) {
      pruneInvalidAuthSession();
      return null;
    }

    return storedSession;
  }

  const storedSession = readStoredAuthSession();

  if (!force) {
    if (!storedSession || isAuthSessionExpired(storedSession)) {
      pruneInvalidAuthSession();
      return null;
    }

    if (!isAccessTokenExpired(storedSession)) {
      return storedSession;
    }
  }

  if (!refreshPromise) {
    refreshPromise = performRefreshRequest()
      .then((data) => {
        saveAuthSession(data, {
          accessTokenExpiresAt: data.tokenExpiresAt,
          durationMs: data.session?.durationMs,
          expiresAt: data.session?.expiresAt,
          issuedAt: data.session?.issuedAt,
          policy: data.session?.policy,
          rememberMe: data.session?.rememberMe,
        });
        return getAuthSession();
      })
      .catch((error) => {
        clearAuthSession("expired");
        throw error;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
};

export const logoutAuthSession = async () => {
  if (USE_LOCAL_STORAGE_API) {
    clearAuthSession("manual");
    return;
  }

  try {
    await fetch(`${API_BASE_URL}/auth/logout`, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });
  } finally {
    clearAuthSession("manual");
  }
};

export const subscribeToAuthSession = (callback) => {
  if (typeof window === "undefined") {
    return () => {};
  }

  let expirationTimerId = null;

  const clearExpirationTimer = () => {
    if (expirationTimerId !== null) {
      window.clearTimeout(expirationTimerId);
      expirationTimerId = null;
    }
  };

  const scheduleExpirationCheck = () => {
    clearExpirationTimer();

    const session = getAuthSession();
    const expiresAtMs = getStoredSessionExpiration(session);

    if (!expiresAtMs) {
      return;
    }

    expirationTimerId = window.setTimeout(() => {
      pruneInvalidAuthSession();
      callback();
      scheduleExpirationCheck();
    }, Math.max(expiresAtMs - Date.now(), 0) + 50);
  };

  const syncSessionState = () => {
    pruneInvalidAuthSession();
    scheduleExpirationCheck();
    callback();
  };

  const handleStorage = (event) => {
    if (event.key === AUTH_STORAGE_KEY) {
      syncSessionState();
    }
  };

  window.addEventListener("storage", handleStorage);
  window.addEventListener(AUTH_SESSION_CHANGE_EVENT, syncSessionState);

  pruneInvalidAuthSession();
  scheduleExpirationCheck();

  return () => {
    clearExpirationTimer();
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(AUTH_SESSION_CHANGE_EVENT, syncSessionState);
  };
};

export const resolveApiAssetUrl = (value) => {
  const normalizedValue = String(value || "").trim();

  if (!normalizedValue) {
    return "";
  }

  if (
    normalizedValue.startsWith("data:") ||
    normalizedValue.startsWith("http://") ||
    normalizedValue.startsWith("https://")
  ) {
    return normalizedValue;
  }

  return `${API_ORIGIN}${normalizedValue.startsWith("/") ? "" : "/"}${normalizedValue}`;
};

export const apiRequest = async (path, options = {}) => {
  const { retryOnAuth = true, ...fetchOptions } = options;

  if (USE_LOCAL_STORAGE_API) {
    return runLocalApiRequest(path, fetchOptions);
  }

  pruneInvalidAuthSession();

  let session = getAuthSession();

  if (session && isAccessTokenExpired(session) && shouldAttemptRefreshForPath(path)) {
    session = await refreshAuthSession().catch(() => null);
  }

  let response = await runAuthorizedFetch(path, fetchOptions, session);
  let data = await response.json().catch(() => ({}));

  if (
    (response.status === 401 || response.status === 403) &&
    retryOnAuth &&
    shouldAttemptRefreshForPath(path)
  ) {
    const refreshedSession = await refreshAuthSession({ force: true }).catch(() => null);

    if (refreshedSession?.token) {
      response = await runAuthorizedFetch(path, fetchOptions, refreshedSession);
      data = await response.json().catch(() => ({}));
    }
  }

  if (response.status === 401 || response.status === 403) {
    clearAuthSession("unauthorized");
  }

  if (!response.ok) {
    throw new Error(data.message || "Request failed.");
  }

  return data;
};
