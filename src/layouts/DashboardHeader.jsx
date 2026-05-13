import Button from "../components/Button";
import { ArrowLeft, Bell, ChevronDown, PanelRightOpen } from "lucide-react";
import { Link, useLocation, useParams } from "react-router-dom";
import washaLogo from "../assets/logo/washa-logo-blue.png";
import Profile from "../components/common/Profile";
import useAuthSession from "../hooks/useAuthSession.js";
import { useDashboardLayout } from "./DashboardLayoutContext.jsx";
import { getDashboardPathForRole } from "../utils/auth.js";

const defaultNavigationItems = [
  { name: "Dashboard", href: "/dashboard/customer" },
  { name: "Orders", href: "/orders" },
  { name: "Help", href: "/help" },
];

const DashboardHeader = ({
  user,
  variant = "default",
  brandLabel = "Washa",
  navigationItems = defaultNavigationItems,
  backLink = "/dashboard/customer",
  backLabel = "Back to Dashboard",
  metaLabel,
  metaValue,
  metaValueFormatter,
  headerActionLabel,
  headerActionIcon: HeaderActionIcon,
  headerActionHasChevron = true,
  headerInlineContent,
  headerUtilityContent,
  showMobileHeaderUtility = true,
  showMobileSidebarButton = true,
  showNotificationBell = false,
  notificationCount = 0,
}) => {
  const location = useLocation();
  const { orderId } = useParams();
  const storedSession = useAuthSession();
  const dashboardLayout = useDashboardLayout();
  const isTrackingVariant = variant === "orderTracking";
  const resolvedUser =
    storedSession?.user || user
      ? {
          ...(storedSession?.user || {}),
          ...(user || {}),
        }
      : undefined;
  const brandLink = getDashboardPathForRole(resolvedUser?.role);
  const resolvedMetaValue =
    metaValue ||
    (metaValueFormatter && orderId
      ? metaValueFormatter(orderId)
      : isTrackingVariant && orderId
        ? `#${orderId}`
        : undefined);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="flex min-w-0 items-center justify-between gap-3 py-3 sm:h-16 sm:py-0">
          <Link to={brandLink} className="flex min-w-0 flex-1 items-center gap-2 sm:flex-none">
            <img src={washaLogo} alt="Washa Logo" className="h-8 w-auto sm:h-10" />
            <span className="truncate text-sm font-semibold text-gray-900">
              {brandLabel}
            </span>
          </Link>

          <div className="flex shrink-0 items-center gap-2 sm:gap-4">
            {isTrackingVariant ? (
              <div className="hidden items-center gap-8 md:flex">
                <Link
                  to={backLink}
                  className="inline-flex items-center gap-2 text-sm font-medium text-gray-700 transition-colors hover:text-[#2c4a7d]"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>{backLabel}</span>
                </Link>

                {resolvedMetaValue && (
                  <p className="text-sm text-gray-500">
                    {metaLabel ? `${metaLabel}: ` : ""}
                    <span className="font-semibold text-gray-900">
                      {resolvedMetaValue}
                    </span>
                  </p>
                )}
              </div>
            ) : (
              <nav className="hidden space-x-1 md:flex">
              {navigationItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`relative overflow-hidden px-3 py-2 text-sm font-medium font-roboto transition-colors duration-300 ${
                      location.pathname === item.href
                        ? "text-[#2c4a7d]"
                        : "text-gray-600 hover:text-[#415a81]"
                    }`}
                  >
                    {item.name}
                    <span
                      className={`absolute bottom-0 left-0 h-0.5 w-full bg-[#2c4a7d] transition-transform duration-300 ease-out ${
                        location.pathname === item.href
                          ? "translate-x-0"
                          : "-translate-x-full hover:translate-x-0"
                      }`}
                    />
                  </Link>
                ))}
              </nav>
            )}
            {headerInlineContent && (
              <div className="hidden md:flex md:items-center">{headerInlineContent}</div>
            )}
            {headerUtilityContent && (
              <div className="hidden md:flex md:items-center">{headerUtilityContent}</div>
            )}
            {headerActionLabel && (
              <Button
                variant="secondary"
                size="md"
                className="hidden items-center gap-2 rounded-2xl border-slate-200 px-5 py-3 text-sm font-medium text-slate-700 hover:border-[var(--color-primary)] md:inline-flex"
              >
                {HeaderActionIcon && <HeaderActionIcon className="h-4 w-4" />}
                <span>{headerActionLabel}</span>
                {headerActionHasChevron && <ChevronDown className="h-4 w-4" />}
              </Button>
            )}
            {showNotificationBell && (
              <button
                type="button"
                className="relative rounded-full p-1.5 text-slate-500 transition-colors hover:bg-slate-100 hover:text-[var(--color-primary)] sm:p-2"
              >
                <Bell className="h-5 w-5" />
                {notificationCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--color-primary)] px-1 text-xs font-semibold text-white">
                    {notificationCount}
                  </span>
                )}
              </button>
            )}
            <Profile user={resolvedUser} size="md" />
          </div>
        </div>

        {isTrackingVariant ? (
          <div className="flex flex-col gap-2 border-t border-slate-100 py-3 md:hidden">
            <Link
              to={backLink}
              className="inline-flex items-center gap-2 text-sm font-medium text-gray-400 transition-colors hover:text-[#2c4a7d]"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>{backLabel}</span>
            </Link>
            {resolvedMetaValue && (
              <p className="text-sm text-gray-500">
                {metaLabel ? `${metaLabel}: ` : ""}
                <span className="font-semibold text-[#2c4a7d]">
                  {resolvedMetaValue}
                </span>
              </p>
            )}
          </div>
        ) : (
          <div className="py-2 md:hidden">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex min-w-0 flex-1 space-x-2 overflow-x-auto">
                {navigationItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`whitespace-nowrap rounded-md px-2.5 py-1 text-[0.78rem] font-medium ${
                      location.pathname === item.href
                        ? "bg-[#2c4a7d] text-white"
                        : "bg-gray-100 text-[#2c4a7d]"
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              <div className="flex shrink-0 items-center gap-2">
                {headerInlineContent && <div>{headerInlineContent}</div>}
                {showMobileSidebarButton && dashboardLayout?.hasMobileSidebar && (
                  <button
                    type="button"
                    onClick={dashboardLayout.openMobileSidebar}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition-colors hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
                    aria-label="Open dashboard sidebar"
                  >
                    <PanelRightOpen className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
            {showMobileHeaderUtility && headerUtilityContent && (
              <div className="mt-3">{headerUtilityContent}</div>
            )}
            {headerActionLabel && (
              <div className="mt-3 flex items-center gap-3">
                {headerActionLabel && (
                  <Button
                    variant="secondary"
                    size="sm"
                    className="inline-flex items-center gap-2 rounded-xl border-slate-200 text-sm text-slate-700 hover:border-[var(--color-primary)]"
                  >
                    {HeaderActionIcon && <HeaderActionIcon className="h-4 w-4" />}
                    <span>{headerActionLabel}</span>
                    {headerActionHasChevron && <ChevronDown className="h-4 w-4" />}
                  </Button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default DashboardHeader;
