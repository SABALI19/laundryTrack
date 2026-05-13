import { Outlet } from "react-router-dom";
import SuperAdminHeader from "./SuperAdminHeader";
import SuperAdminSidebar from "./SuperAdminSidebar";

const SuperAdmindashboardLayouts = () => {
  return (
    <div className="min-h-screen bg-[var(--color-surface)] text-slate-900">
      <SuperAdminHeader />
      <div className="flex">
        <SuperAdminSidebar />
        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-9 lg:py-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default SuperAdmindashboardLayouts;
