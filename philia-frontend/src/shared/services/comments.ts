import { axiosInstance, axiosAuthInstance } from "../config/axiosconfig"; // Adjust import path as needed
import type { Comment } from "../types/comment/Comment";
import type { CommentCreate } from "../types/comment/CommentCreate";
import type { CommentUpdate } from "../types/comment/CommentUpdate";
import type { User } from "../types/user/User";

// Base URL for the Comment Controller
const COMMENT_BASE_URL = "/comments";

/**
 * Gets a comment by its ID. Endpoint: /comments/{id}
 */
export const getCommentById = async (id: number) => {
  const response = await axiosInstance.get<Comment>(
    `${COMMENT_BASE_URL}/${id}`
  );
  return response.data;
};

/**
 * Gets users who liked a comment. Endpoint: /comments/{commentId}/likes
 */
export const getLikesByCommentId = async (commentId: number) => {
  const response = await axiosAuthInstance.get<User[]>(
    `${COMMENT_BASE_URL}/${commentId}/likes`
  );
  return response.data;
};

/**
 * Adds a new comment to a post. Endpoint: /comments
 */
export const addCommentToPost = async (commentCreateData: CommentCreate) => {
  const response = await axiosAuthInstance.post<Comment>(
    `${COMMENT_BASE_URL}`,
    commentCreateData
  );
  return response.data;
};

/**
 * Updates an existing comment. Endpoint: /comments
 */
export const updateComment = async (commentUpdateData: CommentUpdate) => {
  const response = await axiosAuthInstance.put<Comment>(
    `${COMMENT_BASE_URL}`,
    commentUpdateData
  );
  return response.data;
};

/**
 * Likes a comment. Endpoint: /comments/{commentId}/likes/add/{userId}
 */
export const likeCommentById = async (commentId: number, userId: number) => {
  await axiosAuthInstance.post<boolean>(
    `${COMMENT_BASE_URL}/${commentId}/likes/add/${userId}`
  );
  return true;
};

/**
 * Removes a like from a comment. Endpoint: /comments/{commentId}/likes/remove/{userId}
 */
export const removeLikeFromCommentById = async (
  commentId: number,
  userId: number
) => {
  const response = await axiosAuthInstance.delete<boolean>(
    `${COMMENT_BASE_URL}/${commentId}/likes/remove/${userId}`
  );
  return response.data;
};

/**
 * Deletes a comment by its ID. Endpoint: /comments/{commentId}
 */
export const deleteCommentById = async (commentId: number) => {
  await axiosAuthInstance.delete<void>(`${COMMENT_BASE_URL}/${commentId}`);
};
