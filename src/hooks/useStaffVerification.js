import { useCallback, useEffect, useState } from "react";

import { apiRequest } from "../utils/auth.js";

const useStaffVerification = (orderId) => {
  const [verificationOrder, setVerificationOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [saveError, setSaveError] = useState("");

  const loadVerificationOrder = useCallback(async () => {
    if (!orderId) {
      setVerificationOrder(null);
      setError("Verification order is unavailable.");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const data = await apiRequest(`/orders/staff/verification/${encodeURIComponent(orderId)}`);
      setVerificationOrder(data.verificationOrder || null);
      setError("");
    } catch (requestError) {
      setVerificationOrder(null);
      setError(requestError.message || "Unable to load the verification order.");
    } finally {
      setIsLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    loadVerificationOrder();
  }, [loadVerificationOrder]);

  const saveVerificationOrder = useCallback(
    async (payload) => {
      if (!orderId) {
        throw new Error("Verification order is unavailable.");
      }

      try {
        setIsSaving(true);
        setSaveError("");
        const data = await apiRequest(`/orders/staff/verification/${encodeURIComponent(orderId)}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });
        setVerificationOrder(data.verificationOrder || null);
        return data.verificationOrder || null;
      } catch (requestError) {
        const message = requestError.message || "Unable to save verification progress.";
        setSaveError(message);
        throw new Error(message);
      } finally {
        setIsSaving(false);
      }
    },
    [orderId],
  );

  return {
    error,
    isLoading,
    isSaving,
    loadVerificationOrder,
    saveError,
    saveVerificationOrder,
    setVerificationOrder,
    verificationOrder,
  };
};

export default useStaffVerification;
