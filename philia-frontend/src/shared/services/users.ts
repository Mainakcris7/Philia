import { axiosAuthInstance, axiosInstance } from "../config/axiosconfig";
import type { Comment } from "../types/comment/Comment";
import type { Post } from "../types/post/Post";
import type { FriendSuggestion } from "../types/user/FriendSuggestion";
import type { User } from "../types/user/User";
import type { UserDto } from "../types/user/UserDto";
import type { UserUpdate } from "../types/user/UserUpdate";

const USER_BASE_URL = "/users";

export const getProfileByUserId = async (userId: number) => {
  const response = await axiosInstance.get<User>(
    `${USER_BASE_URL}/profile/${userId}`
  );
  return response.data;
};

export const getPostsByUserId = async (userId: number) => {
  const response = await axiosInstance.get<Post[]>(
    `${USER_BASE_URL}/profile/${userId}/posts`
  );
  return response.data;
};

export const getCommentsByUserId = async (userId: number) => {
  const response = await axiosInstance.get<Comment[]>(
    `${USER_BASE_URL}/${userId}/comments`
  );
  return response.data;
};

export const getFriendsByUserId = async (userId: number) => {
  const response = await axiosAuthInstance.get<UserDto[]>(
    `${USER_BASE_URL}/${userId}/friends`
  );
  return response.data;
};

export const getFriendSuggestionsByUserId = async (userId: number) => {
  const response = await axiosAuthInstance.get<FriendSuggestion[]>(
    `${USER_BASE_URL}/${userId}/friends/suggestions`
  );
  return response.data;
};

export const updateUser = async (updateUserData: UserUpdate) => {
  await axiosAuthInstance.put(`${USER_BASE_URL}`, updateUserData);
  return true;
};

export const updateUserProfileImage = async (
  userId: number,
  formData: FormData
) => {
  const response = await axiosAuthInstance.put<string | null>(
    `${USER_BASE_URL}/profile/${userId}/image`,
    formData
  );
  return response.data;
};

export const sendFriendRequestToUser = async (
  userId: number,
  friendId: number
) => {
  await axiosAuthInstance.post(
    `${USER_BASE_URL}/${userId}/friends/send/${friendId}`
  );
  return true;
};

export const acceptFriendRequestOfUser = async (
  userId: number,
  friendId: number
) => {
  await axiosAuthInstance.patch(
    `${USER_BASE_URL}/${userId}/friends/accept/${friendId}`
  );
  return true;
};

export const rejectFriendRequestOfUser = async (
  userId: number,
  senderId: number
) => {
  await axiosAuthInstance.delete(
    `${USER_BASE_URL}/${userId}/friends/reject/${senderId}`
  );
  return true;
};

export const cancelFriendRequestOfUser = async (
  userId: number,
  receiverId: number
) => {
  await axiosAuthInstance.delete(
    `${USER_BASE_URL}/${userId}/friends/cancel/${receiverId}`
  );
  return true;
};

export const removeFriendOfUser = async (userId: number, friendId: number) => {
  await axiosAuthInstance.delete(
    `${USER_BASE_URL}/${userId}/friends/remove/${friendId}`
  );
  return true;
};

export const deleteUserById = async (userId: number) => {
  await axiosAuthInstance.delete(`${USER_BASE_URL}/${userId}`);
  return true;
};
