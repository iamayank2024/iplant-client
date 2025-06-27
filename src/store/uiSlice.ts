import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface UIState {
  isDarkMode: boolean;
  isAddPostModalOpen: boolean;
  isSidebarOpen: boolean;
  toasts: Toast[];
  postDetailModal: {
    isOpen: boolean;
    postId: string | null;
  };
}

interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info";
  duration?: number;
}

const initialState: UIState = {
  isDarkMode: localStorage.getItem("theme") === "dark",
  isAddPostModalOpen: false,
  isSidebarOpen: false,
  toasts: [],
  postDetailModal: {
    isOpen: false,
    postId: null,
  },
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleDarkMode: (state) => {
      state.isDarkMode = !state.isDarkMode;
      localStorage.setItem("theme", state.isDarkMode ? "dark" : "light");
      if (state.isDarkMode) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    },
    setDarkMode: (state, action: PayloadAction<boolean>) => {
      state.isDarkMode = action.payload;
      localStorage.setItem("theme", action.payload ? "dark" : "light");
      if (action.payload) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    },
    openAddPostModal: (state) => {
      state.isAddPostModalOpen = true;
    },
    closeAddPostModal: (state) => {
      state.isAddPostModalOpen = false;
    },
    openPostDetailModal: (state, action: PayloadAction<string>) => {
      state.postDetailModal = {
        isOpen: true,
        postId: action.payload,
      };
    },
    closePostDetailModal: (state) => {
      state.postDetailModal = {
        isOpen: false,
        postId: null,
      };
    },
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    addToast: (state, action: PayloadAction<Omit<Toast, "id">>) => {
      const toast: Toast = {
        ...action.payload,
        id: Date.now().toString(),
      };
      state.toasts.push(toast);
    },
    removeToast: (state, action: PayloadAction<string>) => {
      state.toasts = state.toasts.filter(
        (toast) => toast.id !== action.payload
      );
    },
  },
});

export const {
  toggleDarkMode,
  setDarkMode,
  openAddPostModal,
  closeAddPostModal,
  openPostDetailModal,
  closePostDetailModal,
  toggleSidebar,
  addToast,
  removeToast,
} = uiSlice.actions;

export default uiSlice.reducer;
