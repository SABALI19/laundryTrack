import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

import Button from "../components/Button";
import ActiveOrders from "../components/common/ActiveOrders.jsx";
import FabButton from "../components/common/FabButton.jsx";
import QuickActions from "../components/common/QuickActions.jsx";
import RecentUpdates from "../components/common/RecentUpdates.jsx";
import UserWelcome from "../components/common/UserWelcome.jsx";

const recentUpdates = [
  {
    id: "update-washing",
    orderId: "LT2024001",
    type: "stage",
    stage: "washing",
    time: "2 hours ago",
  },
  {
    id: "update-drying",
    orderId: "LT2024002",
    type: "stage",
    stage: "drying",
    time: "1 hour ago",
  },
  {
    id: "update-ironing",
    orderId: "LT2024003",
    type: "stage",
    stage: "ironing",
    time: "45 minutes ago",
  },
  {
    id: "update-packaging",
    orderId: "LT2024004",
    type: "stage",
    stage: "packaging",
    time: "20 minutes ago",
  },
  {
    id: "update-notification",
    orderId: "LT2024004",
    type: "notification",
    stage: "notification",
    message: "Reminder: Order #LT2024004 pickup is scheduled for today at 5:00 PM.",
    time: "Today at 9:00 AM",
  },
];

const CustomerDashboard = () => {
  const navigate = useNavigate();

  return (
    <>
      <FabButton />

      <div className="flex w-full flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:gap-0 sm:px-6">
        <UserWelcome />

        <div className="hidden sm:block">
          <Button
            variant="primary"
            onClick={() => navigate("/new-order")}
            size="md"
            className="mt-0 flex items-center gap-2 font-inter text-sm font-base sm:mt-4"
          >
            <Plus className="h-5 w-5" />
            <span className="font-inter text-md">New laundry Order</span>
          </Button>
        </div>
      </div>

      <div>
        <ActiveOrders />
      </div>

      <QuickActions />
      <RecentUpdates updates={recentUpdates} />
    </>
  );
};

export default CustomerDashboard;
