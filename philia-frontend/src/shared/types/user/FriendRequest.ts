import type { UserDto } from "./UserDto";

export interface FriendRequest {
  user: UserDto;
  sentAt: Date;
}
