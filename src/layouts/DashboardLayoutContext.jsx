import { createContext, useContext } from "react";

export const DashboardLayoutContext = createContext(null);

export const useDashboardLayout = () => useContext(DashboardLayoutContext);
