import {
  faUserPlus,
  faXmark,
  faUserCheck,
  faCheck,
  faUserClock,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { User } from "../../shared/types/user/User";
import userIcon from "../../assets/user-icon.png";
import { APP_CONFIG } from "../../shared/config/appconfig";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../redux/store/store";
import { selectUserFriendIdSet } from "../../redux/selectors";
import {
  acceptFriendRequest,
  removeFriend,
  addFriendRequest,
  rejectFriendRequest,
  cancelFriendRequest,
  sendFriendRequest,
} from "../../redux/slices/user";
import {
  acceptFriendRequestOfUser,
  rejectFriendRequestOfUser,
  sendFriendRequestToUser,
} from "../../shared/services/users";
import type { FriendRequest } from "../../shared/types/user/FriendRequest";

export default function SearchUserCard({ user }: { user: User }) {
  const MAX_FULL_NAME_LENGTH = 18;
  const fullName = `${user.firstName} ${user.lastName}`;
  const truncatedFullName = fullName.substring(0, MAX_FULL_NAME_LENGTH);

  const dispatch = useDispatch();

  // ---------- Redux Values ----------
  const loggedInUser = useSelector(
    (state: RootState) => state.currentUser.user
  );

  const loggedInUserFriends = useSelector(selectUserFriendIdSet);

  const loggedInUserSentRequests = useSelector(
    (state: RootState) =>
      new Set(
        state.currentUser.user?.sentFriendRequests.map((req) => req.user.id)
      )
  );
  const loggedInUserReceivedRequests = useSelector(
    (state: RootState) =>
      new Set(
        state.currentUser.user?.receivedFriendRequests.map((req) => req.user.id)
      )
  );

  const isLoggedInUser = loggedInUser?.id === user.id;

  // ---------- Action Handlers ----------
  const handleAcceptFriendRequest = async (
    e: React.MouseEvent,
    userId: number
  ) => {
    e.stopPropagation();
    e.preventDefault();

    // Store the original request before dispatching, for potential restoration
    const originalRequest = loggedInUser?.receivedFriendRequests.find(
      (req) => req.user.id === userId
    );
    try {
      dispatch(acceptFriendRequest({ newFriend: user! }));
      await acceptFriendRequestOfUser(loggedInUser!.id, userId);
    } catch (error) {
      console.error("Error accepting friend request:", error);
      dispatch(removeFriend({ userId }));

      if (originalRequest) {
        dispatch(addFriendRequest({ newFriendRequest: originalRequest }));
      }
    }
  };

  const handleRejectFriendRequest = async (
    e: React.MouseEvent,
    userId: number
  ) => {
    e.stopPropagation();
    e.preventDefault();
    // Store the original request before dispatching, for potential restoration
    const originalRequest = loggedInUser?.receivedFriendRequests.find(
      (req) => req.user.id === userId
    );

    try {
      dispatch(rejectFriendRequest({ userId }));
      await rejectFriendRequestOfUser(loggedInUser!.id, userId);
    } catch (error) {
      console.error("Error rejecting friend request:", error);
      // Restore the exact previous state
      if (originalRequest) {
        dispatch(addFriendRequest({ newFriendRequest: originalRequest }));
      }
    }
  };

  const handleSendFriendRequest = async (
    e: React.MouseEvent,
    userId: number
  ) => {
    e.stopPropagation();
    e.preventDefault();

    const newFriendRequest: FriendRequest = {
      user: {
        id: userId,
        firstName: user!.firstName,
        lastName: user!.lastName,
        profileImageUrl: user!.profileImageUrl,
      },
      sentAt: new Date(),
    };
    try {
      dispatch(sendFriendRequest({ newFriendRequest }));
      await sendFriendRequestToUser(loggedInUser!.id, userId);
    } catch (error) {
      console.error("Error sending friend request:", error);
      dispatch(cancelFriendRequest({ userId }));
    }
  };

  return (
    <div
      className="w-[30vw] relative flex justify-between items-center backdrop-blur-lg border border-white/20 shadow-lg rounded gap-2"
      style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
    >
      {/* Avatar */}
      <div className="avatar flex items-center py-2 px-2">
        <img
          src={
            user.profileImageUrl
              ? `${APP_CONFIG.API_URL}${user.profileImageUrl}`
              : userIcon
          }
          alt={fullName}
          className="w-20 rounded-full h-20 object-contain bg-gray-800 outline-1"
        />
      </div>

      {/* Name */}
      <div className="details flex-1 flex flex-col py-2">
        <span className="font-semibold text-md">
          {truncatedFullName}
          {fullName.length > MAX_FULL_NAME_LENGTH ? "..." : ""}
        </span>
      </div>

      {/* --------------- ACTION BUTTONS --------------- */}
      {!isLoggedInUser && (
        <div className="action-btns py-2 flex flex-col gap-2 pr-2">
          {/* 1️⃣ Sent Request → Show Cancel */}
          {loggedInUserSentRequests.has(user.id) && (
            <span className="rounded border border-white/20 flex gap-1.5 items-center px-2.5 py-1.5 bg-[#077bc85a] hover:bg-[#0689e086]">
              <FontAwesomeIcon icon={faUserClock} className="text-xs" />
              <span className="text-md">Sent</span>
            </span>
          )}

          {/* 2️⃣ Received Request → Accept + Reject */}
          {loggedInUserReceivedRequests.has(user.id) && (
            <>
              <button
                className="rounded border border-white/20 flex gap-2 items-center px-5 py-1.5 bg-[rgba(2,166,73,0.3)] hover:bg-[#08a04d] cursor-pointer"
                onClick={(e) => handleAcceptFriendRequest(e, user.id)}
              >
                <FontAwesomeIcon icon={faCheck} className="text-sm" />
                <span className="text-sm">Accept</span>
              </button>

              <button
                className="rounded border border-white/20 flex gap-2 items-center px-5 py-1.5 bg-[rgba(166,2,2,0.3)] hover:bg-red-700 text-red-300 hover:text-white cursor-pointer"
                onClick={(e) => handleRejectFriendRequest(e, user.id)}
              >
                <FontAwesomeIcon icon={faXmark} className="text-sm" />
                <span className="text-sm">Reject</span>
              </button>
            </>
          )}

          {/* 3️⃣ Already Friends → Show "Friends" + Remove */}
          {loggedInUserFriends.has(user.id) && (
            <>
              <span className="rounded border border-white/20 flex gap-2 items-center px-3 py-1.5 bg-[#077bc85a]">
                <FontAwesomeIcon icon={faUserCheck} className="text-sm" />
                <span className="text-sm">Friends</span>
              </span>
            </>
          )}

          {/* 4️⃣ Nothing Yet → Show Add Friend */}
          {!loggedInUserFriends.has(user.id) &&
            !loggedInUserSentRequests.has(user.id) &&
            !loggedInUserReceivedRequests.has(user.id) && (
              <button
                className="rounded border border-white/20 flex gap-2 items-center px-3 py-1.5 bg-[#077bc85a] hover:bg-[#0689e086] cursor-pointer"
                onClick={(e) => handleSendFriendRequest(e, user.id)}
              >
                <FontAwesomeIcon icon={faUserPlus} className="text-sm" />
                <span className="text-sm">Add friend</span>
              </button>
            )}
        </div>
      )}
    </div>
  );
}
