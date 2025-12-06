import type { Post } from "../post/Post";
import type { User } from "../user/User";

export interface SearchResultType{
    users: User[];
    posts: Post[];
}