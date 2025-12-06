import type { UserDto } from "../user/UserDto";

export interface Notification {
  id: number;
  recipientId: number;
  notifier: UserDto;
  eventType:
    | "UPDATE_PROFILE"
    | "FRIEND_REQUEST_SEND"
    | "FRIEND_REQUEST_ACCEPT"
    | "FRIEND_REQUEST_REJECT"
    | "POST_LIKE"
    | "POST_COMMENT"
    | "COMMENT_LIKE";
  read: boolean;
  message: string;
  link: string;
  createdAt: Date;
}
