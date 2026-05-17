import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage.jsx";
import CustomerDashboard from "./pages/CustomerDashboard.jsx";
import DashboardLayout from "./layouts/DashboardLayout.jsx";
import NewOrder from "./pages/NewOrder.jsx";
import ItemVerification from "./pages/ItemVerification.jsx";
import Login from "./components/auth/Login.jsx";
import PublicOnlyRoute from "./components/auth/PublicOnlyRoute.jsx";
import RequireAuth from "./components/auth/RequireAuth.jsx";
import Signup from "./components/auth/Signup.jsx";
import PickupSchedule from "./pages/PickupSchedule.jsx";
import TenantMgt from "./layouts/superAdminLayout/TenantMgt.jsx";
import TenantMgtSettings from "./layouts/superAdminLayout/TenantMgtSettings.jsx";
import SystemAnalytics from "./layouts/superAdminLayout/SystemAnalytics.jsx";
import TenantDetails from "./components/common/superadmindashboard/TenantDetails.jsx";
import NewTenant from "./components/common/superadmindashboard/NewTenant.jsx";
import { pickupScheduleTotalScheduled } from "./pages/pickupScheduleData.js";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AdminAnalytics from "./pages/admin/AdminPerformanceAnalytics.jsx";
import DisputeManagement from "./pages/admin/DisputeManagement.jsx";
import OrderTracking from "./components/OrderTracking.jsx";
import OrderHistory from "./pages/OrderHistory.jsx";
import StaffDashboard from "./layouts/staffdashboard/StaffDashboard.jsx";
import SuperAdminDashboard from "./layouts/superAdminLayout/SuperAdminDashboard.tsx";
import SuperAdmindashboardLayouts from "./layouts/superAdminLayout/SuperAdmindashboardLayouts.tsx";
import SuperAdminPlaceholderPage from "./layouts/superAdminLayout/SuperAdminPlaceholderPage.tsx";
import staffUserImage from "./assets/images/download (1).jpg";
import adminUserImage from "./assets/images/download (2).jpg";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Settings,
} from "lucide-react";

function App() {
  const staffNavigationItems = [
    { name: "Staff Dashboard", href: "/staff/dashboard" },
    { name: "Pickups", href: "/staff/pickups" },
  ];

  const currentHeaderDate = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date());

  const pickupHeaderInlineContent = (
    <>
      <div className="hidden items-center gap-6 text-sm md:flex">
        {pickupScheduleTotalScheduled > 5 && (
          <button
            type="button"
            className="inline-flex items-center gap-2 font-medium text-[var(--color-primary)] transition-colors hover:text-[var(--color-primary-hover)]"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Previous</span>
          </button>
        )}
        <p className="text-[1.1rem] font-semibold text-slate-900">
          {currentHeaderDate}
        </p>
        {pickupScheduleTotalScheduled > 5 && (
          <button
            type="button"
            className="inline-flex items-center gap-2 font-medium text-[var(--color-primary)] transition-colors hover:text-[var(--color-primary-hover)]"
          >
            <span>Next</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        )}
      </div>

      <button
        type="button"
        className="inline-flex items-center rounded-full border border-slate-200 bg-white px-2.5 py-1.5 text-[0.68rem] font-medium text-slate-600 shadow-sm md:hidden"
      >
        <span className="whitespace-nowrap">{currentHeaderDate}</span>
      </button>
    </>
  );

  const adminSearchUtility = (
    <div className="flex items-center gap-4">
      <label className="flex w-[320px] items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
        <input
          type="text"
          placeholder="Quick search..."
          className="w-full border-0 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
        />
        <Search className="h-5 w-5 text-slate-400" />
      </label>
    </div>
  );

  return (
    <div>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/shared-order/:shareToken" element={<OrderTracking />} />
          <Route element={<PublicOnlyRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Route>

          {/* Dashboard - all get the header via DashboardLayout */}
          <Route element={<RequireAuth allowedRoles={["customer"]} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard/customer" element={<CustomerDashboard />} />
              <Route path="/new-order" element={<NewOrder />} />
            </Route>
          </Route>
          <Route element={<RequireAuth allowedRoles={["customer"]} />}>
            <Route
              element={
                <DashboardLayout
                  headerProps={{
                    brandLabel: "LaundryTrack",
                  }}
                />
              }
            >
              <Route path="/orders" element={<OrderHistory />} />
            </Route>
          </Route>
          <Route element={<RequireAuth allowedRoles={["admin"]} />}>
            <Route
              element={
                <DashboardLayout
                  headerProps={{
                    brandLabel: "LaundryTrack",
                    navigationItems: [
                      { name: "Admin Dashboard", href: "/admin/dashboard" },
                      { name: "Orders", href: "/admin/orders" },
                      { name: "Analytics", href: "/admin/analytics" },
                      { name: "Disputes", href: "/admin/disputes" },
                    ],
                    headerUtilityContent: (
                      <button
                        type="button"
                        className="rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-[var(--color-primary)]"
                      >
                        <Settings className="h-5 w-5" />
                      </button>
                    ),
                    showMobileHeaderUtility: false,
                    showMobileSidebarButton: false,
                    user: {
                      profileImage: adminUserImage,
                    },
                  }}
                />
              }
            >
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/orders" element={<AdminDashboard />} />
            </Route>
          </Route>
          <Route element={<RequireAuth allowedRoles={["admin"]} />}>
            <Route
              element={
                <DashboardLayout
                  headerProps={{
                    brandLabel: "LaundryTrack",
                    navigationItems: [
                      { name: "Admin Dashboard", href: "/admin/dashboard" },
                      { name: "Orders", href: "/admin/orders" },
                      { name: "Analytics", href: "/admin/analytics" },
                      { name: "Disputes", href: "/admin/disputes" },
                    ],
                    user: {
                      profileImage: adminUserImage,
                    },
                  }}
                />
              }
            >
              <Route path="/admin/analytics" element={<AdminAnalytics />} />
            </Route>
          </Route>
          <Route element={<RequireAuth allowedRoles={["admin"]} />}>
            <Route
              element={
                <DashboardLayout
                  headerProps={{
                    brandLabel: "LaundryTrack",
                    navigationItems: [
                      { name: "Admin Dashboard", href: "/admin/dashboard" },
                      { name: "Orders", href: "/admin/orders" },
                      { name: "Analytics", href: "/admin/analytics" },
                      { name: "Disputes", href: "/admin/disputes" },
                    ],
                    headerUtilityContent: adminSearchUtility,
                    user: {
                      profileImage: adminUserImage,
                    },
                  }}
                />
              }
            >
              <Route path="/admin/disputes" element={<DisputeManagement />} />
            </Route>
          </Route>
          <Route
            element={
              <RequireAuth allowedRoles={["superadmin"]} />
            }
          >
            <Route element={<SuperAdmindashboardLayouts />}>
              <Route
                path="/super-admin"
                element={<Navigate to="/super-admin/dashboard" replace />}
              />
              <Route
                path="/super-admin/dashboard"
                element={<SuperAdminDashboard />}
              />
              <Route
                path="/super-admin/tenants"
                element={<TenantMgt />}
              />
              <Route
                path="/super-admin/tenants/new"
                element={<NewTenant />}
              />
              <Route
                path="/super-admin/tenants/:tenantSlug"
                element={<TenantDetails />}
              />
              <Route
                path="/super-admin/tenants/:tenantSlug/settings"
                element={<TenantMgtSettings />}
              />
              <Route
                path="/super-admin/analytics"
                element={<SystemAnalytics />}
              />
              <Route
                path="/super-admin/settings"
                element={<SuperAdminPlaceholderPage page="settings" />}
              />
              <Route
                path="/super-admin/health"
                element={<SuperAdminPlaceholderPage page="health" />}
              />
              <Route
                path="/super-admin/support"
                element={<SuperAdminPlaceholderPage page="support" />}
              />
            </Route>
          </Route>
          <Route element={<RequireAuth allowedRoles={["staff", "admin"]} />}>
            <Route
              element={
                <DashboardLayout
                  headerProps={{
                    brandLabel: "LaundryTrack",
                    navigationItems: staffNavigationItems,
                    showNotificationBell: true,
                    notificationCount: 3,
                    user: {
                      profileImage: staffUserImage,
                    },
                  }}
                />
              }
            >
              <Route path="/staff/dashboard" element={<StaffDashboard />} />
            </Route>
          </Route>
          <Route element={<RequireAuth allowedRoles={["staff", "admin"]} />}>
            <Route
              element={
                <DashboardLayout
                  headerProps={{
                    brandLabel: "LaundryTrack",
                    navigationItems: staffNavigationItems,
                    headerInlineContent: pickupHeaderInlineContent,
                    showNotificationBell: true,
                    notificationCount: 3,
                    user: {
                      profileImage: staffUserImage,
                    },
                  }}
                />
              }
            >
              <Route path="/staff/pickups" element={<PickupSchedule />} />
            </Route>
          </Route>
          <Route element={<RequireAuth allowedRoles={["staff", "admin"]} />}>
            <Route
              element={
                <DashboardLayout
                  headerVariant="orderTracking"
                  headerProps={{
                    brandLabel: "LaundryTrack",
                    backLink: "/staff/dashboard",
                    backLabel: "Back to Dashboard",
                    metaLabel: "Verification",
                    metaValueFormatter: (orderId) => `#${orderId}`,
                    user: {
                      profileImage: staffUserImage,
                    },
                  }}
                />
              }
            >
              <Route
                path="/staff/verification/:orderId"
                element={<ItemVerification />}
              />
            </Route>
          </Route>
          <Route element={<RequireAuth allowedRoles={["customer"]} />}>
            <Route
              element={
                <DashboardLayout
                  headerVariant="orderTracking"
                  headerProps={{
                    brandLabel: "LaundryTrack",
                    backLink: "/dashboard/customer",
                    backLabel: "Back to Dashboard",
                    metaLabel: "Order",
                  }}
                />
              }
            >
              <Route path="/order-tracking/:orderId" element={<OrderTracking />} />
            </Route>
          </Route>

          {/* Catch-all - redirects unknown URLs back to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
