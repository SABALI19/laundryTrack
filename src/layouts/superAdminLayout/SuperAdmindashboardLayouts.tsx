import { useCallback, useMemo, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { DashboardLayoutContext } from "../DashboardLayoutContext";
import SuperAdminHeader from "./SuperAdminHeader";
import SuperAdminSidebar from "./SuperAdminSidebar";

const SuperAdmindashboardLayouts = () => {
  const location = useLocation();
  const [mobileSidebarOpenPath, setMobileSidebarOpenPath] = useState(null);
  const isMobileSidebarOpen = mobileSidebarOpenPath === location.pathname;
  const closeMobileSidebar = useCallback(() => {
    setMobileSidebarOpenPath(null);
  }, []);
  const openMobileSidebar = useCallback(() => {
    setMobileSidebarOpenPath(location.pathname);
  }, [location.pathname]);
  const mobileSidebarContent = useMemo(
    () => <SuperAdminSidebar onNavigate={closeMobileSidebar} />,
    [closeMobileSidebar],
  );
  const layoutValue = useMemo(
    () => ({
      closeMobileSidebar,
      hasMobileSidebar: true,
      isMobileSidebarOpen,
      openMobileSidebar,
      setHeaderUtilityContent: () => undefined,
      setMobileSidebarContent: () => undefined,
    }),
    [closeMobileSidebar, isMobileSidebarOpen, openMobileSidebar],
  );

  return (
    <DashboardLayoutContext.Provider value={layoutValue}>
      <div className="h-screen overflow-hidden bg-[#f8fafc] text-slate-900">
        <SuperAdminHeader />
        <div className="mx-auto grid h-[calc(100vh-52px)] min-h-0 w-full max-w-[1440px] gap-5 overflow-hidden px-4 py- sm:px-5 lg:px-7 xl:grid-cols-[220px_minmax(0,1fr)]">
          <SuperAdminSidebar  />
         <main className="min-h-0 min-w-0 overflow-y-auto p-4 pt-12 scrollbar-hide bg-[#fcfdfd]">
  <Outlet />
</main>
        </div>

        <div
          className={`fixed inset-0 z-[70] xl:hidden ${
            isMobileSidebarOpen ? "pointer-events-auto" : "pointer-events-none"
          }`}
          aria-hidden={!isMobileSidebarOpen}
        >
          <button
            type="button"
            onClick={closeMobileSidebar}
            className={`absolute inset-0 bg-slate-900/30 backdrop-blur-[1px] transition-opacity ${
              isMobileSidebarOpen ? "opacity-100" : "opacity-0"
            }`}
            aria-label="Close super admin sidebar"
          />
          <aside
            className={`absolute right-0 top-0 h-full w-[min(88vw,320px)] overflow-y-auto bg-[var(--color-surface)] p-4 shadow-[-16px_0_40px_rgba(15,23,42,0.16)] transition-transform ${
              isMobileSidebarOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            {mobileSidebarContent}
          </aside>
        </div>
      </div>
    </DashboardLayoutContext.Provider>
  );
};

export default SuperAdmindashboardLayouts;
