import { useMemo } from "react";
import Card from "../Card.jsx";
import { Link } from "react-router-dom";
import useCustomerOrders from "../../hooks/useCustomerOrders.js";
import {
  getActiveStatusClassName,
  normalizeApiOrderForActiveCard,
  staticActiveOrders,
} from "../../utils/customerOrderDisplay.js";

const ActiveOrders = () => {
  const { orders: customerOrders } = useCustomerOrders();

  const orders = useMemo(() => {
    const liveOrders = customerOrders
      .filter((order) => !["completed", "cancelled"].includes(order.status))
      .map(normalizeApiOrderForActiveCard);

    return [...liveOrders, ...staticActiveOrders];
  }, [customerOrders]);

  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 mb-6 sm:mb-8">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Active Orders
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 space-y-3"
          >
            {/* Header: Order ID + Status Badge */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-semibold text-gray-800">
                  Order
                </span>
                <span className="text-sm font-bold text-gray-800 font-mono">
                  #{order.displayId || order.id}
                </span>
              </div>
              <span
                className={`px-3 py-0.5 rounded-full text-xs font-medium ${getActiveStatusClassName(order.status)}`}
              >
                {order.status}
              </span>
            </div>

            {/* Date */}
            <p className="text-xs text-gray-500">Created on {order.date}</p>

            {/* Items label */}
            <p className="text-xs font-semibold text-gray-700">
              Items ({order.items})
            </p>

            {/* Thumbnail Row */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {order.images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`Item ${i + 1}`}
                  className="w-12 h-12 flex-shrink-0 rounded-lg object-cover border border-gray-100"
                />
              ))}
              {order.items > order.images.length && (
                <div className="w-12 h-12 flex-shrink-0 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center text-xs font-semibold text-gray-500">
                  +{order.items - order.images.length}
                </div>
              )}
            </div>

            {/* Progress */}
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-gray-600 font-medium">Progress</span>
                <span className="text-gray-600">{order.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className="h-1.5 rounded-full transition-all duration-500"
                  style={{
                    width: `${order.progress}%`,
                    backgroundColor: "#2c4a7d",   /* teal progress bar from screenshot */
                  }}
                />
              </div>
            </div>

            {/* Footer: Completion + View Details */}
            <div className="flex items-end justify-between pt-1">
              <div>
                <p className="text-xs text-gray-500">Estimated Completion</p>
                <p className="text-xs font-bold text-gray-800 mt-0.5">
                  {order.completion}
                </p>
              </div>
              <Link
                to={`/order-tracking/${order.routeId || order.id}`}
                className="text-sm font-medium text-[#2c4a7d] hover:text-[#415a81] transition-colors"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ActiveOrders;
