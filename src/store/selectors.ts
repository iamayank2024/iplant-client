import type { RootState } from "./index";
import type { Post } from "./postsSlice";

// Posts selectors
export const selectPosts = (state: RootState): Post[] => state.posts.posts;
export const selectUserPosts = (state: RootState): Post[] =>
  state.posts.userPosts;
export const selectPostsLoading = (state: RootState): boolean =>
  state.posts.loading;
export const selectPostsError = (state: RootState): string | null =>
  state.posts.error;

// Auth selectors
export const selectAuth = (state: RootState) => state.auth;
export const selectUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState): boolean =>
  state.auth.isAuthenticated;

// UI selectors
export const selectUI = (state: RootState) => state.ui;
export const selectIsDarkMode = (state: RootState): boolean =>
  state.ui.isDarkMode;
export const selectIsAddPostModalOpen = (state: RootState): boolean =>
  state.ui.isAddPostModalOpen;
export const selectIsSidebarOpen = (state: RootState): boolean =>
  state.ui.isSidebarOpen;
