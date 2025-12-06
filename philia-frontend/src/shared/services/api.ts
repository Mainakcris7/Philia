import { axiosInstance } from "../config/axiosconfig";
import type { SearchResultType } from "../types/app/SearchResult";

const API_URL = "/api";

export const searchByKeyword = async (keyword: string) => {
  const result = await axiosInstance.get<SearchResultType>(
    `${API_URL}/search/${keyword}`
  );
  return result.data;
};
