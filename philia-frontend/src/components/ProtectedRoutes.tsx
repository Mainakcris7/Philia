import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import type { RootState } from "../redux/store/store";

export default function ProtectedRoutes() {
  const loggedInUser = useSelector(
    (state: RootState) => state.currentUser.user
  );

  return loggedInUser ? <Outlet /> : <Navigate to="/auth/login" />;
}
