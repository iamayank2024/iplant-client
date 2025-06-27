import api from "./api";

// Types
export interface PostLocation {
  coordinates: [number, number];
  name?: string;
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  text: string;
  createdAt: string;
}

export interface Post {
  id: string;
  _id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  caption: string;
  imageUrl: string;
  likes: number;
  isLiked: boolean;
  isSaved: boolean;
  plantType: string;
  location?: PostLocation;
  createdAt: string;
  comments?: Comment[];
  commentsCount: number;
}

export interface CreatePostRequest {
  caption: string;
  imageFile: File;
  plantType: string;
  location?: {
    coordinates: [number, number];
    name?: string;
  };
}

export interface CreateCommentRequest {
  text: string;
}

export interface PostsFilter {
  userId?: string;
  plantType?: string;
  timeFrame?: "today" | "week" | "month" | "all";
  saved?: boolean;
  page?: number;
  limit?: number;
}

export interface LeaderboardUser {
  id: string;
  rank: number;
  name: string;
  avatar?: string;
  plantsCount: number;
  co2Saved: number;
  trend: "up" | "down" | "same";
  change: number;
  _id: string;
  numberOfPlants: number;
  avatarUrl: string;
}

export interface LeaderboardStats {
  leaderboard: LeaderboardUser[];
  platformStats: {
    activePlanters: number;
    totalPlants: number;
    totalCo2Saved: number;
    environmentalImpact: number;
    totalUsers: number;
  };
}

export interface LeaderboardFilters {
  timeRange?: "week" | "month" | "all";
  category?: "plants" | "co2" | "engagement";
  limit?: number;
}

export interface NearbyPostsFilters {
  latitude: number;
  longitude: number;
  radius?: number; // in kilometers, default 10
  plantType?: string;
  timeRange?: "today" | "week" | "month" | "all";
  limit?: number;
}

class PostsService {
  // Get paginated posts with optional filters
  async getPosts(
    filters?: PostsFilter
  ): Promise<{ posts: Post[]; totalCount: number; hasMore: boolean }> {
    return await api.get("/posts", {
      params: filters,
    });
  }

  // Get a specific post by ID
  async getPostById(id: string): Promise<Post> {
    return api.get(`/posts/${id}`);
  }

  // Get posts by a specific user
  async getUserPosts(userId: string): Promise<Post[]> {
    const response = await api.get(`/users/${userId}/posts`);
    return response.posts || response;
  }

  // Get saved/bookmarked posts
  async getSavedPosts(userId: string): Promise<Post[]> {
    const response = await api.get(`/users/${userId}/saved`);
    return response.posts || response;
  }

  // Create a new post
  async createPost(postData: CreatePostRequest): Promise<Post> {
    // Create form data for file upload
    const formData = new FormData();
    formData.append("caption", postData.caption);
    formData.append("plantType", postData.plantType);
    formData.append("image", postData.imageFile);

    if (postData.location) {
      formData.append("location", JSON.stringify(postData.location));
    }

    return api.post("/posts", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  // Update a post
  async updatePost(
    id: string,
    postData: Partial<Omit<CreatePostRequest, "imageFile">>
  ): Promise<Post> {
    return api.put(`/posts/${id}`, postData);
  }

  // Delete a post
  async deletePost(id: string): Promise<void> {
    return api.delete(`/posts/${id}`);
  }

  // Like a post
  async likePost(id: string): Promise<{ success: boolean }> {
    return api.post(`/posts/${id}/like`);
  }

  // Unlike a post
  async unlikePost(id: string): Promise<{ success: boolean }> {
    return api.delete(`/posts/${id}/like`);
  }

  // Save/bookmark a post
  async savePost(id: string): Promise<{ success: boolean }> {
    return api.post(`/posts/${id}/save`);
  }

  // Unsave/unbookmark a post
  async unsavePost(id: string): Promise<{ success: boolean }> {
    return api.delete(`/posts/${id}/save`);
  }

  // Get comments for a post
  async getComments(postId: string): Promise<{ comments: Comment[] }> {
    return api.get(`/posts/${postId}/comments`);
  }

  // Add a comment to a post
  async addComment(
    postId: string,
    data: CreateCommentRequest
  ): Promise<Comment> {
    return api.post(`/posts/${postId}/comments`, data);
  }

  // Delete a comment
  async deleteComment(postId: string, commentId: string): Promise<void> {
    return api.delete(`/posts/${postId}/comments/${commentId}`);
  }

  // Get leaderboard data
  async getLeaderboard(
    filters?: LeaderboardFilters
  ): Promise<LeaderboardStats> {
    return api.get("/users/leaderboard", { params: filters });
  }

  // Get leaderboard statistics
  async getLeaderboardStats(
    filters?: LeaderboardFilters
  ): Promise<LeaderboardStats> {
    return api.get("/users/leaderboard/stats", { params: filters });
  }

  // Get nearby posts
  async getNearbyPosts(filters: NearbyPostsFilters): Promise<{
    posts: Post[];
    totalCount: number;
    hasMore: boolean;
  }> {
    return api.get("/posts/nearby", { params: filters });
  }
}

export const postsService = new PostsService();
export default postsService;
