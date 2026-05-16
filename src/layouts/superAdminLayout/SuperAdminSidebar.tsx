import type { ButtonHTMLAttributes, ComponentType } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import {
  Activity,
  BarChart3,
  Building2,
  CircleHelp,
  LayoutDashboard,
  Settings,
} from "lucide-react";

const navigationItems = [
  { label: "Dashboard", href: "/super-admin/dashboard", Icon: LayoutDashboard },
  { label: "Tenant Management", href: "/super-admin/tenants", Icon: Building2 },
  { label: "System Analytics", href: "/super-admin/analytics", Icon: BarChart3 },
  { label: "Platform Settings", href: "/super-admin/settings", Icon: Settings },
  { label: "System Health", href: "/super-admin/health", Icon: Activity },
  { label: "Support & Documentation", href: "/super-admin/support", Icon: CircleHelp },
];

type SuperAdminSidebarProps = {
  className?: string;
  onNavigate?: () => void;
};

type SidebarButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "regular" | "unstyled";
  size?: "sm" | "md" | "lg" | "xl";
  fontWeight?: "light" | "normal" | "medium" | "semibold" | "bold" | "thin";
};

const SidebarButton = Button as ComponentType<SidebarButtonProps>;

const SuperAdminSidebar = ({
  className = "",
  onNavigate,
}: SuperAdminSidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <aside className={`w-full space-y-3 ${className}`}>
      <div>
        <h2 className="sr-only">
          Navigation
        </h2>

        <nav className="space-y-2">
          {navigationItems.map(({ label, href, Icon }) => {
            const isActive =
              location.pathname === href ||
              (href === "/super-admin/dashboard" &&
                location.pathname === "/super-admin");

            return (
              <SidebarButton
                key={label}
                variant="unstyled"
                size="sm"
                onClick={() => {
                  navigate(href);
                  onNavigate?.();
                }}
                className={`flex min-h-11 w-full items-center justify-start gap-3 rounded-lg px-4 py-2.5 text-left text-[0.8rem] font-bold transition-colors ${
                  isActive
                    ? "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)]"
                    : "text-slate-600 hover:bg-[var(--color-primary-soft)] hover:text-[var(--color-primary)]"
                } focus:!outline-none focus:!ring-0 focus:!ring-offset-0 focus-visible:!outline-none focus-visible:!ring-0 focus-visible:!ring-offset-0`}
              >
                <Icon className="h-3.5 w-3.5 shrink-0" />
                <span className="leading-snug">{label}</span>
              </SidebarButton>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

export default SuperAdminSidebar;
