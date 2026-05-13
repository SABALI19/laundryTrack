const DEFAULT_APP_BASE_URL = "http://localhost:5173";

export const getAppBaseUrl = () => {
  const configuredBaseUrl = String(import.meta.env.VITE_APP_BASE_URL || "").trim();

  if (configuredBaseUrl) {
    return configuredBaseUrl.replace(/\/+$/, "");
  }

  if (typeof window !== "undefined" && window.location?.origin) {
    return window.location.origin.replace(/\/+$/, "");
  }

  return DEFAULT_APP_BASE_URL;
};

export const buildSharedOrderUrl = (shareToken) =>
  `${getAppBaseUrl()}/shared-order/${encodeURIComponent(String(shareToken || "").trim())}`;

export const buildOrderShareQrCodeUrl = (shareUrl) =>
  `https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=12&data=${encodeURIComponent(shareUrl)}`;

export const copyTextToClipboard = async (value) => {
  if (typeof navigator === "undefined" || !navigator.clipboard?.writeText) {
    throw new Error("Clipboard access is unavailable on this device.");
  }

  await navigator.clipboard.writeText(value);
};
