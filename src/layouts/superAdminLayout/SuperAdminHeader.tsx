import {
  Activity,
  BarChart3,
  Bell,
  Building2,
  CircleHelp,
  LayoutDashboard,
  Menu,
  Search,
  Settings,
  X,
} from "lucide-react";
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import adminUserImage from "../../assets/images/download (2).jpg";
import WashaLogo from "../../assets/logo/washa-logo-blue.png";
import Profile from "../../components/common/Profile";
import useAuthSession from "../../hooks/useAuthSession";

const navigationItems = [
  { label: "Dashboard", href: "/super-admin/dashboard", Icon: LayoutDashboard },
  { label: "Tenant Management", href: "/super-admin/tenants", Icon: Building2 },
  { label: "System Analytics", href: "/super-admin/analytics", Icon: BarChart3 },
  { label: "Platform Settings", href: "/super-admin/settings", Icon: Settings },
  { label: "System Health", href: "/super-admin/health", Icon: Activity },
  { label: "Support & Documentation", href: "/super-admin/support", Icon: CircleHelp },
];

const SuperAdminHeader = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const storedSession = useAuthSession();
  const superAdminProfile = {
    profileImage: adminUserImage,
    ...(storedSession?.user?.profileImage
      ? { profileImage: storedSession.user.profileImage }
      : {}),
  };

  return (
    <>
      <header className="sticky  p-4 top-0 z-50 border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-11 w-full max-w-[1440px] items-center justify-between gap-4 px-4 sm:px-5 lg:px-7">

          {/* Left — hamburger on mobile, logo on desktop */}
          <div className="flex  min-w-0 items-center gap-5">
  {/* Hamburger — mobile only */}
  <button
    type="button"
    aria-expanded={isMobileMenuOpen}
    aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
    onClick={() => setIsMobileMenuOpen((v) => !v)}
    className="inline-flex h-10 w-10 items-center justify-center   bg-white text-[var(--color-primary)]  transition-colors hover:border-[var(--color-primary)] xl:hidden"
  >
    {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-10 w-10" />}
  </button>

  {/* Logo — always visible */}
  <Link
    to="/super-admin/dashboard"
    className="flex  items-center gap-1.5"
  >
    <span className="">
      <img
        src={WashaLogo}
        alt="LaundryTrack"
        className="h-3.5 w-3.5 object-contain brightness-0 invert hidden xl:flex"
      />
    </span>
    <span className="truncate text-lg font-semibold text-slate-950">
      LaundryTrack
    </span>
  </Link>

  <span className="hidden rounded-full bg-[var(--color-primary-soft)] px-2.5 py-1 text-[0.58rem] font-semibold text-[var(--color-primary)] sm:inline-flex">
    Super Admin
  </span>
</div>

          {/* Center — search */}
          <label className="hidden h-8 w-full max-w-[340px] items-center gap-2 rounded-md border border-slate-200 bg-white px-3 md:flex">
            <Search className="h-3 w-3 text-slate-400" />
            <input
              type="search"
              placeholder="Search tenants and users..."
              className="w-full border-0 bg-transparent text-[0.68rem] text-slate-700 outline-none placeholder:text-slate-400"
            />
          </label>

          {/* Right — actions */}
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              className="relative inline-flex h-7 w-7 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-100 hover:text-[var(--color-primary)]"
              aria-label="Notifications"
            >
              <Bell className="h-3.5 w-3.5" />
              <span className="absolute right-0.5 top-0 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-[var(--color-primary)] px-0.5 text-[0.5rem] font-semibold text-white">
                3
              </span>
            </button>
            <button
              type="button"
              className="inline-flex h-7 w-7 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-100 hover:text-[var(--color-primary)]"
              aria-label="Super admin settings"
            >
              <Settings className="h-3.5 w-3.5" />
            </button>
            <span className="hidden h-5 w-px bg-slate-200 sm:block" />
            <Profile user={superAdminProfile} size="sm" />
            {/* PanelRightOpen button removed */}
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {isMobileMenuOpen && (
          <div className="border-t border-slate-100 bg-white px-4 py-3 shadow-sm xl:hidden">
            <nav className="space-y-1">
              {navigationItems.map(({ label, href, Icon }) => (
                <NavLink
                  key={label}
                  to={href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-4 py-2.5 text-[0.8rem] font-bold transition-colors ${
                      isActive
                        ? "bg-[var(--color-primary)] text-white"
                        : "text-slate-600 hover:bg-[var(--color-primary-soft)] hover:text-[var(--color-primary)]"
                    }`
                  }
                >
                  <Icon className="h-3.5 w-3.5 shrink-0" />
                  <span>{label}</span>
                </NavLink>
              ))}
            </nav>
          </div>
        )}
      </header>
    </>
  );
};

export default SuperAdminHeader;
