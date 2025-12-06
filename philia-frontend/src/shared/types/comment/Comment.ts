import type { UserDto } from "../user/UserDto";

export interface Comment {
  id: number;
  postId: number;
  content: string;
  user: UserDto;
  likesCount: number;
  commentLikesUrl: string;
  createdAt: Date;
}
