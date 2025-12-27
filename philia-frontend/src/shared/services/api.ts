import { axiosAuthInstance, axiosInstance } from "../config/axiosconfig";
import type { SearchResultType } from "../types/app/SearchResult";

const API_URL = "/api";

export const searchByKeyword = async (keyword: string) => {
  const result = await axiosInstance.get<SearchResultType>(
    `${API_URL}/search/${keyword}`
  );
  return result.data;
};

export const enhanceContent = async (content: string, tone: string, type: string) => {
  const result = await axiosAuthInstance.get<string>(
    `${API_URL}/ai/enhance-content`,
    {
      params: { content, tone, type },
    }
  );
  return result.data;
}