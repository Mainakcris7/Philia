import axios from "axios";
import { APP_CONFIG } from "./appconfig";
import { getJwt } from "../services/auth";

export const axiosInstance = axios.create({
  baseURL: APP_CONFIG.API_URL,
});

export const axiosAuthInstance = axios.create({
  baseURL: APP_CONFIG.API_URL,
});

axiosAuthInstance.interceptors.request.use(
  (config) => {
    const jwt = getJwt(); // ✅ getJwt is called dynamically when a request is made

    if (jwt) {
      config.headers.Authorization = `Bearer ${jwt}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
