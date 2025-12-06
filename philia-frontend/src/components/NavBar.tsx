import {
  faHouse as faHouseSolid,
  faMagnifyingGlass,
  faBell as faBellSolid,
  faUserGroup,
  faFire,
} from "@fortawesome/free-solid-svg-icons";

import HeaderNavLink from "./HeaderNavLink";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  type UserActionPayloadType,
  storeLoggedInUserDetails,
} from "../redux/slices/user";
import { getCurrentLoggedInUser, getJwt } from "../shared/services/auth";
import { getAllNotificationsForUser } from "../shared/services/notifications";
import {
  getPostsByUserId,
  getCommentsByUserId,
  getFriendsByUserId,
} from "../shared/services/users";
import type { Post } from "../shared/types/post/Post";
import type { User } from "../shared/types/user/User";
import type { UserDto } from "../shared/types/user/UserDto";
import type { Notification } from "../shared/types/notification/Notification";
import type { Comment } from "../shared/types/comment/Comment";
import type { RootState } from "../redux/store/store";

export default function NavBar() {
  const dispatch = useDispatch();
  const loggedInUser = useSelector(
    (state: RootState) => state.currentUser.user
  );

  const userNotifications = useSelector(
    (state: RootState) => state.currentUser.userNotifications
  );

  useEffect(() => {
    if (!getJwt()) {
      return;
    }
    if (loggedInUser) {
      return;
    }
    const getCurrentLoggedInUserDetails = async () => {
      try {
        const user: User = await getCurrentLoggedInUser();
        async function fetchOtherDetailsOfTheUser(user: User) {
          let posts: Post[];
          let notifications: Notification[];
          let comments: Comment[];
          let friends: UserDto[];
          try {
            posts = await getPostsByUserId(user.id);
          } catch (error) {
            console.error(error);
            posts = [];
          }
          try {
            notifications = await getAllNotificationsForUser(user.id);
          } catch (error) {
            console.error(error);
            notifications = [];
          }
          try {
            comments = await getCommentsByUserId(user.id);
          } catch (error) {
            console.error(error);
            comments = [];
          }
          try {
            friends = await getFriendsByUserId(user.id);
          } catch (error) {
            console.error(error);
            friends = [];
          }
          const payload: UserActionPayloadType = {
            user: user,
            userPosts: posts,
            userNotifications: notifications,
            userPostIds: posts.map((post) => post.id),
            userCommentIds: comments.map((comment) => comment.id),
            userFriends: friends,
          };
          dispatch(storeLoggedInUserDetails(payload));
        }
        await fetchOtherDetailsOfTheUser(user);
      } catch (err) {
        console.error(err);
        // navigate("/auth/login");
      }
    };
    getCurrentLoggedInUserDetails();
  }, []);
  return (
    <div className="navbar flex gap-7 justify-center items-center">
      <HeaderNavLink
        to="/"
        icon={faHouseSolid}
        tooltipText="Home"
        color="RGB(169, 252, 207, 0.7)"
      />
      <HeaderNavLink
        to="/friend-requests"
        icon={faUserGroup}
        tooltipText="Requests"
        color="RGB(235, 187, 250, 0.7)"
        badge={loggedInUser?.receivedFriendRequests.length}
      />
      <HeaderNavLink
        to="/trending"
        icon={faFire}
        tooltipText="Trending"
        activeColor="darkorange"
        color="RGB(250, 199, 187, 0.7)"
      />
      <HeaderNavLink
        to="/search"
        icon={faMagnifyingGlass}
        tooltipText="Search"
        color="RGB(225, 246, 250, 0.7)"
      />
      <HeaderNavLink
        to="/notifications"
        icon={faBellSolid}
        tooltipText="Notifications"
        color="RGB(245, 241, 179, 0.7)"
        badge={userNotifications.filter((n) => !n.read).length}
      />
    </div>
  );
}
