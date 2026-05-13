import {
  AlertTriangle,
  Camera,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CircleX,
  Flag,
  LoaderCircle,
  Mail,
  Phone,
  Save,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";

import Button from "../components/Button";
import useStaffVerification from "../hooks/useStaffVerification.js";
import { resolveApiAssetUrl } from "../utils/auth.js";

const checklistFields = [
  { id: "itemMatchesPhoto", label: "Item matches photo" },
  { id: "categoryCorrect", label: "Category correct" },
  { id: "colorAccurate", label: "Color accurate" },
  { id: "conditionAsDescribed", label: "Condition as described" },
];

const verificationStatusLabelMap = {
  pending: "Pending Review",
  verified: "Verified",
  flagged: "Flagged",
  missing: "Missing",
};

const verificationStatusClassMap = {
  pending: "bg-slate-100 text-slate-600",
  verified: "bg-[var(--color-primary-soft)] text-[var(--color-primary)]",
  flagged: "bg-[var(--color-warm-soft)] text-[var(--color-primary)]",
  missing: "bg-[#f7dada] text-[var(--color-primary)]",
};

const verificationWorkflowLabelMap = {
  "not-started": "Not Started",
  "in-progress": "In Progress",
  completed: "Completed",
};

const buildDraftOrder = (verificationOrder) => ({
  ...verificationOrder,
  items: (verificationOrder?.items || []).map((item) => ({
    ...item,
    verification: {
      ...item.verification,
      checklist: {
        categoryCorrect: Boolean(item.verification?.checklist?.categoryCorrect),
        colorAccurate: Boolean(item.verification?.checklist?.colorAccurate),
        conditionAsDescribed: Boolean(item.verification?.checklist?.conditionAsDescribed),
        itemMatchesPhoto: Boolean(item.verification?.checklist?.itemMatchesPhoto),
      },
    },
  })),
  verification: {
    ...verificationOrder?.verification,
    notifyCustomer:
      verificationOrder?.verification?.notifyCustomer === undefined
        ? true
        : Boolean(verificationOrder.verification.notifyCustomer),
  },
});

const formatDateTime = (value) => {
  if (!value) {
    return "Unavailable";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
};

const formatContactSummary = (customer) =>
  [customer?.phone, customer?.email].filter(Boolean).join(" | ") || "Contact unavailable";

const getResolvedImageSrc = (value) => {
  const normalizedValue = String(value || "").trim();

  if (!normalizedValue) {
    return "";
  }

  if (
    normalizedValue.startsWith("data:") ||
    normalizedValue.startsWith("http://") ||
    normalizedValue.startsWith("https://") ||
    normalizedValue.startsWith("/assets/") ||
    normalizedValue.startsWith("assets/")
  ) {
    return normalizedValue;
  }

  return resolveApiAssetUrl(normalizedValue);
};

const getVerificationStats = (items = []) =>
  items.reduce(
    (stats, item) => {
      const quantity = Math.max(Number(item.quantity) || 0, 1);
      stats.total += quantity;

      if (item.verification?.status === "verified") {
        stats.verified += quantity;
      } else if (item.verification?.status === "flagged") {
        stats.flagged += quantity;
      } else if (item.verification?.status === "missing") {
        stats.missing += quantity;
      } else {
        stats.pending += quantity;
      }

      return stats;
    },
    {
      flagged: 0,
      missing: 0,
      pending: 0,
      total: 0,
      verified: 0,
    },
  );

const readFileAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Unable to read the selected image."));
    reader.readAsDataURL(file);
  });

const ItemVerification = () => {
  const { orderId = "" } = useParams();
  const {
    error,
    isLoading,
    isSaving,
    saveError,
    saveVerificationOrder,
    verificationOrder,
  } = useStaffVerification(orderId);
  const [draftOrder, setDraftOrder] = useState(null);
  const [activeItemIndex, setActiveItemIndex] = useState(0);
  const [statusMessage, setStatusMessage] = useState("");
  const documentationInputRef = useRef(null);

  useEffect(() => {
    if (!verificationOrder) {
      return;
    }

    setDraftOrder(buildDraftOrder(verificationOrder));
    setActiveItemIndex((currentIndex) => {
      const maxIndex = Math.max((verificationOrder.items?.length || 1) - 1, 0);
      return Math.min(currentIndex, maxIndex);
    });
  }, [verificationOrder]);

  const verificationStats = useMemo(
    () => getVerificationStats(draftOrder?.items || []),
    [draftOrder],
  );
  const currentItem = draftOrder?.items?.[activeItemIndex] || null;
  const currentChecklist = currentItem?.verification?.checklist || {};
  const statusClassName =
    verificationStatusClassMap[currentItem?.verification?.status] || verificationStatusClassMap.pending;
  const workflowStatusLabel =
    verificationWorkflowLabelMap[draftOrder?.verification?.status] || "Not Started";

  const updateCurrentItem = (updater) => {
    setDraftOrder((currentDraftOrder) => {
      if (!currentDraftOrder?.items?.[activeItemIndex]) {
        return currentDraftOrder;
      }

      const nextItems = currentDraftOrder.items.map((item, index) =>
        index === activeItemIndex ? updater(item) : item,
      );

      return {
        ...currentDraftOrder,
        items: nextItems,
      };
    });
    setStatusMessage("");
  };

  const handleChecklistChange = (field, checked) => {
    updateCurrentItem((item) => ({
      ...item,
      verification: {
        ...item.verification,
        checklist: {
          ...item.verification.checklist,
          [field]: checked,
        },
      },
    }));
  };

  const handleItemDecision = (status) => {
    updateCurrentItem((item) => {
      const shouldMarkChecklistComplete = status === "verified";

      return {
        ...item,
        verification: {
          ...item.verification,
          issueType: status === "verified" ? "" : item.verification.issueType,
          severity: status === "verified" ? "" : item.verification.severity,
          status,
          checklist: shouldMarkChecklistComplete
            ? {
                categoryCorrect: true,
                colorAccurate: true,
                conditionAsDescribed: true,
                itemMatchesPhoto: true,
              }
            : status === "missing"
              ? {
                  categoryCorrect: false,
                  colorAccurate: false,
                  conditionAsDescribed: false,
                  itemMatchesPhoto: false,
                }
              : item.verification.checklist,
        },
      };
    });
  };

  const handleDocumentationUpload = async (event) => {
    const [file] = Array.from(event.target.files || []);

    if (!file) {
      return;
    }

    try {
      const dataUrl = await readFileAsDataUrl(file);
      updateCurrentItem((item) => ({
        ...item,
        verification: {
          ...item.verification,
          documentationImageData: dataUrl,
          documentationImageUrl: dataUrl,
        },
      }));
    } catch (uploadError) {
      setStatusMessage(uploadError.message || "Unable to read the documentation image.");
    } finally {
      event.target.value = "";
    }
  };

  const buildVerificationPayload = (completeVerification = false) => ({
    completeVerification,
    items: (draftOrder?.items || []).map((item, index) => ({
      checklist: item.verification.checklist,
      documentationImageData: item.verification.documentationImageData || "",
      documentationImageUrl: item.verification.documentationImageUrl || "",
      index,
      issueType: item.verification.issueType || "",
      notes: item.verification.notes || "",
      severity: item.verification.severity || "",
      status: item.verification.status || "pending",
    })),
    notifyCustomer: Boolean(draftOrder?.verification?.notifyCustomer),
    orderNotes: draftOrder?.orderNotes || "",
  });

  const handleSave = async (completeVerification = false) => {
    if (!draftOrder) {
      return;
    }

    try {
      const nextOrder = await saveVerificationOrder(buildVerificationPayload(completeVerification));
      if (nextOrder) {
        setDraftOrder(buildDraftOrder(nextOrder));
      }
      setStatusMessage(
        completeVerification
          ? "Verification completed and synced with the workflow."
          : "Verification progress saved.",
      );
    } catch {
      setStatusMessage("");
    }
  };

  if (isLoading) {
    return (
      <section className="mx-auto w-full max-w-[1500px] rounded-[2rem] bg-white px-6 py-8 text-[0.95rem] text-slate-500 shadow-[0_6px_24px_rgba(15,23,42,0.06)] ring-1 ring-slate-100">
        <div className="flex items-center gap-3">
          <LoaderCircle className="h-4 w-4 animate-spin text-[var(--color-primary)]" />
          <span>Loading verification workflow...</span>
        </div>
      </section>
    );
  }

  if (error || !draftOrder) {
    return (
      <section className="mx-auto w-full max-w-[1500px] rounded-[2rem] bg-white px-6 py-8 shadow-[0_6px_24px_rgba(15,23,42,0.06)] ring-1 ring-slate-100">
        <div className="rounded-[1rem] bg-red-50 px-4 py-4 text-[0.9rem] text-red-600">
          {error || "Verification order unavailable."}
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-[1500px]">
      <div className="rounded-[2rem] bg-white px-6 py-7 shadow-[0_6px_24px_rgba(15,23,42,0.06)] ring-1 ring-slate-100 sm:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-[2rem] font-semibold tracking-[-0.04em] text-slate-900 sm:text-[2.5rem]">
              Order Verification - #{draftOrder.orderId}
            </h1>
            <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-[0.95rem] text-slate-500">
              <p>Submitted: {formatDateTime(draftOrder.submittedAt)}</p>
              <p>Customer: {draftOrder.customer?.name || "Customer"}</p>
              <p>{formatContactSummary(draftOrder.customer)}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <span className="rounded-full bg-[var(--color-primary-soft)] px-4 py-2 text-[0.92rem] font-medium text-[var(--color-primary)]">
              {draftOrder.itemCount} items total
            </span>
            <span className="rounded-full bg-[var(--color-primary-soft)] px-4 py-2 text-[0.92rem] font-medium text-[var(--color-primary)]">
              {verificationStats.verified} of {verificationStats.total} verified
            </span>
            <span className="rounded-full bg-slate-100 px-4 py-2 text-[0.92rem] font-medium text-slate-700">
              Workflow: {workflowStatusLabel}
            </span>
          </div>
        </div>

        {(statusMessage || saveError) && (
          <div
            className={`mt-6 rounded-[1rem] px-4 py-3 text-[0.84rem] ${
              saveError ? "bg-red-50 text-red-600" : "bg-[var(--color-primary-soft)] text-[var(--color-primary)]"
            }`}
          >
            {saveError || statusMessage}
          </div>
        )}
      </div>

      <div className="mt-8 grid gap-8 xl:grid-cols-[minmax(0,1fr)_420px]">
        <div className="rounded-[2rem] bg-white shadow-[0_6px_24px_rgba(15,23,42,0.06)] ring-1 ring-slate-100">
          <div className="border-b border-slate-100 px-6 py-6 sm:px-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-[1.7rem] font-semibold tracking-[-0.03em] text-slate-900 sm:text-[2rem]">
                Customer Photos
              </h2>
              <span className={`rounded-full px-3 py-1 text-[0.76rem] font-semibold ${statusClassName}`}>
                {verificationStatusLabelMap[currentItem?.verification?.status] || "Pending Review"}
              </span>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            <div className="overflow-hidden rounded-[1.5rem] bg-slate-50">
              {currentItem?.imageUrl ? (
                <img
                  src={getResolvedImageSrc(currentItem.imageUrl)}
                  alt={currentItem.itemName}
                  className="h-[420px] w-full object-cover sm:h-[520px]"
                />
              ) : (
                <div className="flex h-[420px] w-full items-center justify-center text-[0.9rem] text-slate-400 sm:h-[520px]">
                  No customer photo available for this item.
                </div>
              )}
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              <span className="rounded-full bg-[#dce8f6] px-4 py-2 text-[0.9rem] font-medium text-[var(--color-primary)]">
                {currentItem?.itemName || "Unlabeled item"}
              </span>
              <span className="rounded-full bg-[var(--color-primary-soft)] px-4 py-2 text-[0.9rem] font-medium text-[var(--color-primary)]">
                {currentItem?.service || "Service pending"}
              </span>
              <span className="rounded-full bg-slate-100 px-4 py-2 text-[0.9rem] font-medium text-slate-600">
                Qty {currentItem?.quantity || 1}
              </span>
            </div>

            <div className="mt-6 rounded-[1.25rem] bg-slate-50 px-5 py-5">
              <p className="text-[1rem] font-semibold text-slate-900">Customer Notes:</p>
              <p className="mt-3 text-[0.98rem] leading-7 text-slate-600">
                {currentItem?.notes || draftOrder.specialHandlingText}
              </p>
            </div>

            <div className="mt-8 flex items-center justify-between gap-4">
              <Button
                variant="secondary"
                size="md"
                disabled={activeItemIndex === 0}
                onClick={() => setActiveItemIndex((currentIndex) => Math.max(currentIndex - 1, 0))}
                className="inline-flex items-center gap-3 rounded-2xl px-5 py-3 text-[0.9rem]"
              >
                <ChevronLeft className="h-5 w-5" />
                <span>Previous</span>
              </Button>

              <p className="text-[1rem] font-medium text-slate-900">
                Item {activeItemIndex + 1} of {draftOrder.items.length}
              </p>

              <Button
                variant="secondary"
                size="md"
                disabled={activeItemIndex >= draftOrder.items.length - 1}
                onClick={() =>
                  setActiveItemIndex((currentIndex) =>
                    Math.min(currentIndex + 1, draftOrder.items.length - 1),
                  )
                }
                className="inline-flex items-center gap-3 rounded-2xl px-5 py-3 text-[0.9rem]"
              >
                <span>Next</span>
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>

            <div className="mt-8 flex gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {draftOrder.items.map((item, index) => (
                <button
                  key={`${item.id}-${index}`}
                  type="button"
                  onClick={() => setActiveItemIndex(index)}
                  className={`h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 ${
                    activeItemIndex === index
                      ? "border-[var(--color-primary)]"
                      : "border-slate-200"
                  }`}
                >
                  {item.imageUrl ? (
                    <img
                      src={getResolvedImageSrc(item.imageUrl)}
                      alt={item.itemName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-slate-50 text-[0.7rem] text-slate-400">
                      No photo
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <section className="rounded-[2rem] bg-white shadow-[0_6px_24px_rgba(15,23,42,0.06)] ring-1 ring-slate-100">
            <div className="border-b border-slate-100 px-6 py-6">
              <h2 className="text-[1.7rem] font-semibold tracking-[-0.03em] text-slate-900 sm:text-[2rem]">
                Physical Item Check
              </h2>
            </div>

            <div className="space-y-6 p-6">
              <div>
                <h3 className="text-[1.2rem] font-semibold text-slate-900">
                  Verification Checklist
                </h3>
                <div className="mt-5 space-y-4">
                  {checklistFields.map((item) => (
                    <label key={item.id} className="flex items-center gap-4">
                      <input
                        type="checkbox"
                        checked={Boolean(currentChecklist[item.id])}
                        onChange={(event) => handleChecklistChange(item.id, event.target.checked)}
                        className="h-5 w-5 rounded border-slate-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                      />
                      <span className="text-[1rem] text-slate-800">{item.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-[1.2rem] font-semibold text-slate-900">Issue Review</h3>
                  <span className={`rounded-full px-3 py-1 text-[0.72rem] font-semibold ${statusClassName}`}>
                    {verificationStatusLabelMap[currentItem?.verification?.status] || "Pending Review"}
                  </span>
                </div>

                <div className="mt-4 space-y-4">
                  <label className="block">
                    <span className="mb-2 block text-[0.82rem] font-medium text-slate-500">
                      Issue Type
                    </span>
                    <select
                      value={currentItem?.verification?.issueType || ""}
                      onChange={(event) =>
                        updateCurrentItem((item) => ({
                          ...item,
                          verification: {
                            ...item.verification,
                            issueType: event.target.value,
                          },
                        }))
                      }
                      className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-[0.95rem] text-slate-700 outline-none focus:border-[var(--color-primary)]"
                    >
                      <option value="">Select issue type</option>
                      {draftOrder.issueTypeOptions.map((issueType) => (
                        <option key={issueType} value={issueType}>
                          {issueType}
                        </option>
                      ))}
                    </select>
                  </label>

                  <input
                    ref={documentationInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleDocumentationUpload}
                    className="hidden"
                  />

                  <Button
                    variant="secondary"
                    size="md"
                    onClick={() => documentationInputRef.current?.click()}
                    className="flex w-full items-center justify-center gap-3 rounded-2xl px-6 py-4 text-[0.95rem]"
                  >
                    <Camera className="h-5 w-5" />
                    <span>Capture Documentation Photo</span>
                  </Button>

                  {currentItem?.verification?.documentationImageUrl && (
                    <div className="overflow-hidden rounded-[1rem] border border-slate-200">
                      <img
                        src={getResolvedImageSrc(currentItem.verification.documentationImageUrl)}
                        alt={`${currentItem.itemName} verification documentation`}
                        className="h-32 w-full object-cover"
                      />
                    </div>
                  )}

                  <textarea
                    value={currentItem?.verification?.notes || ""}
                    onChange={(event) =>
                      updateCurrentItem((item) => ({
                        ...item,
                        verification: {
                          ...item.verification,
                          notes: event.target.value,
                        },
                      }))
                    }
                    placeholder="Describe the issue in detail..."
                    className="min-h-[110px] w-full rounded-2xl border border-slate-200 px-5 py-4 text-[0.95rem] text-slate-700 outline-none placeholder:text-slate-400 focus:border-[var(--color-primary)]"
                  />

                  <label className="block">
                    <span className="mb-2 block text-[0.82rem] font-medium text-slate-500">
                      Severity Level
                    </span>
                    <select
                      value={currentItem?.verification?.severity || ""}
                      onChange={(event) =>
                        updateCurrentItem((item) => ({
                          ...item,
                          verification: {
                            ...item.verification,
                            severity: event.target.value,
                          },
                        }))
                      }
                      className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-[0.95rem] text-slate-700 outline-none focus:border-[var(--color-primary)]"
                    >
                      <option value="">Severity level</option>
                      {draftOrder.severityOptions.map((severity) => (
                        <option key={severity} value={severity}>
                          {severity.charAt(0).toUpperCase() + severity.slice(1)}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              </div>

              <div className="space-y-4">
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => handleItemDecision("verified")}
                  className="flex w-full items-center justify-center gap-3 rounded-2xl px-6 py-4 text-[0.95rem]"
                >
                  <Check className="h-5 w-5" />
                  <span>Confirm Item</span>
                </Button>

                <button
                  type="button"
                  onClick={() => handleItemDecision("flagged")}
                  className="flex w-full items-center justify-center gap-3 rounded-2xl bg-[var(--color-warm-soft)] px-6 py-4 text-[0.95rem] font-semibold text-[var(--color-primary)]"
                >
                  <Flag className="h-5 w-5" />
                  <span>Flag for Review</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleItemDecision("missing")}
                  className="flex w-full items-center justify-center gap-3 rounded-2xl bg-[#f7dada] px-6 py-4 text-[0.95rem] font-semibold text-[var(--color-primary)]"
                >
                  <CircleX className="h-5 w-5" />
                  <span>Item Not Found</span>
                </button>
              </div>
            </div>
          </section>

          <section className="rounded-[2rem] bg-white p-6 shadow-[0_6px_24px_rgba(15,23,42,0.06)] ring-1 ring-slate-100">
            <h2 className="text-[1.55rem] font-semibold tracking-[-0.03em] text-slate-900">
              Verification Summary
            </h2>

            <div className="mt-6 space-y-5">
              {[
                {
                  id: "verified",
                  label: "Verified items",
                  value: verificationStats.verified,
                  Icon: CheckCircle2,
                },
                {
                  id: "flagged",
                  label: "Flagged items",
                  value: verificationStats.flagged,
                  Icon: Flag,
                },
                {
                  id: "missing",
                  label: "Missing items",
                  value: verificationStats.missing,
                  Icon: CircleX,
                },
                {
                  id: "pending",
                  label: "Pending items",
                  value: verificationStats.pending,
                  Icon: AlertTriangle,
                },
              ].map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <item.Icon className="h-5 w-5 text-[var(--color-primary)]" />
                    <span className="text-[1rem] text-slate-600">{item.label}</span>
                  </div>
                  <span className="text-[1.1rem] font-semibold text-[var(--color-primary)]">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-7 space-y-3">
              <Button
                variant="secondary"
                size="md"
                disabled={isSaving}
                onClick={() => handleSave(false)}
                className="flex w-full items-center justify-center gap-3 rounded-2xl px-6 py-4 text-[0.95rem]"
              >
                {isSaving ? <LoaderCircle className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                <span>{isSaving ? "Saving..." : "Save Progress"}</span>
              </Button>
              <Button
                variant="primary"
                size="md"
                disabled={isSaving || verificationStats.pending > 0}
                onClick={() => handleSave(true)}
                className="flex w-full items-center justify-center rounded-2xl px-6 py-4 text-[0.95rem]"
              >
                Complete Verification
              </Button>
            </div>
          </section>

          <section className="rounded-[2rem] bg-white p-6 shadow-[0_6px_24px_rgba(15,23,42,0.06)] ring-1 ring-slate-100">
            <h2 className="text-[1.55rem] font-semibold tracking-[-0.03em] text-slate-900">
              Order Notes
            </h2>

            <textarea
              value={draftOrder.orderNotes || ""}
              onChange={(event) => {
                setDraftOrder((currentDraftOrder) => ({
                  ...currentDraftOrder,
                  orderNotes: event.target.value,
                }));
                setStatusMessage("");
              }}
              placeholder="Add overall verification notes..."
              className="mt-6 min-h-[120px] w-full rounded-2xl border border-slate-200 px-5 py-4 text-[0.95rem] text-slate-700 outline-none placeholder:text-slate-400 focus:border-[var(--color-primary)]"
            />

            <label className="mt-6 flex items-center gap-4">
              <input
                type="checkbox"
                checked={Boolean(draftOrder.verification.notifyCustomer)}
                onChange={(event) =>
                  setDraftOrder((currentDraftOrder) => ({
                    ...currentDraftOrder,
                    verification: {
                      ...currentDraftOrder.verification,
                      notifyCustomer: event.target.checked,
                    },
                  }))
                }
                className="h-5 w-5 rounded border-slate-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
              />
              <span className="text-[1rem] text-slate-800">Notify customer after verification</span>
            </label>

            <div className="mt-6 flex flex-wrap gap-3 text-[0.82rem] text-slate-500">
              {draftOrder.customer?.phone && (
                <a
                  href={draftOrder.customer.contactHref}
                  className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 font-medium text-slate-600"
                >
                  <Phone className="h-3.5 w-3.5" />
                  <span>{draftOrder.customer.phone}</span>
                </a>
              )}
              {draftOrder.customer?.email && (
                <a
                  href={`mailto:${draftOrder.customer.email}`}
                  className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 font-medium text-slate-600"
                >
                  <Mail className="h-3.5 w-3.5" />
                  <span>{draftOrder.customer.email}</span>
                </a>
              )}
            </div>

            <div className="mt-6 rounded-[1.25rem] bg-slate-50 px-5 py-5">
              <p className="text-[1rem] font-semibold text-slate-900">Special Handling:</p>
              <p className="mt-3 text-[0.98rem] leading-7 text-slate-600">
                {draftOrder.specialHandlingText}
              </p>
            </div>
          </section>
        </div>
      </div>
    </section>
  );
};

export default ItemVerification;
