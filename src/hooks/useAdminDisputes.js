import { useEffect, useState } from "react";

import { apiRequest } from "../utils/auth.js";

const useAdminDisputes = () => {
  const [disputesDashboard, setDisputesDashboard] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadDisputes = async () => {
      try {
        setIsLoading(true);
        const data = await apiRequest("/admin/disputes");

        if (!isMounted) {
          return;
        }

        setDisputesDashboard(data.disputesDashboard || null);
        setError("");
      } catch (requestError) {
        if (!isMounted) {
          return;
        }

        setDisputesDashboard(null);
        setError(requestError.message || "Unable to load disputes.");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadDisputes();

    return () => {
      isMounted = false;
    };
  }, []);

  return { disputesDashboard, error, isLoading };
};

export default useAdminDisputes;
