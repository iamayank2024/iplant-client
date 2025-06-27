import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import authService, {
  type LoginRequest,
  type SignupRequest,
  type ForgotPasswordRequest,
  type ResetPasswordRequest,
} from "../services/authService";
import { useDispatch } from "react-redux";
import {
  loginSuccess,
  loginStart,
  loginFailure,
  logout,
} from "../store/authSlice";

export function useLogin() {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (credentials: LoginRequest) => {
      dispatch(loginStart());
      return authService.login(credentials);
    },
    onSuccess: (data) => {
      dispatch(loginSuccess(data.user));
      queryClient.invalidateQueries({ queryKey: ["user"] });
      toast.success("Login successful!");

      // Use setTimeout to ensure React state updates before navigation
      setTimeout(() => {
        navigate("/feed");
      }, 0);
    },
    onError: (error: any) => {
      dispatch(loginFailure(error?.response?.data?.message || "Login failed"));
    },
  });
}

export function useSignup() {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (userData: SignupRequest) => {
      dispatch(loginStart());
      return authService.signup(userData);
    },
    onSuccess: (data) => {
      dispatch(loginSuccess(data.user));
      queryClient.invalidateQueries({ queryKey: ["user"] });
      toast.success("Account created successfully!");

      // Use setTimeout to ensure React state updates before navigation
      setTimeout(() => {
        navigate("/feed");
      }, 0);
    },
    onError: (error: any) => {
      dispatch(loginFailure(error?.response?.data?.message || "Signup failed"));
    },
  });
}

export function useForgotPassword() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: ForgotPasswordRequest) =>
      authService.forgotPassword(data),
    onSuccess: (data) => {
      toast.success(data.message || "Password reset link sent to your email");

      // Navigate to login page after a short delay
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    },
  });
}

export function useResetPassword() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: ResetPasswordRequest) => authService.resetPassword(data),
    onSuccess: (data) => {
      toast.success(data.message || "Password reset successfully");

      // Navigate to login page after a short delay
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      dispatch(logout());
      // Clear any user-related queries from the cache
      queryClient.removeQueries({ queryKey: ["user"] });
      queryClient.removeQueries({ queryKey: ["posts"] });
      toast.success("You have been logged out");

      // Use setTimeout to ensure React state updates before navigation
      setTimeout(() => {
        navigate("/login");
      }, 0);
    },
  });
}
