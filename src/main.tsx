import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import App from "./App";
import { store } from "./store";
import { initializeAuth } from "./store/authSlice";
import { queryClient } from "./services/queryClient";
import "./index.css";

// Initialize auth state from localStorage
store.dispatch(initializeAuth());

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <App />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: "#363636",
                color: "#fff",
              },
              success: {
                style: {
                  background: "#22c55e",
                },
              },
              error: {
                style: {
                  background: "#ef4444",
                },
              },
            }}
          />
        </BrowserRouter>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </Provider>
  </React.StrictMode>
);
