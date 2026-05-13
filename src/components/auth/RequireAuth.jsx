import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuthSession from "../../hooks/useAuthSession.js";
import { getDashboardPathForRole, normalizeUserRole } from "../../utils/auth.js";

const RequireAuth = ({ allowedRoles = [] }) => {
  const location = useLocation();
  const session = useAuthSession();
  const userRole = normalizeUserRole(session?.user?.role);
  const normalizedAllowedRoles = allowedRoles.map(normalizeUserRole);

  if (!userRole) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (normalizedAllowedRoles.length > 0 && !normalizedAllowedRoles.includes(userRole)) {
    return <Navigate to={getDashboardPathForRole(userRole)} replace />;
  }

  return <Outlet />;
};

export default RequireAuth;
