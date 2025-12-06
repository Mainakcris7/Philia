import {
  faCheck,
  faUserCheck,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import type { FriendRequest } from "../../shared/types/user/FriendRequest";
import { getTimeElapsed } from "../../shared/utils/AppUtils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { APP_CONFIG } from "../../shared/config/appconfig";
import userIcon from "../../assets/user-icon.png";
import {
  acceptFriendRequestOfUser,
  rejectFriendRequestOfUser,
} from "../../shared/services/users";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../redux/store/store";
import {
  acceptFriendRequest,
  rejectFriendRequest,
} from "../../redux/slices/user";
import type { UserDto } from "../../shared/types/user/UserDto";
import CircleLoading from "../loaders/CircleLoading";

export default function FriendRequestCard({
  friendRequest,
}: {
  friendRequest: FriendRequest;
}) {
  const MAX_FULL_NAME_LENGTH = 18;
  const fullName =
    friendRequest.user.firstName + " " + friendRequest.user.lastName;
  const truncatedFullName = fullName.substring(0, MAX_FULL_NAME_LENGTH);

  const DELAY_MS = 1000; // 1 second delay for optimistic UI
  const loggedInUser = useSelector(
    (state: RootState) => state.currentUser.user
  );
  const [requestAccepted, setRequestAccepted] = useState<boolean>(false);
  const [requestRejected, setRequestRejected] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const dispatch = useDispatch();

  const acceptRequest = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();

    if (!loggedInUser || loading) return;

    setLoading(true);

    // 1. Optimistic UI update immediately to show 'Friends' span
    setRequestAccepted(true);
    setRequestRejected(false); // Should ensure rejection is reset

    const newFriend: UserDto = {
      id: friendRequest.user.id,
      firstName: friendRequest.user.firstName,
      lastName: friendRequest.user.lastName,
      profileImageUrl: friendRequest.user.profileImageUrl,
    };

    // 2. Delay the API call and Redux dispatch
    setTimeout(async () => {
      try {
        // Send API request
        await acceptFriendRequestOfUser(loggedInUser.id, friendRequest.user.id);

        // Update Redux state globally
        dispatch(acceptFriendRequest({ newFriend }));
      } catch (error) {
        console.error("Error accepting friend request:", error);
        // On failure, revert local state
        setRequestAccepted(false);
      } finally {
        setLoading(false);
      }
    }, DELAY_MS);
  };

  const rejectRequest = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();

    if (!loggedInUser || loading) return;

    setLoading(true);

    // 1. Optimistic UI update immediately to show 'Rejected' span
    setRequestRejected(true);
    setRequestAccepted(false); // Should ensure acceptance is reset

    // 2. Delay the API call and Redux dispatch
    setTimeout(async () => {
      try {
        // Send API request
        await rejectFriendRequestOfUser(loggedInUser.id, friendRequest.user.id);

        // Update Redux state globally
        dispatch(rejectFriendRequest({ userId: friendRequest.user.id }));
      } catch (error) {
        console.error("Error rejecting friend request:", error);
        // On failure, revert local state
        setRequestRejected(false);
      } finally {
        setLoading(false);
      }
    }, DELAY_MS);
  };
  return (
    <div
      className="w-[30vw] relative flex justify-between items-center backdrop-blur-lg border border-white/20 shadow-lg rounded gap-2"
      style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
    >
      <div className="avatar flex items-center py-2 px-2">
        <img
          src={
            friendRequest.user.profileImageUrl
              ? `${APP_CONFIG.API_URL}${friendRequest.user.profileImageUrl}`
              : userIcon
          }
          alt={`${friendRequest.user.firstName} ${friendRequest.user.lastName}`}
          className="w-20 h-20 rounded-full bg-gray-800 object-contain outline-1"
        />
      </div>
      <div className="details relative flex-1 flex flex-col py-2 h-full">
        <span className="font-semibold text-md">
          {truncatedFullName}
          {fullName.length > MAX_FULL_NAME_LENGTH ? "..." : ""}
        </span>
        <span className="text-sm text-gray-400">
          Received {getTimeElapsed(friendRequest.sentAt)}
        </span>
      </div>
      <div className="action-btns py-2 flex flex-col gap-2 pr-2">
        {!requestAccepted && !requestRejected ? (
          <>
            <button
              className="rounded border border-white/20 flex gap-2 justify-center items-center px-5 pl-2.5 py-1.5 cursor-pointer hover:bg-[#08a04d] transition-all duration-200 bg-[rgba(2,166,73,0.3)] disabled:opacity-60 disabled:cursor-not-allowed"
              onClick={acceptRequest}
              disabled={loading}
            >
              <FontAwesomeIcon icon={faCheck} className="text-sm" />
              <span className="text-[0.8rem]">Accept</span>
              {loading && <CircleLoading width="14" height="14" />}
            </button>
            <button
              className="rounded border border-white/20 flex gap-2 justify-center items-center px-5 pl-2.5 py-1.5 cursor-pointer hover:bg-red-700 transition-all duration-200 bg-[rgba(166,2,2,0.3)] text-red-300 hover:text-white disabled:opacity-60 disabled:cursor-not-allowed"
              onClick={rejectRequest}
              disabled={loading}
            >
              <FontAwesomeIcon icon={faXmark} className="text-sm" />
              <span className="text-[0.8rem]">Cancel</span>
              {loading && <CircleLoading width="14" height="14" />}
            </button>
          </>
        ) : requestAccepted ? (
          <span className="rounded border border-white/20 flex gap-2 items-center px-2.5 py-1.5 bg-[#077bc85a] hover:bg-[#0689e086]">
            <FontAwesomeIcon icon={faUserCheck} className="text-xs" />
            <span className="text-md">Friends</span>
          </span>
        ) : (
          <span className="rounded border border-white/20 flex gap-2 justify-center items-center px-5 pl-2.5 py-1.5 bg-[rgba(166,2,2,0.3)]">
            <FontAwesomeIcon icon={faXmark} className="text-sm" />
            <span className="text-[0.8rem]">Rejected</span>
          </span>
        )}
      </div>
    </div>
  );
}
