import { createSlice } from "@reduxjs/toolkit";
import type { User } from "../../shared/types/user/User";
import type { Post } from "../../shared/types/post/Post";
import type { Notification } from "../../shared/types/notification/Notification";
import type { UserDto } from "../../shared/types/user/UserDto";

export interface UserState {
  user: User | null;
  userPosts: Post[];
  userNotifications: Notification[];
  userPostIds: number[];
  userCommentIds: number[];
  userFriends: UserDto[];
}

const initialState: UserState = {
  user: null,
  userPosts: [],
  userNotifications: [],
  userPostIds: [],
  userCommentIds: [],
  userFriends: [],
};

export interface UserActionPayloadType {
  user: User | null;
  userPosts: Post[];
  userNotifications: Notification[];
  userPostIds: number[];
  userCommentIds: number[];
  userFriends: UserDto[];
}

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    storeLoggedInUserDetails: (
      state,
      action: { payload: UserActionPayloadType }
    ) => {
      state.user = action.payload.user;
      state.userPosts = action.payload.userPosts;
      state.userNotifications = action.payload.userNotifications;
      state.userPostIds = action.payload.userPostIds;
      state.userCommentIds = action.payload.userCommentIds;
      state.userFriends = action.payload.userFriends;
    },
    removeLoggedInUserDetails: (state) => {
      state.user = null;
      state.userPosts = [];
      state.userNotifications = [];
      state.userPostIds = [];
      state.userCommentIds = [];
      state.userFriends = [];
    },

    addUserPost: (state, action) => {
      state.userPosts.unshift(action.payload.newPost);
      state.userPostIds.push(action.payload.newPost.id);
    },

    deleteUserPost: (state, action) => {
      state.userPosts = state.userPosts.filter(
        (p) => p.id !== action.payload.postId
      );
      state.userPostIds = state.userPostIds.filter(
        (id) => id !== action.payload.postId
      );
    },

    editUserPost: (state, action) => {
      // Add a timestamp to the imageUrl to force refresh
      state.userPosts = state.userPosts.map((p: Post) =>
        p.id === action.payload.updatedPost.id
          ? {
              ...action.payload.updatedPost,
              imageUrl: `${
                action.payload.updatedPost.imageUrl
              }?t=${Date.now()}`,
            }
          : p
      );
    },

    addCommentId: (state, action) => {
      state.userCommentIds.push(action.payload.newCommentId);
    },
    removeCommentId: (state, action) => {
      state.userCommentIds = state.userCommentIds.filter(
        (id) => id !== action.payload.commentId
      );
    },

    addLikeToPost: (state, action) => {
      state.userPosts = state.userPosts.map((p) => {
        if (p.id === action.payload.postId) {
          return {
            ...p,
            likesCount: p.likesCount + 1,
          };
        }
        return p;
      });
      if (
        state.user &&
        !state.user.likedPostIds.includes(action.payload.postId)
      ) {
        state.user.likedPostIds.push(action.payload.postId);
      }
    },
    removeLikeFromPost: (state, action) => {
      state.userPosts = state.userPosts.map((p) => {
        if (p.id === action.payload.postId) {
          return {
            ...p,
            likesCount: p.likesCount - 1,
          };
        }
        return p;
      });
      if (state.user) {
        state.user.likedPostIds = state.user.likedPostIds.filter(
          (id) => id !== action.payload.postId
        );
      }
    },

    addLikeToComment: (state, action) => {
      if (
        state.user &&
        !state.user.likedCommentIds.includes(action.payload.commentId)
      ) {
        state.user.likedCommentIds.push(action.payload.commentId);
      }
    },

    removeLikeFromComment: (state, action) => {
      if (state.user) {
        state.user.likedCommentIds = state.user.likedCommentIds.filter(
          (id) => id !== action.payload.commentId
        );
      }
    },

    acceptFriendRequest: (state, action) => {
      state.userFriends.push(action.payload.newFriend);
      state.user!.receivedFriendRequests =
        state.user!.receivedFriendRequests.filter(
          (req) => req.user.id !== action.payload.newFriend.id
        );
      state.user!.friendsCount += 1;
    },
    rejectFriendRequest: (state, action) => {
      state.user!.receivedFriendRequests =
        state.user!.receivedFriendRequests.filter(
          (req) => req.user.id !== action.payload.userId
        );
    },
    addFriendRequest: (state, action) => {
      state.user!.receivedFriendRequests.push(action.payload.newFriendRequest);
    },
    sendFriendRequest: (state, action) => {
      state.user!.sentFriendRequests.push(action.payload.newFriendRequest);
    },
    cancelFriendRequest: (state, action) => {
      state.user!.sentFriendRequests = state.user!.sentFriendRequests.filter(
        (req) => req.user.id !== action.payload.userId
      );
    },
    addFriend: (state, action) => {
      state.userFriends.push(action.payload.newFriend);
      state.user!.friendsCount += 1;
    },
    removeFriend: (state, action) => {
      state.userFriends = state.userFriends.filter(
        (f) => f.id !== action.payload.userId
      );
      state.user!.friendsCount -= 1;
    },

    updateProfileImage: (state, action) => {
      if (state.user) {
        if (action.payload.newProfileImageUrl) {
          state.user.profileImageUrl =
            action.payload.newProfileImageUrl + `?t=${new Date().getTime()}`;
        } else state.user.profileImageUrl = "";
      }
    },

    updateUserProfile: (state, action) => {
      if (state.user) {
        state.user.firstName = action.payload.updatedUser.firstName;
        state.user.lastName = action.payload.updatedUser.lastName;
        state.user.about = action.payload.updatedUser.about;
        state.user.address = action.payload.updatedUser.address;
        state.user.dateOfBirth = action.payload.updatedUser.dateOfBirth;
      }
    },
    clearAllNotifications: (state) => {
      state.userNotifications = [];
    },
    readAllNotifications: (state) => {
      state.userNotifications = state.userNotifications.map((notification) => {
        return { ...notification, read: true };
      });
    },
    markNotificationAsRead: (state, action) => {
      state.userNotifications = state.userNotifications.map((notification) => {
        if (notification.id === action.payload.notificationId) {
          return { ...notification, read: true };
        }
        return notification;
      });
    },
    deleteNotification: (state, action) => {
      state.userNotifications = state.userNotifications.filter(
        (notification) => notification.id !== action.payload.notificationId
      );
    },
  },
});

export const {
  storeLoggedInUserDetails,
  removeLoggedInUserDetails,
  addUserPost,
  deleteUserPost,
  editUserPost,
  addCommentId,
  removeCommentId,
  addLikeToPost,
  removeLikeFromPost,
  addLikeToComment,
  removeLikeFromComment,
  acceptFriendRequest,
  rejectFriendRequest,
  addFriendRequest,
  sendFriendRequest,
  cancelFriendRequest,
  addFriend,
  removeFriend,
  updateProfileImage,
  updateUserProfile,
  clearAllNotifications,
  readAllNotifications,
  markNotificationAsRead,
  deleteNotification,
} = userSlice.actions;

export default userSlice.reducer;
