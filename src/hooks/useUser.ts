import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import userService, {
  type ProfileUpdateRequest,
  type User,
} from "../services/userService";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { updateUser } from "../store/authSlice";

// Get a user profile by ID
export function useUserProfile(userId?: string) {
  return useQuery({
    queryKey: ["user", "profile", userId],
    queryFn: () =>
      userId
        ? userService.getUserProfile(userId)
        : userService.getCurrentUserProfile(),
    enabled: userId !== undefined,
  });
}

// Get current user profile
export function useCurrentUserProfile() {
  return useQuery({
    queryKey: ["user", "profile", "me"],
    queryFn: () => userService.getCurrentUserProfile(),
  });
}

// Get current user data (simple /me endpoint)
export function useMe() {
  return useQuery({
    queryKey: ["user", "me"],
    queryFn: () => userService.getMe(),
  });
}

// Get user statistics
export function useUserStats(userId: string) {
  return useQuery({
    queryKey: ["user", "stats", userId],
    queryFn: () => userService.getUserStats(userId),
    enabled: !!userId,
  });
}

// Update user profile
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (profileData: ProfileUpdateRequest) =>
      userService.updateUserProfile(profileData),
    onSuccess: (updatedUser) => {
      // Update user data in cache
      queryClient.invalidateQueries({ queryKey: ["user", "profile", "me"] });
      queryClient.invalidateQueries({
        queryKey: ["user", "profile", updatedUser.id],
      });

      toast.success("Profile updated successfully");
    },
  });
}

// Update current user data (simple /me endpoint)
export function useUpdateMe() {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: (userData: Partial<User>) => userService.updateMe(userData),
    onSuccess: (updatedUser) => {
      // Update user data in cache
      queryClient.invalidateQueries({ queryKey: ["user", "me"] });
      queryClient.invalidateQueries({ queryKey: ["user", "profile", "me"] });

      // Update Redux state
      dispatch(updateUser(updatedUser));

      toast.success("Profile updated successfully");
    },
  });
}

// Get leaderboard data
export function useLeaderboard(
  timeFrame: "day" | "week" | "month" | "all" = "all",
  limit: number = 10
) {
  return useQuery({
    queryKey: ["leaderboard", timeFrame, limit],
    queryFn: () => userService.getLeaderboard(timeFrame, limit),
  });
}

// Follow a user
export function useFollowUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => userService.followUser(userId),
    onSuccess: (_, userId) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ["user", "profile", userId] });
      queryClient.invalidateQueries({ queryKey: ["user", "profile", "me"] });
      queryClient.invalidateQueries({
        queryKey: ["user", "followers", userId],
      });
      queryClient.invalidateQueries({ queryKey: ["user", "following", "me"] });
    },
  });
}

// Unfollow a user
export function useUnfollowUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => userService.unfollowUser(userId),
    onSuccess: (_, userId) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ["user", "profile", userId] });
      queryClient.invalidateQueries({ queryKey: ["user", "profile", "me"] });
      queryClient.invalidateQueries({
        queryKey: ["user", "followers", userId],
      });
      queryClient.invalidateQueries({ queryKey: ["user", "following", "me"] });
    },
  });
}

// Get user followers
export function useUserFollowers(userId: string) {
  return useQuery({
    queryKey: ["user", "followers", userId],
    queryFn: () => userService.getUserFollowers(userId),
    enabled: !!userId,
  });
}

// Get users that a user is following
export function useUserFollowing(userId: string) {
  return useQuery({
    queryKey: ["user", "following", userId],
    queryFn: () => userService.getUserFollowing(userId),
    enabled: !!userId,
  });
}

// Change password
export function useChangePassword() {
  return useMutation({
    mutationFn: ({
      oldPassword,
      newPassword,
    }: {
      oldPassword: string;
      newPassword: string;
    }) => userService.changePassword(oldPassword, newPassword),
    onSuccess: () => {
      toast.success("Password changed successfully");
    },
  });
}
