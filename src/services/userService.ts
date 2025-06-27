import api from "./api";

// Types
export interface User {
  id: string;
  _id: string;
  name: string;
  email: string;
  bio?: string;
  location?: string;
  avatar?: string;
  coverImage?: string;
  joinedAt: string;
  plantsCount: number;
  likesCount: number;
  savedCount: number;
  badges: string[];
  createdAt: string;
  updatedAt: string;
  avatarUrl?: string;
  followersCount: number;
  followingCount: number;
}

export interface ProfileUpdateRequest {
  name?: string;
  bio?: string;
  location?: string;
  avatar?: File;
  coverImage?: File;
}

export interface UserStats {
  id: string;
  plantsCount: number;
  likesCount: number;
  savedCount: number;
  badges: string[];
  createdAt: string;
  updatedAt: string;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  avatar?: string;
  plantsCount: number;
  rank: number;
  isCurrentUser: boolean;
}

class UserService {
  // Get user profile by ID
  async getUserProfile(userId: string): Promise<User> {
    return api.get(`/users/${userId}`);
  }

  // Get current user profile
  async getCurrentUserProfile(): Promise<User> {
    return api.get("/auth/me");
  }

  // Get current user data (simple /me endpoint)
  async getMe(): Promise<User> {
    return api.get("/auth/me");
  }

  // Update user profile
  async updateUserProfile(profileData: ProfileUpdateRequest): Promise<User> {
    // If we have file uploads, use FormData
    if (profileData.avatar || profileData.coverImage) {
      const formData = new FormData();

      // Append text fields
      if (profileData.name) formData.append("name", profileData.name);
      if (profileData.bio) formData.append("bio", profileData.bio);
      if (profileData.location)
        formData.append("location", profileData.location);

      // Append files
      if (profileData.avatar) formData.append("avatar", profileData.avatar);
      if (profileData.coverImage)
        formData.append("coverImage", profileData.coverImage);

      return api.put("/users/me/profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    }

    // No files, use regular JSON
    return api.put("/users/me/profile", profileData);
  }

  // Update current user data (simple /me endpoint)
  async updateMe(userData: Partial<User>): Promise<User> {
    return api.put("/auth/me", userData);
  }

  // Get user statistics
  async getUserStats(userId: string): Promise<UserStats> {
    return api.get(`/users/${userId}/stats`);
  }

  // Change password
  async changePassword(
    oldPassword: string,
    newPassword: string
  ): Promise<{ success: boolean }> {
    return api.put("/users/me/password", {
      oldPassword,
      newPassword,
    });
  }

  // Get users leaderboard
  async getLeaderboard(
    timeFrame: "day" | "week" | "month" | "all" = "all",
    limit: number = 10
  ): Promise<LeaderboardEntry[]> {
    return api.get("/users/leaderboard", {
      params: { timeFrame, limit },
    });
  }

  // Follow a user
  async followUser(userId: string): Promise<{ success: boolean }> {
    return api.post(`/users/${userId}/follow`);
  }

  // Unfollow a user
  async unfollowUser(userId: string): Promise<{ success: boolean }> {
    return api.delete(`/users/${userId}/follow`);
  }

  // Get user's followers
  async getUserFollowers(userId: string): Promise<User[]> {
    return api.get(`/users/${userId}/followers`);
  }

  // Get users that a user is following
  async getUserFollowing(userId: string): Promise<User[]> {
    return api.get(`/users/${userId}/following`);
  }
}

export const userService = new UserService();
export default userService;
