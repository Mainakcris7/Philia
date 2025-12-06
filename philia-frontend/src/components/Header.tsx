import { NavLink } from "react-router-dom";
import NavBar from "./NavBar";
import PhiliaDarkLogo from "../assets/philia-dark-logo.png";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store/store";
import { APP_CONFIG } from "../shared/config/appconfig";
import userIcon from "../assets/user-icon.png";

export default function Header() {
  const loggedInUser = useSelector(
    (state: RootState) => state.currentUser.user
  );
  return (
    <div
      className="w-full h-16 text-black flex items-center px-4 backdrop-blur-lg border justify-between border-white/20 shadow-lg fixed top-0 left-0 z-50"
      style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
    >
      <NavLink to="/">
        <div className="logo relative h-10 w-30 left-5 top-1">
          <img src={PhiliaDarkLogo} className="h-[90%]" />
        </div>
      </NavLink>
      <div className="nav-bar">
        <NavBar />
      </div>
      <div className="side-menu w-30 flex flex-row-reverse gap-4">
        {loggedInUser ? (
          <NavLink to="/profile">
            <div>
              <img
                src={
                  loggedInUser.profileImageUrl
                    ? `${APP_CONFIG.API_URL}${loggedInUser.profileImageUrl}`
                    : userIcon
                }
                alt={`${loggedInUser!.firstName} ${loggedInUser!.lastName}`}
                className="outline-blue-500 rounded-full w-10 h-10 outline-2 bg-gray-800 object-contain hover:opacity-80 transition-all duration-150"
              />
            </div>
          </NavLink>
        ) : (
          <>
            <NavLink
              to="/auth/register"
              className="px-4 py-1.5 cursor-pointer rounded-lg text-white bg-blue-600/60 backdrop-blur-md border border-blue-300/20 transition-all duration-300 hover:bg-blue-600/80 hover:shadow-lg hover:shadow-blue-500/20 active:scale-95"
            >
              Register
            </NavLink>
            <NavLink
              to="/auth/login"
              className="px-4 py-1.5 cursor-pointer rounded-lg text-white bg-white-600/60 backdrop-blur-md border border-blue-300/20 transition-all duration-300 hover:bg-white-600/80 hover:shadow-lg hover:shadow-blue-50/20 active:scale-95"
            >
              Login
            </NavLink>
          </>
        )}
      </div>
    </div>
  );
}
