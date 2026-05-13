import Button from "../components/Button.jsx";
import CameraReviewSection from "../components/common/CameraReviewSection.jsx";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import {
  apiRequest,
  getAuthSession,
  resolveApiAssetUrl,
} from "../utils/auth.js";

const LOCAL_DRAFT_STORAGE_KEY = "washa-new-order-draft";

const orderSteps = [
  { id: 1, label: "Photo Capture" },
  { id: 2, label: "Item Details" },
  { id: 3, label: "Pickup Time" },
  { id: 4, label: "Review & Confirm" },
];

const serviceOptions = [
  "Wash & Fold",
  "Dry Cleaning",
  "Ironing",
  "Stain Treatment",
];

const pickupWindows = [
  "9:00 AM - 12:00 PM",
  "12:00 PM - 3:00 PM",
  "3:00 PM - 6:00 PM",
  "6:00 PM - 8:00 PM",
];

const stepContent = {
  1: {
    title: "Photograph each clothing item",
    description:
      "Take clear photos of each item you want to include in your laundry order.",
  },
  2: {
    title: "Add item details",
    description:
      "Review each captured item, confirm the item name, and choose the service needed.",
  },
  3: {
    title: "Choose your pickup time",
    description:
      "Select the preferred pickup window and share any delivery or handling instructions.",
  },
  4: {
    title: "Review and confirm",
    description:
      "Double-check your items and pickup information before submitting the order.",
  },
};

const createDefaultPickupDetails = () => ({
  pickupDate: "",
  pickupWindow: "",
  pickupAddress: "",
  deliveryAddress: "",
  instructions: "",
});

const getTodayDateValue = () => new Date().toISOString().split("T")[0];

const normalizeCapturedItems = (items = []) =>
  items.map((item, index) => ({
    ...item,
    id: item.id || item.clientId || `item-${Date.now()}-${index + 1}`,
    name:
      String(item.name || item.itemName || "").trim() || `Item ${index + 1}`,
    service: item.service || "Wash & Fold",
    notes: item.notes || "",
    quantity:
      Number.isFinite(Number(item.quantity)) && Number(item.quantity) > 0
        ? Number(item.quantity)
        : 1,
    imageUrl: item.imageUrl || "",
    image: item.image || resolveApiAssetUrl(item.imageUrl),
  }));

const getPickupWindowStart = (pickupWindow) => {
  const [startTime] = String(pickupWindow || "").split(" - ");
  const match = startTime?.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return null;

  let hours = Number(match[1]);
  const minutes = Number(match[2]);
  const meridiem = match[3].toUpperCase();

  if (meridiem === "PM" && hours !== 12) hours += 12;
  if (meridiem === "AM" && hours === 12) hours = 0;

  return { hours, minutes };
};

const buildScheduledForValue = (pickupDate, pickupWindow) => {
  if (!pickupDate) return null;
  const scheduledDate = new Date(`${pickupDate}T00:00:00`);
  const start = getPickupWindowStart(pickupWindow);
  if (start) scheduledDate.setHours(start.hours, start.minutes, 0, 0);
  return scheduledDate.toISOString();
};

const buildItemPayload = (item) => ({
  clientId: item.id,
  itemName: item.name.trim(),
  quantity: Number(item.quantity) || 1,
  unitPrice: 0,
  service: item.service || "Wash & Fold",
  notes: item.notes || "",
  imageData: item.image?.startsWith("data:") ? item.image : undefined,
  imageUrl:
    item.imageUrl || (!item.image?.startsWith("data:") ? item.image : ""),
});

const buildDraftPayload = ({ currentStep, capturedItems, pickupDetails }) => ({
  currentStep,
  serviceType: [
    ...new Set(capturedItems.map((item) => item.service || "Wash & Fold")),
  ].join(", "),
  pickupAddress: pickupDetails.pickupAddress.trim(),
  deliveryAddress: pickupDetails.deliveryAddress.trim(),
  pickupWindow: pickupDetails.pickupWindow,
  scheduledFor: buildScheduledForValue(
    pickupDetails.pickupDate,
    pickupDetails.pickupWindow,
  ),
  notes: pickupDetails.instructions.trim(),
  items: normalizeCapturedItems(capturedItems).map(buildItemPayload),
  totalAmount: 0,
});

const buildOrderPayload = ({ capturedItems, pickupDetails }) => {
  const normalizedItems = normalizeCapturedItems(capturedItems);
  const services = [...new Set(normalizedItems.map((item) => item.service))];
  const itemNotes = normalizedItems
    .filter((item) => item.notes.trim())
    .map((item) => `${item.name} (${item.service}): ${item.notes.trim()}`);

  return {
    serviceType:
      services.length === 1
        ? services[0]
        : `Mixed Services (${services.join(", ")})`,
    pickupAddress: pickupDetails.pickupAddress.trim(),
    deliveryAddress: pickupDetails.deliveryAddress.trim(),
    scheduledFor: buildScheduledForValue(
      pickupDetails.pickupDate,
      pickupDetails.pickupWindow,
    ),
    notes: [
      pickupDetails.instructions.trim()
        ? `Pickup instructions: ${pickupDetails.instructions.trim()}`
        : "",
      pickupDetails.pickupWindow
        ? `Preferred pickup window: ${pickupDetails.pickupWindow}`
        : "",
      itemNotes.length ? `Item notes: ${itemNotes.join(" | ")}` : "",
    ]
      .filter(Boolean)
      .join("\n"),
    items: normalizedItems.map(buildItemPayload),
    totalAmount: 0,
  };
};

const mapServerDraftToClientState = (draft) => {
  const scheduledDate = draft.scheduledFor
    ? new Date(draft.scheduledFor)
    : null;

  return {
    draftId: draft.id || "",
    currentStep: draft.currentStep || 1,
    capturedItems: normalizeCapturedItems(
      (draft.items || []).map((item, index) => ({
        id: item.clientId || `draft-item-${index + 1}`,
        name: item.itemName,
        service: item.service,
        notes: item.notes,
        quantity: item.quantity,
        imageUrl: item.imageUrl || "",
        image: resolveApiAssetUrl(item.imageUrl),
      })),
    ),
    pickupDetails: {
      pickupDate:
        scheduledDate && !Number.isNaN(scheduledDate.getTime())
          ? scheduledDate.toISOString().split("T")[0]
          : "",
      pickupWindow: draft.pickupWindow || "",
      pickupAddress: draft.pickupAddress || "",
      deliveryAddress: draft.deliveryAddress || "",
      instructions: draft.notes || "",
    },
  };
};

const NewOrder = () => {
  const navigate = useNavigate();
  const [draftId, setDraftId] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [capturedItems, setCapturedItems] = useState([]);
  const [pickupDetails, setPickupDetails] = useState(
    createDefaultPickupDetails,
  );
  const [notice, setNotice] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [showIntroModal, setShowIntroModal] = useState(true);

  const persistLocalBackup = (
    nextDraftId,
    nextStep,
    nextItems,
    nextPickupDetails,
  ) => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(
      LOCAL_DRAFT_STORAGE_KEY,
      JSON.stringify({
        draftId: nextDraftId,
        currentStep: nextStep,
        capturedItems: nextItems,
        pickupDetails: nextPickupDetails,
        savedAt: new Date().toISOString(),
      }),
    );
  };

  const clearLocalBackup = () => {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(LOCAL_DRAFT_STORAGE_KEY);
  };

  useEffect(() => {
    let mounted = true;

    const restoreLocalDraft = () => {
      if (typeof window === "undefined") return;
      const rawDraft = window.localStorage.getItem(LOCAL_DRAFT_STORAGE_KEY);
      if (!rawDraft) return;

      try {
        const parsedDraft = JSON.parse(rawDraft);
        if (!mounted) return;
        setDraftId(parsedDraft.draftId || "");
        setCurrentStep(parsedDraft.currentStep || 1);
        setCapturedItems(
          normalizeCapturedItems(parsedDraft.capturedItems || []),
        );
        setPickupDetails({
          ...createDefaultPickupDetails(),
          ...(parsedDraft.pickupDetails || {}),
        });
        setNotice({
          type: "info",
          text: parsedDraft.savedAt
            ? `Local draft restored from ${new Date(parsedDraft.savedAt).toLocaleString()}.`
            : "Local draft restored.",
        });
      } catch {
        window.localStorage.removeItem(LOCAL_DRAFT_STORAGE_KEY);
      }
    };

    const restoreDraft = async () => {
      const session = getAuthSession();
      if (!session?.token) {
        restoreLocalDraft();
        return;
      }

      try {
        const data = await apiRequest("/orders/drafts/latest");
        if (!mounted) return;
        const restoredDraft = mapServerDraftToClientState(data.draft);
        setDraftId(restoredDraft.draftId);
        setCurrentStep(restoredDraft.currentStep);
        setCapturedItems(restoredDraft.capturedItems);
        setPickupDetails(restoredDraft.pickupDetails);
        setNotice({
          type: "info",
          text: "Server draft restored successfully.",
        });
      } catch (error) {
        if (error.message !== "No draft order found.") restoreLocalDraft();
        else restoreLocalDraft();
      }
    };

    restoreDraft();
    return () => {
      mounted = false;
    };
  }, []);

  const hasDraftContent = useMemo(
    () =>
      capturedItems.length > 0 ||
      Boolean(pickupDetails.pickupDate) ||
      Boolean(pickupDetails.pickupWindow) ||
      Boolean(pickupDetails.pickupAddress.trim()) ||
      Boolean(pickupDetails.deliveryAddress.trim()) ||
      Boolean(pickupDetails.instructions.trim()),
    [capturedItems, pickupDetails],
  );

  const updateCapturedItem = (itemId, key, value) => {
    setCapturedItems((items) =>
      items.map((item) =>
        item.id === itemId ? { ...item, [key]: value } : item,
      ),
    );
  };

  const saveDraft = async () => {
    if (!hasDraftContent) {
      setNotice({
        type: "warning",
        text: "Add at least one item or pickup detail before saving a draft.",
      });
      return;
    }

    try {
      setIsSavingDraft(true);
      const data = await apiRequest(
        draftId ? `/orders/drafts/${draftId}` : "/orders/drafts",
        {
          method: draftId ? "PATCH" : "POST",
          body: JSON.stringify(
            buildDraftPayload({ currentStep, capturedItems, pickupDetails }),
          ),
        },
      );
      const restoredDraft = mapServerDraftToClientState(data.draft);
      setDraftId(restoredDraft.draftId);
      setCurrentStep(restoredDraft.currentStep);
      setCapturedItems(restoredDraft.capturedItems);
      setPickupDetails(restoredDraft.pickupDetails);
      persistLocalBackup(
        restoredDraft.draftId,
        restoredDraft.currentStep,
        restoredDraft.capturedItems,
        restoredDraft.pickupDetails,
      );
      setNotice({
        type: "success",
        text: "Draft saved to the server successfully.",
      });
    } catch (error) {
      persistLocalBackup(draftId, currentStep, capturedItems, pickupDetails);
      setNotice({
        type: "error",
        text: error.message || "Unable to save draft right now.",
      });
    } finally {
      setIsSavingDraft(false);
    }
  };

  const handleBack = () => {
    setCurrentStep((step) => Math.max(1, step - 1));
    setNotice(null);
  };

  const currentStepContent = stepContent[currentStep];
  const continueLabel =
    currentStep === 1
      ? "Continue to Details"
      : currentStep === 2
        ? "Continue to Pickup"
        : currentStep === 3
          ? "Review Order"
          : "Submit Order";

  const handleContinue = async () => {
    if (currentStep === 1) {
      if (!capturedItems.length) {
        setNotice({
          type: "warning",
          text: "Capture or upload at least one item before continuing.",
        });
        return;
      }

      setCapturedItems((items) => normalizeCapturedItems(items));
      setCurrentStep(2);
      setNotice(null);
      return;
    }

    if (currentStep === 2) {
      const invalidItems = capturedItems.some(
        (item) =>
          !item.name?.trim() ||
          !item.service ||
          !Number.isFinite(Number(item.quantity)) ||
          Number(item.quantity) < 1,
      );

      if (invalidItems) {
        setNotice({
          type: "warning",
          text: "Complete the item name, service, and quantity for every captured item.",
        });
        return;
      }

      setCurrentStep(3);
      setNotice(null);
      return;
    }

    if (currentStep === 3) {
      if (
        !pickupDetails.pickupDate ||
        !pickupDetails.pickupWindow ||
        !pickupDetails.pickupAddress.trim() ||
        !pickupDetails.deliveryAddress.trim()
      ) {
        setNotice({
          type: "warning",
          text: "Add pickup date, pickup window, pickup address, and delivery address before reviewing.",
        });
        return;
      }

      setCurrentStep(4);
      setNotice(null);
      return;
    }

    try {
      setIsSubmitting(true);
      const data = await apiRequest("/orders", {
        method: "POST",
        body: JSON.stringify(
          buildOrderPayload({ capturedItems, pickupDetails }),
        ),
      });

      if (draftId) {
        await apiRequest(`/orders/drafts/${draftId}`, {
          method: "DELETE",
        }).catch(() => undefined);
      }

      clearLocalBackup();
      setDraftId("");

      if (typeof window !== "undefined") {
        window.localStorage.setItem(
          "washa-last-order-submission",
          JSON.stringify({
            submittedAt: new Date().toISOString(),
            pickupDetails,
            order: data.order,
          }),
        );
      }

      navigate("/orders");
    } catch (error) {
      setNotice({
        type: "error",
        text: error.message || "Unable to submit order right now.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-2 sm:px-6 lg:px-8">
      {showIntroModal && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-900/45 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[1.75rem] bg-white p-6 shadow-[0_24px_60px_rgba(15,23,42,0.22)] ring-1 ring-slate-100 sm:p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#2c4a7d]">
              New Order
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-slate-900">
              Ready to capture your laundry items?
            </h2>
            <p className="mt-3 text-base font-roboto leading-7 text-slate-500">
              Create a new order by photographing your items and selecting
              pickup preferences.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Button
                variant="secondary"
                size="md"
                className="inline-flex w-full items-center justify-center rounded-xl px-5 py-3 text-sm sm:w-auto"
                onClick={() => navigate("/dashboard/customer")}
              >
                Back to Dashboard
              </Button>
              <Button
                variant="primary"
                size="md"
                className="inline-flex w-full items-center justify-center rounded-xl px-5 py-3 text-sm sm:w-auto"
                onClick={() => setShowIntroModal(false)}
              >
                Start Order
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-start justify-between gap-8">
        <div className="mb-4">
          <h1 className="text-[#2c4a7d] text-lg sm:text-sm md:text-xs lg:text-lg font-inter font-semibold ">
            New Laundry Order
          </h1>
        </div>

        <Link
          to="/dashboard/customer"
          className="inline-flex items-center gap-2 self-start text-sm font-medium text-[#2c4a7d] transition-colors hover:text-[#415a81]"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span className="hidden md:inline">Back to Dashboard</span>{" "}
          {/* Hidden on mobile, visible on desktop */}
          <span className="md:hidden">Back</span>{" "}
          {/* Visible on mobile, hidden on desktop */}
        </Link>
      </div>

      <div className="mt-5 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="mx-auto flex min-w-max flex-nowrap items-center justify-center gap-4 px-1">
        {orderSteps.map((step, index) => {
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;

          return (
            <div key={step.id} className="flex shrink-0 items-center">
              <div className="flex items-center gap-2">
                <div
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                    isActive || isCompleted
                      ? "bg-[#2c4a7d] text-white"
                      : "bg-slate-200 text-slate-500"
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="h-4 w-4" /> : step.id}
                </div>
                <p
                  className={`whitespace-nowrap text-sm font-medium ${
                    isActive || isCompleted
                      ? "text-[#2c4a7d]"
                      : "text-slate-400"
                  }`}
                >
                  {step.label}
                </p>
              </div>
              {index !== orderSteps.length - 1 && (
                <div className="mx-4 hidden h-px w-16 bg-slate-200 sm:block" />
              )}
            </div>
          );
        })}
        </div>
      </div>

      <div className="mt-6 rounded-lg bg-white p-6 shadow-md ring-1 ring-slate-100">
        <div className="mb-6 text-center">
          <h2 className="text-sm font-semibold text-slate-800">
            {currentStepContent.title}
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            {currentStepContent.description}
          </p>
        </div>

        {notice && (
          <div
            className={`mb-6 rounded-xl px-4 py-3 text-sm ${
              notice.type === "success"
                ? "bg-emerald-50 text-emerald-700"
                : notice.type === "error"
                  ? "bg-red-50 text-red-700"
                  : notice.type === "warning"
                    ? "bg-amber-50 text-amber-700"
                    : "bg-[#dce8f6] text-[#2c4a7d]"
            }`}
          >
            {notice.text}
          </div>
        )}

        {currentStep === 1 && (
          <CameraReviewSection
            capturedItems={capturedItems}
            onCapturedItemsChange={setCapturedItems}
          />
        )}

        {currentStep === 2 && (
          <div className="space-y-4">
            {capturedItems.map((item, index) => (
              <article
                key={item.id}
                className="grid gap-5 rounded-2xl border border-slate-200 p-4 lg:grid-cols-[160px_minmax(0,1fr)]"
              >
                <div className="overflow-hidden rounded-xl bg-slate-100">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-40 w-full object-cover"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="flex flex-col gap-2">
                    <span className="text-sm font-medium text-slate-700">
                      Item name
                    </span>
                    <input
                      type="text"
                      value={item.name || `Item ${index + 1}`}
                      onChange={(event) =>
                        updateCapturedItem(item.id, "name", event.target.value)
                      }
                      className="rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition-colors focus:border-[#2c4a7d]"
                      placeholder={`Item ${index + 1}`}
                    />
                  </label>

                  <label className="flex flex-col gap-2">
                    <span className="text-sm font-medium text-slate-700">
                      Service
                    </span>
                    <select
                      value={item.service || "Wash & Fold"}
                      onChange={(event) =>
                        updateCapturedItem(
                          item.id,
                          "service",
                          event.target.value,
                        )
                      }
                      className="rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition-colors focus:border-[#2c4a7d]"
                    >
                      {serviceOptions.map((service) => (
                        <option key={service} value={service}>
                          {service}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="flex flex-col gap-2">
                    <span className="text-sm font-medium text-slate-700">
                      Quantity
                    </span>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity || 1}
                      onChange={(event) =>
                        updateCapturedItem(
                          item.id,
                          "quantity",
                          event.target.value,
                        )
                      }
                      className="rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition-colors focus:border-[#2c4a7d]"
                    />
                  </label>

                  <label className="sm:col-span-2 flex flex-col gap-2">
                    <span className="text-sm font-medium text-slate-700">
                      Notes
                    </span>
                    <textarea
                      value={item.notes || ""}
                      onChange={(event) =>
                        updateCapturedItem(item.id, "notes", event.target.value)
                      }
                      rows={3}
                      className="rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition-colors focus:border-[#2c4a7d]"
                      placeholder="Add care instructions, stains, or anything the team should know."
                    />
                  </label>
                </div>
              </article>
            ))}
          </div>
        )}

        {currentStep === 3 && (
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_1fr]">
            <div className="space-y-5 rounded-2xl border border-slate-200 p-5">
              <label className="flex flex-col gap-2">
                <span className="text-sm font-medium text-slate-700">
                  Pickup address
                </span>
                <input
                  type="text"
                  value={pickupDetails.pickupAddress}
                  onChange={(event) =>
                    setPickupDetails((current) => ({
                      ...current,
                      pickupAddress: event.target.value,
                    }))
                  }
                  className="rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition-colors focus:border-[#2c4a7d]"
                  placeholder="Enter pickup address"
                />
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-sm font-medium text-slate-700">
                  Delivery address
                </span>
                <input
                  type="text"
                  value={pickupDetails.deliveryAddress}
                  onChange={(event) =>
                    setPickupDetails((current) => ({
                      ...current,
                      deliveryAddress: event.target.value,
                    }))
                  }
                  className="rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition-colors focus:border-[#2c4a7d]"
                  placeholder="Enter delivery address"
                />
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-sm font-medium text-slate-700">
                  Pickup date
                </span>
                <input
                  type="date"
                  min={getTodayDateValue()}
                  value={pickupDetails.pickupDate}
                  onChange={(event) =>
                    setPickupDetails((current) => ({
                      ...current,
                      pickupDate: event.target.value,
                    }))
                  }
                  className="rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition-colors focus:border-[#2c4a7d]"
                />
              </label>

              <div>
                <p className="text-sm font-medium text-slate-700">
                  Pickup window
                </p>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {pickupWindows.map((window) => (
                    <button
                      key={window}
                      type="button"
                      onClick={() =>
                        setPickupDetails((current) => ({
                          ...current,
                          pickupWindow: window,
                        }))
                      }
                      className={`rounded-xl border px-4 py-3 text-left text-sm font-medium transition-colors ${
                        pickupDetails.pickupWindow === window
                          ? "border-[#2c4a7d] bg-[#dce8f6] text-[#2c4a7d]"
                          : "border-slate-200 bg-white text-slate-600 hover:border-[#2c4a7d]/40"
                      }`}
                    >
                      {window}
                    </button>
                  ))}
                </div>
              </div>

              <label className="flex flex-col gap-2">
                <span className="text-sm font-medium text-slate-700">
                  Pickup instructions
                </span>
                <textarea
                  value={pickupDetails.instructions}
                  onChange={(event) =>
                    setPickupDetails((current) => ({
                      ...current,
                      instructions: event.target.value,
                    }))
                  }
                  rows={4}
                  className="rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition-colors focus:border-[#2c4a7d]"
                  placeholder="Gate code, alternate contact, or handling instructions."
                />
              </label>
            </div>

            <aside className="rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-100">
              <h3 className="text-base font-semibold text-slate-900">
                Pickup summary
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                {capturedItems.length} items prepared for pickup.
              </p>
              <div className="mt-5 space-y-4 text-sm text-slate-600">
                <div>
                  <p className="font-medium text-slate-700">Selected date</p>
                  <p>{pickupDetails.pickupDate || "Not selected yet"}</p>
                </div>
                <div>
                  <p className="font-medium text-slate-700">Pickup address</p>
                  <p>{pickupDetails.pickupAddress || "Not entered yet"}</p>
                </div>
                <div>
                  <p className="font-medium text-slate-700">Delivery address</p>
                  <p>{pickupDetails.deliveryAddress || "Not entered yet"}</p>
                </div>
                <div>
                  <p className="font-medium text-slate-700">Selected window</p>
                  <p>{pickupDetails.pickupWindow || "Not selected yet"}</p>
                </div>
                <div>
                  <p className="font-medium text-slate-700">Instructions</p>
                  <p>
                    {pickupDetails.instructions.trim() ||
                      "No special instructions yet."}
                  </p>
                </div>
              </div>
            </aside>
          </div>
        )}

        {currentStep === 4 && (
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-4">
              <div className="rounded-2xl border border-slate-200 p-5">
                <h3 className="text-base font-semibold text-slate-900">
                  Item summary
                </h3>
                <div className="mt-4 space-y-4">
                  {capturedItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-4 rounded-xl bg-slate-50 p-3"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-20 w-20 rounded-xl object-cover"
                      />
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-900">
                          {item.name}
                        </p>
                        <p className="mt-1 text-sm text-slate-600">
                          {item.service} - Qty {item.quantity || 1}
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                          {item.notes || "No item notes added."}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <aside className="rounded-2xl border border-slate-200 p-5">
              <h3 className="text-base font-semibold text-slate-900">
                Pickup details
              </h3>
              <div className="mt-4 space-y-4 text-sm text-slate-600">
                <div>
                  <p className="font-medium text-slate-700">Pickup date</p>
                  <p>{pickupDetails.pickupDate}</p>
                </div>
                <div>
                  <p className="font-medium text-slate-700">Pickup address</p>
                  <p>{pickupDetails.pickupAddress}</p>
                </div>
                <div>
                  <p className="font-medium text-slate-700">Delivery address</p>
                  <p>{pickupDetails.deliveryAddress}</p>
                </div>
                <div>
                  <p className="font-medium text-slate-700">Pickup window</p>
                  <p>{pickupDetails.pickupWindow}</p>
                </div>
                <div>
                  <p className="font-medium text-slate-700">Instructions</p>
                  <p>
                    {pickupDetails.instructions.trim() ||
                      "No pickup instructions added."}
                  </p>
                </div>
                <div>
                  <p className="font-medium text-slate-700">Items in order</p>
                  <p>{capturedItems.length}</p>
                </div>
              </div>
            </aside>
          </div>
        )}

        <div className="mt-6 flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-3 sm:flex-row">
            {currentStep > 1 && (
              <Button
                variant="secondary"
                size="md"
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg px-5 py-2 text-sm sm:w-auto"
                onClick={handleBack}
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </Button>
            )}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button
              variant="regular"
              size="md"
              className="inline-flex w-full items-center justify-center px-3 py-2 text-sm text-[#2c4a7d] sm:w-auto"
              onClick={saveDraft}
              disabled={isSavingDraft}
            >
              {isSavingDraft ? "Saving Draft..." : "Save as Draft"}
            </Button>
            <Button
              variant="primary"
              size="md"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg px-5 py-2 text-sm sm:w-auto"
              onClick={handleContinue}
              disabled={
                isSubmitting ||
                isSavingDraft ||
                (currentStep === 1 && capturedItems.length === 0)
              }
            >
              <span>
                {isSubmitting && currentStep === 4
                  ? "Submitting..."
                  : continueLabel}
              </span>
              {currentStep < 4 && <ArrowRight className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewOrder;
