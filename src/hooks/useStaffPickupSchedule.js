import { useEffect, useState } from "react";

import { apiRequest } from "../utils/auth.js";

const useStaffPickupSchedule = (selectedDate) => {
  const [pickupSchedule, setPickupSchedule] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const loadPickupSchedule = async () => {
      try {
        setIsLoading(true);
        const params = new URLSearchParams();

        if (selectedDate) {
          params.set("date", selectedDate);
        }

        const queryString = params.toString();
        const data = await apiRequest(
          `/orders/staff/pickups${queryString ? `?${queryString}` : ""}`,
        );

        if (!isMounted) {
          return;
        }

        setPickupSchedule(data.pickupSchedule || null);
        setError("");
      } catch (requestError) {
        if (!isMounted) {
          return;
        }

        setPickupSchedule(null);
        setError(requestError.message || "Unable to load the pickup schedule.");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadPickupSchedule();

    return () => {
      isMounted = false;
    };
  }, [selectedDate, reloadToken]);

  return {
    pickupSchedule,
    isLoading,
    error,
    refreshPickupSchedule: () => setReloadToken((value) => value + 1),
    setPickupSchedule,
  };
};

export default useStaffPickupSchedule;
