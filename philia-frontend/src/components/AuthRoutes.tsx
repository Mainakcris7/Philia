import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import type { RootState } from "../redux/store/store";

export default function AuthRoutes() {
  const loggedInUser = useSelector(
    (state: RootState) => state.currentUser.user
  );

  return !loggedInUser ? (
    <div className="flex justify-center items-center flex-1 mt-10">
      <Outlet />
    </div>
  ) : (
    <Navigate to="/" />
  );
}
