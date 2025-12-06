import { axiosInstance, axiosAuthInstance } from "../config/axiosconfig";
import type { Comment } from "../types/comment/Comment";
import type { Post } from "../types/post/Post";
import type { User } from "../types/user/User";

// Base URL for the Post Controller
const POST_BASE_URL = "/posts";

/**
 * Gets all posts. Endpoint: /posts
 */
export const getAllPosts = async () => {
  const response = await axiosInstance.get<Post[]>(`${POST_BASE_URL}`);
  return response.data;
};

/**
 * Gets a post by its ID. Endpoint: /posts/{id}
 */
export const getPostById = async (id: number) => {
  const response = await axiosInstance.get<Post>(`${POST_BASE_URL}/${id}`);
  return response.data;
};

/**
 * Gets comments for a post. Endpoint: /posts/{postId}/comments
 */
export const getCommentsByPostId = async (postId: number) => {
  const response = await axiosAuthInstance.get<Comment[]>(
    `${POST_BASE_URL}/${postId}/comments`
  );
  return response.data;
};

/**
 * Gets users who liked a post. Endpoint: /posts/{postId}/likes
 */
export const getLikesByPostId = async (postId: number) => {
  const response = await axiosAuthInstance.get<User[]>(
    `${POST_BASE_URL}/${postId}/likes`
  );
  return response.data;
};
/**
 * Gets the top 10 trending posts. Endpoint: /posts/trending
 */
export const getTrendingPosts = async () => {
  const response = await axiosInstance.get<Post[]>(`${POST_BASE_URL}/trending`);
  return response.data;
};

/**
 * Creates a new post with data and an image. Endpoint: /posts
 */
export const createPost = async (newPostData: FormData) => {
  const response = await axiosAuthInstance.post<Post>(
    `${POST_BASE_URL}`,
    newPostData
  );
  return response.data;
};

/**
 * Updates an existing post with new data and an image. Endpoint: /posts
 */
export const updatePost = async (updatePostData: FormData) => {
  const response = await axiosAuthInstance.put<Post>(
    `${POST_BASE_URL}`,
    updatePostData
  );
  return response.data;
};

/**
 * Likes a post. Endpoint: /posts/{postId}/likes/add/{userId}
 */
export const likePostById = async (postId: number, userId: number) => {
  await axiosAuthInstance.post<boolean>(
    `${POST_BASE_URL}/${postId}/likes/add/${userId}`
  );
  return true;
};

/**
 * Removes a like from a post. Endpoint: /posts/{postId}/likes/remove/{userId}
 */
export const removeLikeFromPostById = async (
  postId: number,
  userId: number
) => {
  await axiosAuthInstance.delete<boolean>(
    `${POST_BASE_URL}/${postId}/likes/remove/${userId}`
  );
  return true;
};

/**
 * Deletes a post by its ID. Endpoint: /posts/{id}
 */
export const deletePostById = async (id: number) => {
  await axiosAuthInstance.delete<void>(`${POST_BASE_URL}/${id}`);
  return true;
};
