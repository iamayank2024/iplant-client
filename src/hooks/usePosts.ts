import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import postsService, {
  type CreatePostRequest,
  type Post,
  type PostsFilter,
  type Comment,
  type CreateCommentRequest,
  type LeaderboardFilters,
  type NearbyPostsFilters,
} from "../services/postsService";
import toast from "react-hot-toast";

// Get all posts with optional filters
export function usePosts(filters?: PostsFilter) {
  return useQuery({
    queryKey: ["posts", filters],
    queryFn: () => postsService.getPosts(filters),
    gcTime: 1000 * 60 * 5,
    staleTime: 1000 * 60 * 5,
  });
}

// Get a post by ID
export function usePost(id: string) {
  return useQuery({
    queryKey: ["post", id],
    queryFn: () => postsService.getPostById(id),
    enabled: !!id,
  });
}

// Get posts by user ID
export function useUserPosts(userId: string) {
  return useQuery({
    queryKey: ["posts", "user", userId],
    queryFn: async () => {
      const posts = await postsService.getUserPosts(userId);
      return posts.map((post: Post) => ({
        ...post,
        isLiked: post.isLiked || false,
        isSaved: post.isSaved || false,
      }));
    },
    enabled: !!userId,
  });
}

// Get saved/bookmarked posts
export function useSavedPosts(userId: string) {
  return useQuery({
    queryKey: ["posts", "saved", userId],
    queryFn: async () => {
      const posts = await postsService.getSavedPosts(userId);
      return posts.map((post: Post) => ({
        ...post,
        isLiked: post.isLiked || false,
        isSaved: true, // These are saved posts, so isSaved should always be true
      }));
    },
    enabled: !!userId,
  });
}

// Get comments for a post
export function useComments(postId: string) {
  return useQuery({
    queryKey: ["comments", postId],
    queryFn: () => postsService.getComments(postId),
    enabled: !!postId,
  });
}

// Create a new post
export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postData: CreatePostRequest) =>
      postsService.createPost(postData),
    onSuccess: () => {
      // Invalidate posts queries to refetch with the new post
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("Your plant has been posted!");
    },
  });
}

// Add a comment to a post
export function useAddComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      postId,
      data,
    }: {
      postId: string;
      data: CreateCommentRequest;
    }) => postsService.addComment(postId, data),
    onMutate: async ({ postId, data }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["comments", postId] });
      await queryClient.cancelQueries({ queryKey: ["post", postId] });
      await queryClient.cancelQueries({ queryKey: ["posts"] });

      // Create optimistic comment
      const optimisticComment: Comment = {
        id: `temp-${Date.now()}`,
        postId,
        userId: "current-user", // This would come from auth context in a real app
        userName: "You", // This would come from auth context in a real app
        text: data.text,
        createdAt: new Date().toISOString(),
      };

      // Get previous comments
      const previousComments = queryClient.getQueryData<{
        comments: Comment[];
      }>(["comments", postId]);

      // Update comments in cache
      queryClient.setQueryData<Comment[]>(
        ["comments", postId],
        previousComments
          ? [optimisticComment, ...previousComments?.comments]
          : [optimisticComment]
      );

      // Get previous post
      const previousPost = queryClient.getQueryData<Post>(["post", postId]);

      // Update post comment count
      if (previousPost) {
        queryClient.setQueryData<Post>(["post", postId], {
          ...previousPost,
          commentsCount: (previousPost.commentsCount || 0) + 1,
        });
      }

      // Update post in posts list
      const previousPosts = queryClient.getQueryData<{ posts: Post[] }>([
        "posts",
      ]);
      if (previousPosts) {
        queryClient.setQueryData(["posts"], {
          ...previousPosts,
          posts: previousPosts.posts.map((post) =>
            post.id === postId
              ? { ...post, commentsCount: (post.commentsCount || 0) + 1 }
              : post
          ),
        });
      }

      return { previousComments, previousPost, previousPosts };
    },
    onSuccess: (_, { postId }) => {
      // Refetch comments to get server data
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      queryClient.invalidateQueries({ queryKey: ["post", postId] });

      // Update posts list to reflect new comment count
      queryClient.invalidateQueries({ queryKey: ["posts"] });

      toast.success("Comment added!");
    },
    onError: (_, { postId }, context) => {
      // Revert optimistic updates
      if (context?.previousComments) {
        queryClient.setQueryData(
          ["comments", postId],
          context.previousComments
        );
      }
      if (context?.previousPost) {
        queryClient.setQueryData(["post", postId], context.previousPost);
      }
      if (context?.previousPosts) {
        queryClient.setQueryData(["posts"], context.previousPosts);
      }
      toast.error("Failed to add comment");
    },
  });
}

// Delete a comment
export function useDeleteComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      postId,
      commentId,
    }: {
      postId: string;
      commentId: string;
    }) => postsService.deleteComment(postId, commentId),
    onMutate: async ({ postId, commentId }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["comments", postId] });
      await queryClient.cancelQueries({ queryKey: ["post", postId] });

      // Get previous comments
      const previousComments = queryClient.getQueryData<{
        comments: Comment[];
      }>(["comments", postId]);

      // Get previous post
      const previousPost = queryClient.getQueryData<Post>(["post", postId]);

      // Remove comment from cache
      if (previousComments?.comments) {
        queryClient.setQueryData<Comment[]>(
          ["comments", postId],
          previousComments.comments.filter(
            (comment) => comment.id !== commentId
          )
        );
      }

      // Update post comment count
      if (previousPost) {
        queryClient.setQueryData<Post>(["post", postId], {
          ...previousPost,
          commentsCount: Math.max(0, (previousPost.commentsCount || 0) - 1),
        });
      }

      return { previousComments, previousPost };
    },
    onSuccess: (_, { postId }) => {
      // Refetch to ensure data consistency
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });

      toast.success("Comment deleted");
    },
    onError: (_, { postId }, context) => {
      // Revert optimistic updates
      if (context?.previousComments) {
        queryClient.setQueryData(
          ["comments", postId],
          context.previousComments
        );
      }
      if (context?.previousPost) {
        queryClient.setQueryData(["post", postId], context.previousPost);
      }
      toast.error("Failed to delete comment");
    },
  });
}

// Delete a post
export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) => postsService.deletePost(postId),
    onSuccess: (_, postId) => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });

      // Remove the specific post from cache
      queryClient.removeQueries({ queryKey: ["post", postId] });
      toast.success("Post deleted");
    },
  });
}

// Like a post
export function useLikePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) => postsService.likePost(postId),
    // Optimistic update
    onMutate: async (postId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["post", postId] });
      await queryClient.cancelQueries({ queryKey: ["posts"] });

      // Save previous post value
      const previousPost = queryClient.getQueryData<Post>(["post", postId]);

      // Optimistically update the post
      if (previousPost) {
        queryClient.setQueryData<Post>(["post", postId], {
          ...previousPost,
          likes: previousPost.likes + 1,
          isLiked: true,
        });
      }

      // Update post in posts list
      const previousPosts = queryClient.getQueryData<{ posts: Post[] }>([
        "posts",
      ]);
      if (previousPosts) {
        queryClient.setQueryData(["posts"], {
          ...previousPosts,
          posts: previousPosts.posts.map((post) =>
            post.id === postId
              ? { ...post, likes: post.likes + 1, isLiked: true }
              : post
          ),
        });
      }

      return { previousPost, previousPosts };
    },
    onError: (_, postId, context) => {
      // Revert optimistic updates if there's an error
      if (context?.previousPost) {
        queryClient.setQueryData(["post", postId], context.previousPost);
      }
      if (context?.previousPosts) {
        queryClient.setQueryData(["posts"], context.previousPosts);
      }
    },
    onSettled: (_, __, postId) => {
      // Refetch to ensure data consistency
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}

// Unlike a post
export function useUnlikePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) => postsService.unlikePost(postId),
    // Optimistic update
    onMutate: async (postId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["post", postId] });
      await queryClient.cancelQueries({ queryKey: ["posts"] });

      // Save previous post value
      const previousPost = queryClient.getQueryData<Post>(["post", postId]);

      // Optimistically update the post
      if (previousPost) {
        queryClient.setQueryData<Post>(["post", postId], {
          ...previousPost,
          likes: Math.max(0, previousPost.likes - 1),
          isLiked: false,
        });
      }

      // Update post in posts list
      const previousPosts = queryClient.getQueryData<{ posts: Post[] }>([
        "posts",
      ]);
      if (previousPosts) {
        queryClient.setQueryData(["posts"], {
          ...previousPosts,
          posts: previousPosts.posts.map((post) =>
            post.id === postId
              ? { ...post, likes: Math.max(0, post.likes - 1), isLiked: false }
              : post
          ),
        });
      }

      return { previousPost, previousPosts };
    },
    onError: (_, postId, context) => {
      // Revert optimistic updates if there's an error
      if (context?.previousPost) {
        queryClient.setQueryData(["post", postId], context.previousPost);
      }
      if (context?.previousPosts) {
        queryClient.setQueryData(["posts"], context.previousPosts);
      }
    },
    onSettled: (_, __, postId) => {
      // Refetch to ensure data consistency
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}

// Toggle like state on a post
export function useToggleLike() {
  const likePost = useLikePost();
  const unlikePost = useUnlikePost();

  return (post: Post) => {
    if (post.isLiked) {
      unlikePost.mutate(post.id);
    } else {
      likePost.mutate(post.id);
    }
  };
}

// Save a post
export function useSavePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) => postsService.savePost(postId),
    // Optimistic update
    onMutate: async (postId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["post", postId] });
      await queryClient.cancelQueries({ queryKey: ["posts"] });

      // Save previous post value
      const previousPost = queryClient.getQueryData<Post>(["post", postId]);

      // Optimistically update the post
      if (previousPost) {
        queryClient.setQueryData<Post>(["post", postId], {
          ...previousPost,
          isSaved: true,
        });
      }

      // Update post in posts list
      const previousPosts = queryClient.getQueryData<{ posts: Post[] }>([
        "posts",
      ]);
      if (previousPosts) {
        queryClient.setQueryData(["posts"], {
          ...previousPosts,
          posts: previousPosts.posts.map((post) =>
            post.id === postId ? { ...post, isSaved: true } : post
          ),
        });
      }

      return { previousPost, previousPosts };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts", "saved"] });
    },
    onError: (_, postId, context) => {
      // Revert optimistic updates if there's an error
      if (context?.previousPost) {
        queryClient.setQueryData(["post", postId], context.previousPost);
      }
      if (context?.previousPosts) {
        queryClient.setQueryData(["posts"], context.previousPosts);
      }
    },
    onSettled: (_, __, postId) => {
      // Refetch to ensure data consistency
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}

// Unsave a post
export function useUnsavePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) => postsService.unsavePost(postId),
    // Optimistic update
    onMutate: async (postId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["post", postId] });
      await queryClient.cancelQueries({ queryKey: ["posts"] });

      // Save previous post value
      const previousPost = queryClient.getQueryData<Post>(["post", postId]);

      // Optimistically update the post
      if (previousPost) {
        queryClient.setQueryData<Post>(["post", postId], {
          ...previousPost,
          isSaved: false,
        });
      }

      // Update post in posts list
      const previousPosts = queryClient.getQueryData<{ posts: Post[] }>([
        "posts",
      ]);
      if (previousPosts) {
        queryClient.setQueryData(["posts"], {
          ...previousPosts,
          posts: previousPosts.posts.map((post) =>
            post.id === postId ? { ...post, isSaved: false } : post
          ),
        });
      }

      return { previousPost, previousPosts };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts", "saved"] });
    },
    onError: (_, postId, context) => {
      // Revert optimistic updates if there's an error
      if (context?.previousPost) {
        queryClient.setQueryData(["post", postId], context.previousPost);
      }
      if (context?.previousPosts) {
        queryClient.setQueryData(["posts"], context.previousPosts);
      }
    },
    onSettled: (_, __, postId) => {
      // Refetch to ensure data consistency
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}

// Toggle save state on a post
export function useToggleSave() {
  const savePost = useSavePost();
  const unsavePost = useUnsavePost();

  return (post: Post) => {
    if (post.isSaved) {
      unsavePost.mutate(post.id);
    } else {
      savePost.mutate(post.id);
    }
  };
}

// Get leaderboard data
export function useLeaderboard(filters?: LeaderboardFilters) {
  return useQuery({
    queryKey: ["leaderboard", filters],
    queryFn: () => postsService.getLeaderboard(filters),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
}

// Get leaderboard statistics
export function useLeaderboardStats(filters?: LeaderboardFilters) {
  return useQuery({
    queryKey: ["leaderboard-stats", filters],
    queryFn: () => postsService.getLeaderboardStats(filters),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
}

// Get nearby posts for community map
export function useNearbyPosts(filters: NearbyPostsFilters) {
  return useQuery({
    queryKey: ["nearby-posts", filters],
    queryFn: () => postsService.getNearbyPosts(filters),
    enabled: !!filters?.latitude && !!filters?.longitude,
    staleTime: 1000 * 60 * 2, // 2 minutes
    gcTime: 1000 * 60 * 5, // 5 minutes
  });
}
