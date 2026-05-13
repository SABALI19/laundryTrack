import { Link } from "react-router-dom";
import { CalendarDays, Camera, History } from "lucide-react";

const actions = [
  {
    title: "Start New Order",
    Icon: Camera,
    desc: "Take photos and create a new laundry order",
    path: "/new-order",
  },
  {
    title: "View Order History",
    Icon: History,
    desc: "Browse your past laundry orders",
    path: "/order-history",
  },
  {
    title: "Pickup Schedule",
    Icon: CalendarDays,
    desc: "Manage your pickup and delivery times",
    path: "/schedule",
  },
];

const QuickActions = () => {
  return (
    <section className="px-4 sm:px-6 mb-8">
      <h2 className="text-base font-semibold text-gray-800 mb-4">
        Quick Actions
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {actions.map((action) => (
          <Link
            key={action.title}
            to={action.path}
            className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow"
          >
            {/* Icon box */}
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50">
              <action.Icon className="h-5 w-5" style={{ color: "#2c4a7d" }} />
            </div>

            <h3 className="text-sm font-semibold text-gray-800 mb-1">
              {action.title}
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              {action.desc}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default QuickActions;