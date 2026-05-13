import { useEffect, useState } from "react";
import { Copy, ExternalLink, LoaderCircle, QrCode, X } from "lucide-react";

import Button from "./Button";
import {
  buildOrderShareQrCodeUrl,
  copyTextToClipboard,
} from "../utils/orderShare.js";

const OrderShareModal = ({
  error = "",
  isGenerating = false,
  isOpen = false,
  onClose,
  onGenerate,
  orderLabel = "",
  shareUrl = "",
}) => {
  const [copyMessage, setCopyMessage] = useState("");

  useEffect(() => {
    setCopyMessage("");
  }, [isOpen, shareUrl]);

  if (!isOpen) {
    return null;
  }

  const handleCopyLink = async () => {
    try {
      await copyTextToClipboard(shareUrl);
      setCopyMessage("Share link copied.");
    } catch (copyError) {
      setCopyMessage(copyError.message || "Unable to copy the share link.");
    }
  };

  return (
    <div
      className="fixed inset-0 z-[95] flex items-start justify-center overflow-y-auto bg-slate-900/45 p-2 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="my-2 w-full max-w-[560px] rounded-[1.35rem] bg-white p-4 shadow-[0_28px_70px_rgba(15,23,42,0.24)] sm:my-0 sm:max-h-[calc(100vh-2rem)] sm:overflow-y-auto sm:rounded-[1.6rem] sm:p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-[var(--color-primary)]">
              Pickup QR
            </p>
            <h2 className="mt-2 text-[1.15rem] font-semibold tracking-[-0.03em] text-slate-900 sm:text-[1.5rem]">
              Generate a pickup QR code
            </h2>
            <p className="mt-3 max-w-[44ch] text-[0.84rem] leading-6 text-slate-500 sm:text-[0.92rem] sm:leading-7">
              Create a secure share link for {orderLabel}. The person handling pickup can open it from their phone or scan the QR code to view the order details on your website.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition-colors hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close generate link modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {!shareUrl ? (
          <div className="mt-5 rounded-[1.1rem] border border-dashed border-slate-200 bg-slate-50 p-4 sm:mt-6 sm:rounded-[1.25rem] sm:p-5">
            <div className="flex flex-col items-start gap-3 sm:flex-row sm:gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-[var(--color-primary)] shadow-sm">
                <QrCode className="h-6 w-6" />
              </div>
              <div>
                <p className="text-[0.92rem] font-semibold text-slate-900">
                  Share this order with a pickup helper
                </p>
                <p className="mt-2 text-[0.84rem] leading-6 text-slate-500 sm:text-[0.86rem]">
                  We&apos;ll generate a dedicated link and QR code for this order. Anyone with that link can open the shared pickup view, so only send it to the person you trust to collect the order for you.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-5 grid gap-4 sm:mt-6 sm:gap-5 md:grid-cols-[minmax(0,220px)_minmax(0,1fr)]">
            <div className="mx-auto w-full max-w-[240px] rounded-[1.1rem] bg-slate-50 p-3 sm:max-w-[260px] sm:rounded-[1.25rem] sm:p-4 md:max-w-none">
              <img
                src={buildOrderShareQrCodeUrl(shareUrl)}
                alt={`QR code for ${orderLabel}`}
                className="h-full w-full rounded-[1rem] bg-white object-contain p-3 shadow-sm"
              />
            </div>
            <div className="min-w-0 space-y-4">
              <div className="rounded-[1rem] border border-slate-200 bg-slate-50 p-4 sm:rounded-[1.1rem]">
                <p className="text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-slate-500">
                  Share Link
                </p>
                <p className="mt-2 break-all text-[0.86rem] leading-6 text-slate-700">
                  {shareUrl}
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleCopyLink}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2 text-[0.82rem] font-semibold sm:flex-1"
                >
                  <Copy className="h-4 w-4" />
                  <span>Copy Link</span>
                </Button>
                <Button
                  variant="secondary"
                  size="md"
                  onClick={() => window.open(shareUrl, "_blank", "noopener,noreferrer")}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2 text-[0.82rem] font-semibold sm:flex-1"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>Open Shared Page</span>
                </Button>
              </div>

              {copyMessage && (
                <p className="text-[0.8rem] font-medium text-[var(--color-primary)]">
                  {copyMessage}
                </p>
              )}
            </div>
          </div>
        )}

        {error && (
          <div className="mt-5 rounded-[1rem] bg-red-50 px-4 py-3 text-[0.82rem] text-red-600">
            {error}
          </div>
        )}

        <div className="mt-6 flex flex-col-reverse gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:flex-wrap sm:justify-end sm:pt-5">
          <Button
            variant="secondary"
            size="md"
            onClick={onClose}
            className="w-full rounded-xl px-4 py-2 text-[0.82rem] font-semibold sm:w-auto"
          >
            Close
          </Button>
          {!shareUrl && (
            <Button
              variant="primary"
              size="md"
              onClick={onGenerate}
              disabled={isGenerating}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2 text-[0.82rem] font-semibold sm:w-auto"
            >
              {isGenerating ? (
                <LoaderCircle className="h-4 w-4 animate-spin" />
              ) : (
                <QrCode className="h-4 w-4" />
              )}
              <span>{isGenerating ? "Generating..." : "Generate Link & QR"}</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderShareModal;
