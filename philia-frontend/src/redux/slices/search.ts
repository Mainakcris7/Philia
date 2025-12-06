import { createSlice } from "@reduxjs/toolkit";
import type { SearchResultType } from "../../shared/types/app/SearchResult";

export interface SearchState {
  searchResult: SearchResultType | null;
  isLoading: boolean;
}

const initialState: SearchState = {
  searchResult: null,
  isLoading: false,
};

export interface SearchActionPayloadType {
  searchResult: SearchResultType | null;
}

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setSearchResult: (state, action: { payload: SearchActionPayloadType }) => {
      state.searchResult = action.payload.searchResult;
    },
    removeSearchResult: (state) => {
      state.searchResult = null;
    },
    setSearchLoading: (state) => {
      state.isLoading = true;
    },
    setSearchNotLoading: (state) => {
      state.isLoading = false;
    },

    removePostFromSearchResult: (state, action) => {
      if (state.searchResult) {
        state.searchResult.posts = state.searchResult.posts.filter(
          (p) => p.id !== action.payload.postId
        );
      }
    },

    editPostInSearchResult: (state, action) => {
      // Add a timestamp to the imageUrl to force refresh
      if (state.searchResult) {
        state.searchResult.posts = state.searchResult.posts.map((p) =>
          p.id === action.payload.updatedPost.id
            ? {
                ...action.payload.updatedPost,
                imageUrl: action.payload.updatedPost.imageUrl
                  ? `${action.payload.updatedPost.imageUrl}?t=${Date.now()}`
                  : null,
              }
            : p
        );
      }
    },

    addLikeToPostInSearchResult: (state, action) => {
      if (state.searchResult) {
        state.searchResult.posts = state.searchResult.posts.map((p) => {
          if (p.id === action.payload.postId) {
            return {
              ...p,
              likesCount: p.likesCount + 1,
            };
          }
          return p;
        });
      }
    },

    removeLikeFromPostInSearchResult: (state, action) => {
      if (state.searchResult) {
        state.searchResult.posts = state.searchResult.posts.map((p) => {
          if (p.id === action.payload.postId) {
            return {
              ...p,
              likesCount: p.likesCount - 1,
            };
          }
          return p;
        });
      }
    },
  },
});

export const {
  setSearchResult,
  removeSearchResult,
  setSearchLoading,
  setSearchNotLoading,
  editPostInSearchResult,
  removePostFromSearchResult,
  addLikeToPostInSearchResult,
  removeLikeFromPostInSearchResult,
} = searchSlice.actions;

export default searchSlice.reducer;
