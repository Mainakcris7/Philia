import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { Notification } from "../../shared/types/notification/Notification";
import { getTimeElapsed } from "../../shared/utils/AppUtils";
import {
  faComment,
  faEllipsis,
  faEye,
  faHeart,
  faUser,
  faUserGroup,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import userIcon from "../../assets/user-icon.png";
import { APP_CONFIG } from "../../shared/config/appconfig";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../redux/store/store";
import {
  deleteNotification,
  markNotificationAsRead,
} from "../../redux/slices/user";
import {
  deleteNotificationById,
  readNotificationById,
} from "../../shared/services/notifications";

export default function NotificationCard({
  notification,
}: {
  notification: Notification;
}) {
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const loggedInUser = useSelector(
    (state: RootState) => state.currentUser.user
  );
  const dispatch = useDispatch();

  let icon = null;

  const menuVisibilityClasses = showOptions
    ? "opacity-100 translate-x-0 pointer-events-auto" // Final visible state
    : "opacity-0 translate-x-[-10px] pointer-events-none"; // Start 10px higher and fully transparent

  if (
    notification.eventType === "COMMENT_LIKE" ||
    notification.eventType === "POST_LIKE"
  ) {
    icon = <FontAwesomeIcon icon={faHeart} color="#F91880" />;
  } else if (notification.eventType === "FRIEND_REQUEST_SEND") {
    icon = (
      <FontAwesomeIcon className="w-[90%]" icon={faUserGroup} color="#1D9BF0" />
    );
  } else if (notification.eventType === "FRIEND_REQUEST_ACCEPT") {
    icon = (
      <FontAwesomeIcon className="w-[90%]" icon={faUserGroup} color="#17bf63" />
    );
  } else if (notification.eventType === "FRIEND_REQUEST_REJECT") {
    icon = (
      <FontAwesomeIcon className="w-[90%]" icon={faUserGroup} color="#8899A6" />
    );
  } else if (notification.eventType === "POST_COMMENT") {
    icon = (
      <FontAwesomeIcon className="w-[90%]" icon={faComment} color="#1D9BF0" />
    );
  } else {
    icon = (
      <FontAwesomeIcon className="w-[90%]" icon={faUser} color="#AAB8C2" />
    );
  }

  const handleShowOptions = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    setShowOptions(!showOptions);
  };

  const handleMarkAsRead = async (
    e: React.MouseEvent<HTMLButtonElement> | React.MouseEvent<HTMLDivElement>
  ) => {
    if (e.currentTarget instanceof HTMLButtonElement) {
      e.stopPropagation();
      e.preventDefault();
    }

    if (!loggedInUser) return;
    setShowOptions(false);
    try {
      dispatch(markNotificationAsRead({ notificationId: notification.id }));
      await readNotificationById(loggedInUser.id, notification.id);
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleDeleteNotification = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.stopPropagation();
    e.preventDefault();

    if (!loggedInUser) return;

    setShowOptions(false);
    try {
      dispatch(deleteNotification({ notificationId: notification.id }));
      await deleteNotificationById(loggedInUser.id, notification.id);
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };
  return (
    <div
      className={`w-[35vw] relative flex justify-between items-center backdrop-blur-lg border border-white/20 shadow-lg rounded gap-2`}
      style={{
        backgroundColor: notification.read
          ? "rgba(255, 255, 255, 0.1)"
          : "rgba(50, 143, 250, 0.2)",
      }}
      onClick={handleMarkAsRead}
    >
      <div className="ml-auto cursor-pointer absolute right-2 top-0 bottom-2 text-white">
        <button
          className="rounded-full relative top-0.5 px-0.5 left-0.5 cursor-pointer z-50 hover:bg-white/10 transition-colors duration-200"
          onClick={(e) => handleShowOptions(e)}
        >
          <FontAwesomeIcon icon={faEllipsis} className="text-md" />
        </button>
        <div
          className={`w-[100px] text-sm absolute left-9 top-0 flex flex-col backdrop-blur-sm
                                         bg-white/10 rounded-md border border-white/20 shadow-2xl overflow-hidden
                                         origin-top-right transition-all duration-100 ease-out ${menuVisibilityClasses}`}
        >
          <button
            className="py-1.5 flex gap-2 justify-center items-center w-full cursor-pointer hover:bg-white/10 transition-colors duration-200"
            onClick={(e) => handleMarkAsRead(e)}
          >
            <FontAwesomeIcon icon={faEye} />
            Read
          </button>
          <button
            className="py-1.5 flex gap-2 justify-center items-center w-full cursor-pointer hover:bg-white/10 transition-colors duration-200"
            onClick={(e) => handleDeleteNotification(e)}
          >
            <FontAwesomeIcon icon={faXmark} />
            Delete
          </button>
        </div>
      </div>
      <div className="avatar relative flex items-center py-2 px-2">
        <img
          src={
            // If the notifier is the logged-in user, show their profile image, else show the notifier's profile image (useful when profile image is updated)
            notification.notifier.id === loggedInUser?.id
              ? loggedInUser?.profileImageUrl
                ? `${APP_CONFIG.API_URL}${loggedInUser.profileImageUrl}`
                : userIcon
              : notification.notifier.profileImageUrl
              ? `${APP_CONFIG.API_URL}${notification.notifier.profileImageUrl}`
              : userIcon
          }
          alt={`${notification.notifier.firstName} ${notification.notifier.lastName}`}
          className="w-18 h-18 rounded-full object-contain outline-1 bg-gray-800"
        />
        <div className="notification-icon absolute bottom-1 right-2 w-8 h-8 flex justify-center items-center bg-[#010645b3] backdrop-blur-xl rounded-full">
          {icon}
        </div>
      </div>
      <div className="details relative flex-1 flex flex-col p-2 h-full">
        <span className="text-md">
          <span className="font-semibold ">{`${notification.notifier.firstName} ${notification.notifier.lastName}`}</span>{" "}
          {notification.message}
        </span>
        <span className="text-sm mt-1 text-gray-400">
          {getTimeElapsed(notification.createdAt)}
        </span>
      </div>
    </div>
  );
}
