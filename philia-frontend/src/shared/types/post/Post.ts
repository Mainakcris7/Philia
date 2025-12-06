import type { UserDto } from "../user/UserDto";

export interface Post {
  id: number;
  caption: string;
  imageUrl: string | null;
  user: UserDto;
  likesCount: number;
  commentsCount: number;
  postLikesUrl: string;
  postCommentsUrl: string;
  createdAt: Date;
}
