import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "./store/store";

const selectUserPostIds = (state: RootState) => state.currentUser.userPostIds;

// Create a memoized selector that converts the array to a Set
export const selectUserPostIdSet = createSelector(
  [selectUserPostIds],
  (postIds) => new Set<number>(postIds) // <--- Create the Set here
);

const selectUserCommentIds = (state: RootState) =>
  state.currentUser.userCommentIds;

export const selectUserCommentIdSet = createSelector(
  [selectUserCommentIds],
  (commentIds) => new Set<number>(commentIds) // <--- Create the Set here
);

const selectUserFriendIds = (state: RootState) =>
  state.currentUser.userFriends.map((friend) => friend.id);

export const selectUserFriendIdSet = createSelector(
  [selectUserFriendIds],
  (friendIds) => new Set<number>(friendIds)
);

const selectLikedPostIds = (state: RootState) =>
  state.currentUser.user?.likedPostIds;

export const selectUserLikedPostIdsSet = createSelector(
  [selectLikedPostIds],
  (likedPostIds) => new Set<number>(likedPostIds ?? [])
);

const selectLikedCommentIds = (state: RootState) =>
  state.currentUser.user?.likedCommentIds;

export const selectUserLikedCommentIdsSet = createSelector(
  [selectLikedCommentIds],
  (likedCommentIds) => new Set<number>(likedCommentIds ?? [])
);
