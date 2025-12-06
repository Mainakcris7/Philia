import { NavLink } from "react-router-dom";
import NotificationCard from "../components/cards/NotificationCard";
import LoginOrSignup from "../components/LoginOrSignup";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../redux/store/store";
import {
  clearAllNotificationsOfUser,
  readAllNotificationsForUser,
} from "../shared/services/notifications";
import {
  clearAllNotifications,
  readAllNotifications,
} from "../redux/slices/user";

export default function Notifications() {
  const loggedInUser = useSelector(
    (state: RootState) => state.currentUser.user
  );
  const userNotifications = useSelector(
    (state: RootState) => state.currentUser.userNotifications
  );
  const dispatch = useDispatch();

  const readAll = async () => {
    if (!loggedInUser) return;
    try {
      dispatch(readAllNotifications());
      await readAllNotificationsForUser(loggedInUser.id);
    } catch (error) {
      console.error("Error reading all notifications:", error);
    }
  };

  const clearAll = async () => {
    if (!loggedInUser) return;
    try {
      dispatch(clearAllNotifications());
      await clearAllNotificationsOfUser(loggedInUser.id);
    } catch (error) {
      console.error("Error clearning all notifications:", error);
    }
  };
  return loggedInUser ? (
    <div className="flex flex-col gap-4 items-center mb-5">
      {userNotifications && userNotifications.length > 0 ? (
        <>
          <div className="action-btns w-[33vw] flex justify-between">
            <button
              className="text-md text-gray-400 hover:underline cursor-pointer"
              onClick={readAll}
            >
              Read All
            </button>
            <button
              className="text-md text-gray-400 hover:underline cursor-pointer"
              onClick={clearAll}
            >
              Clear All
            </button>
          </div>
          {userNotifications.map((notification) => (
            <NavLink to={`${notification.link}`} key={notification.id}>
              <NotificationCard
                notification={notification}
                key={notification.id}
              />
            </NavLink>
          ))}
        </>
      ) : (
        <p className="text-xl mt-2 text-gray-400 font-semibold">
          No notifications found!
        </p>
      )}
    </div>
  ) : (
    <LoginOrSignup />
  );
}
