import { Bell, Check, Package, Shirt, Wind } from "lucide-react";
import { WashingMachine } from "lucide-react";

const stageConfig = {
  washing: {
    Icon: WashingMachine,
    iconClassName: "bg-gray-100 text-gray-400",
  },
  drying: {
    Icon: Wind,
    iconClassName: "bg-gray-100 text-gray-400",
  },
  ironing: {
    Icon: Shirt,
    iconClassName: "bg-blue-100 text-[#2c4a7d]",
  },
  packaging: {
    Icon: Package,
    iconClassName: "bg-gray-100 text-gray-400",
  },
  completed: {
    Icon: Check,
    iconClassName: "bg-emerald-100 text-emerald-600",
  },
  notification: {
    Icon: Bell,
    iconClassName: "bg-amber-50 text-amber-500",
  },
};

const buildUpdateMessage = (update) => {
  if (update.message) return update.message;

  if (update.type === "notification") {
    return (
      <>
        Reminder: Order{" "}
        <strong className="font-semibold text-gray-800">#{update.orderId}</strong>{" "}
        pickup scheduled for today at{" "}
        <strong className="font-semibold text-gray-800">5:00 PM</strong>
      </>
    );
  }

  if (update.stage === "completed") {
    return (
      <>
        Order{" "}
        <strong className="font-semibold text-gray-800">#{update.orderId}</strong>{" "}
        has been{" "}
        <strong className="font-semibold text-gray-800">Completed</strong> and
        is ready for pickup
      </>
    );
  }

  if (update.stage === "ironing") {
    return (
      <>
        Order{" "}
        <strong className="font-semibold text-gray-800">#{update.orderId}</strong>{" "}
        is now being{" "}
        <strong className="font-semibold text-gray-800">Ironed</strong>
      </>
    );
  }

  const label = stageConfig[update.stage]
    ? update.stage.charAt(0).toUpperCase() + update.stage.slice(1)
    : update.stage;

  return (
    <>
      Order{" "}
      <strong className="font-semibold text-gray-800">#{update.orderId}</strong>{" "}
      has moved to{" "}
      <strong className="font-semibold text-gray-800">{label} stage</strong>
    </>
  );
};

const RecentUpdates = ({
  title = "Recent Updates",
  updates = [],
  emptyMessage = "No recent updates yet.",
}) => {
  return (
    <section className="px-4 sm:px-6">
      <h2 className="mb-4 text-base font-semibold text-gray-800">
        {title}
      </h2>

      <div className="rounded-xl bg-white border border-gray-200 shadow-sm overflow-hidden">
        {updates.length === 0 ? (
          <div className="px-6 py-8 text-sm text-gray-400">{emptyMessage}</div>
        ) : (
          updates.map((update, index) => {
            const config =
              stageConfig[update.stage] ||
              stageConfig[update.type] ||
              stageConfig.notification;
            const message = buildUpdateMessage(update);

            return (
              <div
                key={update.id || `${update.orderId}-${update.stage}-${index}`}
                className={`flex items-start gap-3 px-4 py-4 sm:px-5 ${
                  index !== updates.length - 1
                    ? "border-b border-gray-100"
                    : ""
                }`}
              >
                {/* Icon circle */}
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${config.iconClassName}`}
                >
                  <config.Icon className="h-4 w-4" />
                </div>

                {/* Text */}
                <div className="min-w-0 pt-0.5">
                  <p className="text-sm text-gray-600 leading-snug">
                    {message}
                  </p>
                  <p className="mt-1 text-xs text-gray-400">{update.time}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
};

export default RecentUpdates;