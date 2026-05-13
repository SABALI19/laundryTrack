import { useCallback, useEffect, useState } from "react";

import { apiRequest } from "../utils/auth.js";

const useAdminDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = useCallback(async ({ shouldUpdate = () => true } = {}) => {
    try {
      setIsLoading(true);
      const data = await apiRequest("/admin/dashboard");

      if (!shouldUpdate()) {
        return;
      }

      setDashboard(data.dashboard || null);
      setError("");
    } catch (requestError) {
      if (!shouldUpdate()) {
        return;
      }

      setDashboard(null);
      setError(requestError.message || "Unable to load the admin dashboard.");
    } finally {
      if (shouldUpdate()) {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    loadDashboard({ shouldUpdate: () => isMounted });

    return () => {
      isMounted = false;
    };
  }, [loadDashboard]);

  return { dashboard, error, isLoading, refreshDashboard: loadDashboard };
};

export default useAdminDashboard;
