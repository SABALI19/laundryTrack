import { useCallback, useMemo, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";

import DashboardHeader from "../layouts/DashboardHeader.jsx";
import { DashboardLayoutContext } from "./DashboardLayoutContext.jsx";

const DashboardLayout = ({ headerVariant = "default", headerProps = {} }) => {
  const location = useLocation();
  const [mobileSidebarOpenPath, setMobileSidebarOpenPath] = useState(null);
  const [mobileSidebarContent, setMobileSidebarContent] = useState(null);
  const [headerUtilityContent, setHeaderUtilityContent] = useState(null);
  const isMobileSidebarOpen = mobileSidebarOpenPath === location.pathname;
  const closeMobileSidebar = useCallback(() => {
    setMobileSidebarOpenPath(null);
  }, []);
  const openMobileSidebar = useCallback(() => {
    setMobileSidebarOpenPath(location.pathname);
  }, [location.pathname]);
  const hasMobileSidebar = Boolean(mobileSidebarContent);

  const layoutValue = useMemo(
    () => ({
      closeMobileSidebar,
      hasMobileSidebar,
      isMobileSidebarOpen,
      openMobileSidebar,
      setHeaderUtilityContent,
      setMobileSidebarContent,
    }),
    [closeMobileSidebar, hasMobileSidebar, isMobileSidebarOpen, openMobileSidebar],
  );
  const resolvedHeaderProps = useMemo(
    () => ({
      ...headerProps,
      headerUtilityContent:
        headerUtilityContent || headerProps.headerUtilityContent,
    }),
    [headerProps, headerUtilityContent],
  );

  return (
    <DashboardLayoutContext.Provider value={layoutValue}>
      <div className="min-h-screen">
        <DashboardHeader variant={headerVariant} {...resolvedHeaderProps} />
        <main className="mx-auto w-full min-w-0 overflow-x-hidden px-4 py-6 sm:px-6 lg:p-8">
          <Outlet />
        </main>

        {mobileSidebarContent && (
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
              aria-label="Close dashboard sidebar"
            />
            <aside
              className={`absolute right-0 top-0 h-full w-[min(88vw,320px)] overflow-y-auto bg-[var(--color-surface)] p-4 shadow-[-16px_0_40px_rgba(15,23,42,0.16)] transition-transform ${
                isMobileSidebarOpen ? "translate-x-0" : "translate-x-full"
              }`}
            >
              {mobileSidebarContent}
            </aside>
          </div>
        )}
      </div>
    </DashboardLayoutContext.Provider>
  );
};

export default DashboardLayout;
