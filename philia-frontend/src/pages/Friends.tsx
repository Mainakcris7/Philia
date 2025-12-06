import { NavLink, useLocation } from "react-router-dom";
import LoginOrSignup from "../components/LoginOrSignup";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store/store";
import FriendCard from "../components/cards/FriendCard";
import { useQuery } from "@tanstack/react-query";
import type { UserDto } from "../shared/types/user/UserDto";
import { getFriendsByUserId } from "../shared/services/users";
import GridLoading from "../components/loaders/GridLoading";

export default function Friends() {
  const location = useLocation();
  // 1. Correctly extract and validate the userId from location state
  const { userId: userIdStr } = location.state || {};
  const userId = userIdStr ? Number(userIdStr) : null; // Use null for safety

  const loggedInUser = useSelector(
    (state: RootState) => state.currentUser.user
  );

  const loggedInUserFriends = useSelector(
    (state: RootState) => state.currentUser.userFriends
  );

  // Use the established variable `isCurrentUser`
  const isCurrentUser =
    loggedInUser && userId ? loggedInUser.id === userId : false;

  const {
    data: fetchedFriends,
    isLoading,
    isError,
    error,
  } = useQuery<UserDto[]>({
    queryKey: ["friends", userId],
    queryFn: () => getFriendsByUserId(userId!), // Assert non-null since `enabled` checks it
    // 2. Query is enabled if the user is logged in, we have a valid userId, AND it's NOT the current user
    enabled: !!loggedInUser && !!userId && !isCurrentUser,
  });

  if (!loggedInUser) {
    return <LoginOrSignup />;
  }

  // 3. Check for userId instead of the non-existent `friendsUrl`
  if (!userId) {
    return (
      <div className="flex flex-col gap-4 items-center mb-5 mt-5">
        <p className="text-xl text-red-500 font-semibold">
          Error: User ID is missing from navigation state.
        </p>
      </div>
    );
  }

  // 4. Conditional data assignment and state handling
  // Use UserDto[] as the consistent type for friend lists
  let friendsList: UserDto[] = [];
  let displayLoading = false;
  let displayError = false;

  // 5. Use `isCurrentUser` for the conditional logic
  if (isCurrentUser) {
    // Access friends directly from Redux
    friendsList = loggedInUserFriends;
  } else {
    // Handle fetched state
    friendsList = fetchedFriends || [];
    displayLoading = isLoading;
    displayError = isError;
  }

  if (displayLoading) {
    return (
      <div className="flex flex-col text-xl gap-2 items-center justify-center mb-5 mt-5 min-h-[80vh]">
        <GridLoading />
        <p>Loading friends</p>
      </div>
    );
  }

  if (displayError) {
    return (
      <div className="flex flex-col gap-4 items-center mb-5 mt-5">
        <p className="text-xl text-red-500 font-semibold">
          Error fetching friends: {error?.message}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-4 items-center mb-5">
        {friendsList.length === 0 ? (
          <p className="text-xl mt-5 text-gray-400 font-semibold">
            No friends found!
          </p>
        ) : (
          <>
            <h1 className="text-2xl font-semibold m-3">
              Friends <p className="text-orange-700">({friendsList.length})</p>
            </h1>
            {friendsList.map((friend) => (
              <NavLink to={`/users/${friend.id}`} key={friend.id}>
                <FriendCard friend={friend} />
              </NavLink>
            ))}
          </>
        )}
      </div>
    </>
  );
}
