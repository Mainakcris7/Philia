import { axiosAuthInstance, axiosInstance } from "../config/axiosconfig";
import type { LoginResponse } from "../types/auth/LoginResponse";
import type { UserLogin } from "../types/auth/UserLogin";
import type { User } from "../types/user/User";

const AUTH_BASE_URL = "/users/auth";

export const sendOtpToEmail = async (email: string) => {
  await axiosInstance.get(`${AUTH_BASE_URL}/pre-register/otp/send`, {
    params: { email },
  });
  return true;
};

export const getCurrentLoggedInUser = async () => {
  const response = await axiosAuthInstance.get<User>(`${AUTH_BASE_URL}/me`);
  return response.data;
};

export const loginUser = async (loginData: UserLogin) => {
  const response = await axiosInstance.post<LoginResponse>(
    `${AUTH_BASE_URL}/login`,
    loginData
  );
  return response.data;
};

export const registerUser = async (registerData: FormData) => {
  await axiosInstance.post(`${AUTH_BASE_URL}/register`, registerData);
  return true;
};

export const getJwt = () => {
  return localStorage.getItem("philiaJwt");
};

export const removeJwt = () => {
  localStorage.removeItem("philiaJwt");
};

export const storeJwt = (jwt: string) => {
  localStorage.setItem("philiaJwt", jwt);
};
