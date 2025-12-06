import type { UserDto } from "./UserDto";

export interface FriendSuggestion {
  user: UserDto;
  mutualConnectionsCount: number;
}
