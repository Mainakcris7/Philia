import type { UserAddress } from "./UserAddress";

export interface UserUpdate {
  id: number;
  firstName: string;
  lastName: string;
  about: string;
  address: UserAddress;
  dateOfBirth: Date;
}
