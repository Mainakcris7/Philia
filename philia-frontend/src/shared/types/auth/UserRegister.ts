import type { UserAddress } from "../user/UserAddress";

export interface UserRegister {
  firstName: string;
  lastName: string;
  about?: string;
  address: UserAddress;
  dateOfBirth: string;
  email: string;
  password: string;
  registrationOtp: string;
}
