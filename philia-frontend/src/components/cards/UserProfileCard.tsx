import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faBirthdayCake, // For date of birth
  faMapMarkerAlt, // For address
  faUsers, // For friends count
  faCheck,
  faXmark,
  faUserPlus,
  faUserCheck,
  faUserXmark,
  faUserClock,
} from "@fortawesome/free-solid-svg-icons";
import { Navigate, NavLink, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../redux/store/store";
import { selectUserFriendIdSet } from "../../redux/selectors";
import { useQuery } from "@tanstack/react-query";
import {
  acceptFriendRequestOfUser,
  cancelFriendRequestOfUser,
  getProfileByUserId,
  rejectFriendRequestOfUser,
  removeFriendOfUser,
  sendFriendRequestToUser,
} from "../../shared/services/users";
import { APP_CONFIG } from "../../shared/config/appconfig";
import userIcon from "../../assets/user-icon.png";
import type { FriendRequest } from "../../shared/types/user/FriendRequest";
import {
  acceptFriendRequest,
  addFriendRequest,
  cancelFriendRequest,
  rejectFriendRequest,
  removeFriend,
  sendFriendRequest,
} from "../../redux/slices/user";
import CancelModal from "../overlays/CancelModal";
import GridLoading from "../loaders/GridLoading";

// Helper to format date for display
const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export default function UserProfileCard() {
  const { userId } = useParams();
  const currUserId = parseInt(userId!);

  const dispatch = useDispatch();

  const loggedInUser = useSelector(
    (state: RootState) => state.currentUser.user
  );
  const isLoggedInUser = loggedInUser?.id === currUserId;

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

  const {
    data: user,
    isPending,
    error,
    isError,
  } = useQuery({
    queryKey: ["user-profile", currUserId],
    queryFn: async () => getProfileByUserId(currUserId),
  });

  if (isError) {
    throw error;
  }

  const removeFriendFromList = async (userId: number) => {
    try {
      await removeFriendOfUser(loggedInUser!.id, userId);
      // Only dispatch after successful API call
      dispatch(removeFriend({ userId }));
    } catch (error) {
      console.error("Error removing friend:", error);
    }
  };

  const handleAcceptFriendRequest = async (userId: number) => {
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

  const handleRejectFriendRequest = async (userId: number) => {
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

  const handleSendFriendRequest = async (userId: number) => {
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

  const handleCancelRequest = async (userId: number) => {
    // Store the original request before dispatching, for potential restoration
    const originalRequest = loggedInUser?.sentFriendRequests.find(
      (req) => req.user.id === userId
    );

    try {
      dispatch(cancelFriendRequest({ userId }));
      await cancelFriendRequestOfUser(loggedInUser!.id, userId);
    } catch (error) {
      console.error("Error cancelling friend request:", error);
      // Restore the exact previous state
      if (originalRequest) {
        dispatch(sendFriendRequest({ newFriendRequest: originalRequest }));
      }
    }
  };

  return isPending ? (
    <div className="h-[50vh] text-xl flex justify-center items-center flex-col gap-2">
      <GridLoading />
      <p>Loading user profile</p>
    </div>
  ) : (
    user && (
      <div
        className="w-[33vw] relative flex flex-col p-4 backdrop-blur-lg border border-white/20 shadow-lg rounded gap-4 text-white"
        style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
      >
        {/* Profile Header */}
        <div className="flex flex-col items-center gap-3">
          <img
            src={
              user.profileImageUrl
                ? `${APP_CONFIG.API_URL}${user!.profileImageUrl}`
                : userIcon
            }
            alt={`${user.firstName} ${user.lastName}`}
            className="w-30 h-30 rounded-full border-2 border-white/50 object-contain bg-gray-800"
          />
          <h2 className="text-2xl font-bold">
            {user.firstName} {user.lastName}
          </h2>
        </div>

        {/* About */}
        <div className="text-md text-gray-200 px-2 text-justify">
          <p>{user.about}</p>
        </div>

        {/* User Details */}
        <div className="grid grid-cols-1 gap-2 text-md">
          <div className="flex items-center gap-2">
            <FontAwesomeIcon
              icon={faEnvelope}
              className="w-5 h-5 text-gray-400"
            />
            <span className="text-gray-300">{user.email}</span>
          </div>

          <div className="flex items-center gap-2">
            <FontAwesomeIcon
              icon={faBirthdayCake}
              className="w-5 h-5 text-gray-400"
            />
            <span className="text-gray-300">
              {formatDate(user.dateOfBirth)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <FontAwesomeIcon
              icon={faMapMarkerAlt}
              className="w-5 h-5 text-gray-400"
            />
            <span className="text-gray-300">
              {user.address.city}, {user.address.state}, {user.address.country}
            </span>
          </div>

          <div className="flex items-center gap-2 rounded-full bg-[#1307f542] px-2 w-max py-1">
            <FontAwesomeIcon icon={faUsers} className="w-5 h-5 text-gray-400" />
            <NavLink
              to={`/users/${currUserId.toString()}/friends`}
              className="text-gray-300 hover:underline"
              state={{ userId: currUserId.toString() }}
            >
              {user.friendsCount} Friends
            </NavLink>
          </div>
        </div>

        {/* Action Buttons */}
        {isLoggedInUser ? (
          <>
            <Navigate to="/profile" />
          </>
        ) : (
          <>
            {loggedInUserSentRequests.has(currUserId) && (
              <div className="action-btns flex justify-between mt-4 pr-2">
                <span className="rounded border border-white/20 flex gap-2 items-center px-2.5 py-1.5 bg-[#077bc85a] hover:bg-[#0689e086]">
                  <FontAwesomeIcon icon={faUserClock} className="text-xs" />
                  <span className="text-md">Request Sent</span>
                </span>
                <button
                  className="rounded border border-white/20 flex gap-2 items-center px-5 py-1.5 cursor-pointer hover:bg-red-700 bg-[rgba(166,2,2,0.3)] text-red-300 hover:text-white"
                  onClick={() => handleCancelRequest(currUserId)}
                >
                  <FontAwesomeIcon icon={faUserXmark} className="text-xs" />
                  <span className="text-md">Cancel</span>
                </button>
              </div>
            )}

            {loggedInUserReceivedRequests.has(currUserId) && (
              <div className="action-btns flex justify-between mt-4 pr-2">
                <button
                  className="rounded border border-white/20 flex gap-2 items-center px-5 py-1.5 cursor-pointer hover:bg-[#08a04d] bg-[rgba(2,166,73,0.3)]"
                  onClick={() => handleAcceptFriendRequest(currUserId)}
                >
                  <FontAwesomeIcon icon={faCheck} className="text-xs" />
                  <span className="text-md">Accept</span>
                </button>

                <button
                  className="rounded border border-white/20 flex gap-2 items-center px-5 py-1.5 cursor-pointer hover:bg-red-700 bg-[rgba(166,2,2,0.3)] text-red-300 hover:text-white"
                  onClick={() => handleRejectFriendRequest(currUserId)}
                >
                  <FontAwesomeIcon icon={faXmark} className="text-xs" />
                  <span className="text-md">Reject</span>
                </button>
              </div>
            )}

            {loggedInUserFriends.has(currUserId) && (
              <div className="action-btns flex justify-between mt-4">
                <span className="rounded border border-white/20 flex gap-2 items-center px-2.5 py-1.5 bg-[#077bc85a] hover:bg-[#0689e086]">
                  <FontAwesomeIcon icon={faUserCheck} className="text-xs" />
                  <span className="text-md">Friends</span>
                </span>

                {/* <button
                  className="rounded border border-white/20 flex gap-2 items-center px-5 py-1.5 cursor-pointer hover:bg-red-700 bg-[rgba(166,2,2,0.3)] text-red-300 hover:text-white"
                  onClick={() => removeFriendFromList(currUserId)}
                >
                  <FontAwesomeIcon icon={faUserXmark} className="text-xs" />
                  <span className="text-md">Remove</span>
                </button> */}
                <CancelModal
                  btnClass="rounded border border-white/20 flex gap-2 items-center px-5 py-1.5 cursor-pointer hover:bg-red-700 bg-[rgba(166,2,2,0.3)] text-red-300 hover:text-white"
                  btnText="Remove"
                  icon={faUserXmark}
                  text="Are you sure you want to remove this friend?"
                  loadingText="Removing..."
                  cancelFn={() => removeFriendFromList(currUserId)}
                />
              </div>
            )}

            {!loggedInUserFriends.has(currUserId) &&
              !loggedInUserReceivedRequests.has(currUserId) &&
              !loggedInUserSentRequests.has(currUserId) && (
                <div className="flex flex-row-reverse mt-4">
                  <button
                    className="rounded border border-white/20 flex gap-2 items-center px-2.5 py-1.5 cursor-pointer hover:bg-[#0689e086] bg-[#077bc85a]"
                    onClick={() => handleSendFriendRequest(currUserId)}
                  >
                    <FontAwesomeIcon icon={faUserPlus} className="text-xs" />
                    <span className="text-md">Add friend</span>
                  </button>
                </div>
              )}
          </>
        )}
      </div>
    )
  );
}
