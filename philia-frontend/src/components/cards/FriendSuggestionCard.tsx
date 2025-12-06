import { useState } from "react";
import type { FriendSuggestion } from "../../shared/types/user/FriendSuggestion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserClock, faXmark } from "@fortawesome/free-solid-svg-icons";
import { APP_CONFIG } from "../../shared/config/appconfig";
import userIcon from "../../assets/user-icon.png";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store/store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sendFriendRequestToUser } from "../../shared/services/users";
import CircleLoading from "../loaders/CircleLoading";

export default function FriendSuggestionCard({
  suggestion,
}: {
  suggestion: FriendSuggestion;
}) {
  const DELAY_MS = 1000; // 1 second delay for optimistic UI
  const loggedInUser = useSelector(
    (state: RootState) => state.currentUser.user
  );
  const [requestSent, setRequestSent] = useState<boolean>(false);
  const [removed, setRemoved] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const queryClient = useQueryClient();

  const sendRequestMutation = useMutation({
    mutationFn: async () =>
      sendFriendRequestToUser(loggedInUser!.id, suggestion.user.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friend-suggestions"] });
    },
    onError: (error) => {
      console.error("Error sending friend request:", error);
    },
  });

  const removeSuggestionMutation = useMutation({
    mutationFn: async () => {},
    onSuccess: () => {
      // queryClient.invalidateQueries({ queryKey: ["friend-suggestions"] });
      queryClient.setQueryData<FriendSuggestion[]>(
        ["friend-suggestions"],
        (oldData) =>
          oldData
            ? oldData.filter((sugg) => sugg.user.id !== suggestion.user.id)
            : []
      );
    },
  });

  const sendFriendRequest = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (!loggedInUser || loading) return;

    setLoading(true);
    setRequestSent(true);
    setRemoved(false);

    setTimeout(async () => {
      try {
        await sendRequestMutation.mutateAsync();
      } catch (error) {
        console.error("Error sending friend request:", error);
        setRequestSent(false);
      } finally {
        setLoading(false);
      }
    }, DELAY_MS);
  };

  const removeFromSuggestions = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    e.stopPropagation();
    if (!loggedInUser || loading) return;

    setLoading(true);
    setRemoved(true);
    setRequestSent(false);

    setTimeout(async () => {
      try {
        await removeSuggestionMutation.mutateAsync();
      } finally {
        setLoading(false);
      }
    }, DELAY_MS);
  };

  return (
    <div
      className="w-[225px] relative flex flex-col justify-between items-center backdrop-blur-lg border border-white/20 shadow-lg rounded gap-1"
      style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
    >
      <div className="avatar flex items-center py-2 px-2">
        <img
          src={
            suggestion.user.profileImageUrl
              ? `${APP_CONFIG.API_URL}${suggestion.user.profileImageUrl}`
              : userIcon
          }
          alt={`${suggestion.user.firstName} ${suggestion.user.lastName}`}
          className="w-25 h-25 rounded-full object-contain bg-gray-800 outline-1"
        />
      </div>
      <div className="details relative flex-1 flex flex-col justify-center items-center py-2 h-full">
        <span className="font-semibold text-md">
          {suggestion.user.firstName} {suggestion.user.lastName}
        </span>
        <span className="text-sm text-gray-400">
          {suggestion.mutualConnectionsCount} mututal friends
        </span>
      </div>
      <div className="action-btns py-2 flex gap-2">
        {!requestSent && !removed ? (
          <>
            <button
              className="rounded border border-white/20 flex gap-2 justify-center items-center px-2.5 py-1.5 cursor-pointer hover:bg-[#0689e086] transition-all duration-200 bg-[#077bc85a] disabled:opacity-60 disabled:cursor-not-allowed"
              onClick={sendFriendRequest}
              disabled={loading}
            >
              <span className="text-[0.85rem]">Add friend</span>
              {loading && <CircleLoading width="16" height="16" />}
            </button>
            <button
              className="rounded border border-white/20 flex gap-2 justify-center items-center px-2.5 py-1.5 cursor-pointer hover:bg-red-700 transition-all duration-200 bg-[rgba(166,2,2,0.3)] text-red-300 hover:text-white disabled:opacity-60 disabled:cursor-not-allowed"
              onClick={removeFromSuggestions}
              disabled={loading}
            >
              <span className="text-[0.85rem]">Remove</span>
              {loading && <CircleLoading width="16" height="16" />}
            </button>
          </>
        ) : requestSent ? (
          <span className="rounded border border-white/20 flex gap-2 justify-center items-center px-2.5 py-1.5 hover:bg-[#0689e086] transition-all duration-200 bg-[#077bc85a]">
            <FontAwesomeIcon icon={faUserClock} className="text-sm" />
            <span className="text-[0.85rem]">Request Sent</span>
          </span>
        ) : (
          <span className="rounded border border-white/20 flex gap-2 justify-center items-center px-2.5 py-1.5 hover:bg-[#8e8e8e86] transition-all duration-200 bg-[#989c9e5a]">
            <FontAwesomeIcon icon={faXmark} className="text-sm" />
            <span className="text-[0.85rem]">Removed</span>
          </span>
        )}
      </div>
    </div>
  );
}
