import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import userIcon from "../../assets/user-icon.png";
import {
  faEnvelope,
  faBirthdayCake, // For date of birth
  faMapMarkerAlt, // For address
  faUsers, // For friends count
  faSignOutAlt, // For logout
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";

// Helper to format date for display
const formatDate = (date: Date) => {
  const dob = new Date(date);
  return dob.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../redux/store/store";
import { removeLoggedInUserDetails } from "../../redux/slices/user";
import { removeJwt } from "../../shared/services/auth";
import { toast, Bounce } from "react-toastify";
// import { APP_CONFIG } from "../../shared/config/appconfig";
import UpdateProfileImage from "../overlays/UpdateProfileImage";
import UpdateProfileDetails from "../overlays/UpdateProfileDetails";

export default function ProfileCard() {
  // You would typically get the user data from a context or prop
  // For this example, we use the fake `currentUser` directly
  const user = useSelector((state: RootState) => state.currentUser.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Placeholder for logout/delete actions
  const handleLogout = () => {
    dispatch(removeLoggedInUserDetails());
    removeJwt();
    navigate("/auth/login");
    toast.success("Log out successful!", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      theme: "colored",
      transition: Bounce,
    });
  };

  const handleDeleteAccount = () => {
    console.log("Delete Account clicked");
    // Implement your delete account logic here (e.g., show confirmation dialog, API call)
  };

  return (
    <div
      className="w-[33vw] relative flex flex-col p-4 backdrop-blur-lg border border-white/20 shadow-lg rounded gap-4 text-white"
      style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
    >
      <UpdateProfileDetails />
      {/* Profile Header (Image, Name) */}
      <div className="flex flex-col items-center gap-3">
        {/* <img
          src={
            user!.profileImageUrl
              ? `${APP_CONFIG.API_URL}${user!.profileImageUrl}`
              : userIcon
          }
          alt={`${user!.firstName} ${user!.lastName}`}
          className="rounded-full w-40 h-40 outline-2 bg-gray-800 object-contain hover:opacity-80 transition-all duration-150"
        /> */}
        <UpdateProfileImage />
        <h2 className="text-2xl font-bold">
          {user!.firstName} {user!.lastName}
        </h2>
      </div>

      {/* About Section */}
      <div className="text-md text-gray-200 text-justify px-2">
        <p>{user!.about}</p>
      </div>

      {/* User Details */}
      <div className="grid grid-cols-1 gap-2 text-md">
        {/* Email */}
        <div className="flex items-center gap-2">
          <FontAwesomeIcon
            icon={faEnvelope}
            className="w-5 h-5 text-gray-400"
          />
          <span className="text-gray-300">{user!.email}</span>
        </div>

        {/* Date of Birth */}
        <div className="flex items-center gap-2">
          <FontAwesomeIcon
            icon={faBirthdayCake}
            className="w-5 h-5 text-gray-400"
          />
          <span className="text-gray-300">{formatDate(user!.dateOfBirth)}</span>
        </div>

        {/* Address */}
        <div className="flex items-center gap-2">
          <FontAwesomeIcon
            icon={faMapMarkerAlt}
            className="w-5 h-5 text-gray-400"
          />
          <span className="text-gray-300">
            {user!.address.city}, {user!.address.state}, {user!.address.country}
          </span>
        </div>

        {/* Friends Count */}
        <div className="flex items-center gap-2 rounded-full bg-[#1307f542] px-2 w-max py-1">
          <FontAwesomeIcon icon={faUsers} className="w-5 h-5 text-gray-400" />
          <NavLink
            to={`/users/${user!.id}/friends`}
            className="text-gray-300 hover:underline"
            state={{ userId: user!.id.toString() }}
          >
            {user!.friendsCount} Friends
          </NavLink>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between gap-2 mt-4">
        <button
          onClick={handleLogout}
          className="text-md flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-white/10 hover:bg-white/20 transition-colors duration-200 border border-white/30 text-white font-medium cursor-pointer"
        >
          <FontAwesomeIcon icon={faSignOutAlt} />
          Logout
        </button>
        <button
          onClick={handleDeleteAccount}
          className="text-md flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-red-600/20 hover:bg-red-600/30 transition-colors duration-200 border border-red-500/30 text-red-300 font-medium cursor-pointer"
        >
          <FontAwesomeIcon icon={faTrashAlt} />
          Delete
        </button>
      </div>
    </div>
  );
}
