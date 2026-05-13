import { Navigate, Outlet } from "react-router-dom";
import useAuthSession from "../../hooks/useAuthSession.js";
import { getDashboardPathForRole } from "../../utils/auth.js";

const PublicOnlyRoute = () => {
  const session = useAuthSession();
  const userRole = session?.user?.role;

  if (userRole) {
    return <Navigate to={getDashboardPathForRole(userRole)} replace />;
  }

  return <Outlet />;
};

export default PublicOnlyRoute;
