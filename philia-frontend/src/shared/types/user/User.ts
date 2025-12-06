import type { FriendRequest } from "./FriendRequest";
import type { UserAddress } from "./UserAddress";

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  profileImageUrl: string;
  email: string;
  about: string;
  address: UserAddress;
  userPostsUrl: string;
  friendsUrl: string;
  friendsCount: number;
  sentFriendRequests: FriendRequest[];
  receivedFriendRequests: FriendRequest[];
  likedPostIds: number[];
  likedCommentIds: number[];
  dateOfBirth: Date;
  createdAt: Date;
}
