import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { loginUser, storeJwt } from "../shared/services/auth";
import {
  storeLoggedInUserDetails,
  type UserActionPayloadType,
} from "../redux/slices/user";
import type { Post } from "../shared/types/post/Post";
import {
  getCommentsByUserId,
  getFriendsByUserId,
  getPostsByUserId,
} from "../shared/services/users";
import { getAllNotificationsForUser } from "../shared/services/notifications";
import type { LoginResponse } from "../shared/types/auth/LoginResponse";
import type { Notification } from "../shared/types/notification/Notification";
import { toast, Bounce } from "react-toastify";
import type { Comment } from "../shared/types/comment/Comment";
import type { UserDto } from "../shared/types/user/UserDto";

export const useLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  return useMutation({
    mutationKey: ["login"],
    mutationFn: loginUser,
    onSuccess: (loginData: LoginResponse) => {
      async function fetchOtherDetailsOfTheUser() {
        let posts: Post[];
        let notifications: Notification[];
        let comments: Comment[];
        let friends: UserDto[];
        try {
          posts = await getPostsByUserId(loginData.user.id);
        } catch (error) {
          console.error(error);
          posts = [];
        }
        try {
          notifications = await getAllNotificationsForUser(loginData.user.id);
        } catch (error) {
          console.error(error);
          notifications = [];
        }
        try {
          comments = await getCommentsByUserId(loginData.user.id);
        } catch (error) {
          console.error(error);
          comments = [];
        }
        try {
          friends = await getFriendsByUserId(loginData.user.id);
        } catch (error) {
          console.error(error);
          friends = [];
        }
        const payload: UserActionPayloadType = {
          user: loginData.user,
          userPosts: posts,
          userNotifications: notifications,
          userPostIds: posts.map((post) => post.id),
          userCommentIds: comments.map((comment) => comment.id),
          userFriends: friends,
        };

        dispatch(storeLoggedInUserDetails(payload));
      }

      toast.success(
        `Welcome ${loginData.user.firstName + " " + loginData.user.lastName}`,
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          transition: Bounce,
        }
      );

      fetchOtherDetailsOfTheUser();
      storeJwt(loginData.jwtToken);
      navigate("/");
    },
  });
};
