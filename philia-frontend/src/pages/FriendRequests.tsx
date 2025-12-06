import { NavLink } from "react-router-dom";
import FriendRequestCard from "../components/cards/FriendRequestCard";
import FriendSuggestions from "../components/FriendSuggestions";
import LoginOrSignup from "../components/LoginOrSignup";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store/store";

export default function FriendRequests() {
  const loggedInUser = useSelector(
    (state: RootState) => state.currentUser.user
  );

  const receivedFriendRequests = loggedInUser?.receivedFriendRequests || [];

  return loggedInUser ? (
    <>
      <div className="flex flex-col gap-4 items-center mb-5">
        {receivedFriendRequests.length === 0 ? (
          <p className="text-xl mt-5 text-gray-400 font-semibold">
            No friend requests found!
          </p>
        ) : (
          <>
            <h1 className="text-2xl font-semibold m-3">
              Friend Requests{" "}
              <p className="text-orange-700">
                ({receivedFriendRequests.length})
              </p>
            </h1>
            {receivedFriendRequests.map((friendRequest, i) => (
              <NavLink to={`/users/${friendRequest.user.id}`} key={i}>
                <FriendRequestCard friendRequest={friendRequest} key={i} />
              </NavLink>
            ))}
          </>
        )}
      </div>
      <div className="flex flex-col gap-4 mt-6 items-center mb-5">
        <FriendSuggestions />
      </div>
    </>
  ) : (
    <LoginOrSignup />
  );
}
