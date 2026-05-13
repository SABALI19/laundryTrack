import { useSyncExternalStore } from "react";

import { getAuthSession, subscribeToAuthSession } from "../utils/auth.js";

const useAuthSession = () =>
  useSyncExternalStore(subscribeToAuthSession, getAuthSession, () => null);

export default useAuthSession;
