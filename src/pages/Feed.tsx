import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useInView } from "react-intersection-observer";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

import postsService from "../services/postsService";
import { openAddPostModal, openPostDetailModal } from "../store/uiSlice";
import PostCard from "../components/PostCard";
import AddPostModal from "../components/AddPostModal";
import PostDetailModal from "../components/PostDetailModal";
import type { RootState } from "../store";

const Feed = () => {
  const dispatch = useDispatch();
  const [filter, setFilter] = useState<string | null>(null);
  const { isAddPostModalOpen, postDetailModal } = useSelector(
    (state: RootState) => state.ui
  );

  const user = useSelector((state: RootState) => state.auth.user);

  // Use react-intersection-observer to detect when user scrolls to bottom
  const { ref: loadMoreRef, inView } = useInView();

  // Setup infinite query
  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    isError,
  } = useInfiniteQuery({
    queryKey: ["posts", "feed", filter],
    queryFn: ({ pageParam = 1 }) =>
      postsService.getPosts({
        page: pageParam,
        limit: 10,
        plantType: filter || undefined,
      }),
    getNextPageParam: (lastPage) => {
      return lastPage.hasMore ? lastPage.posts.length / 10 + 1 : undefined;
    },
    initialPageParam: 1,
  });

  // Load more posts when user scrolls to bottom
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleAddPost = () => {
    dispatch(openAddPostModal());
  };

  const handleFilterChange = (newFilter: string | null) => {
    setFilter(newFilter);
  };

  const handlePostClick = (postId: string) => {
    dispatch(openPostDetailModal(postId));
  };

  // Get all posts from all pages
  const allPosts = data?.pages.flatMap((page) => page.posts) || [];

  return (
    <div className="container mx-auto px-4 py-6">
      {/* <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-heading font-bold text-text dark:text-white">
          Plant Feed
        </h1>
        <button
          onClick={handleAddPost}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
        >
          Add Plant
        </button>
      </div> */}

      {/* Filter Tabs */}
      <div className="flex overflow-x-auto pb-2 mb-6 gap-2">
        <button
          onClick={() => handleFilterChange(null)}
          className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
            filter === null
              ? "bg-primary text-white"
              : "bg-secondary dark:bg-gray-700 text-text dark:text-white hover:bg-primary-light"
          }`}
        >
          All Plants
        </button>
        {["tree", "flower", "succulent", "herb", "vegetable", "fruit"].map(
          (type) => (
            <button
              key={type}
              onClick={() => handleFilterChange(type)}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors capitalize ${
                filter === type
                  ? "bg-primary text-white"
                  : "bg-secondary dark:bg-gray-700 text-text dark:text-white hover:bg-primary-light"
              }`}
            >
              {type}
            </button>
          )
        )}
      </div>

      {/* Posts Grid */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
        </div>
      ) : isError ? (
        <div className="text-center py-12">
          <p className="text-error mb-4">Failed to load posts</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            Retry
          </button>
        </div>
      ) : allPosts.length > 0 ? (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {allPosts.map((post) => (
            <div
              key={post.id}
              onClick={() => handlePostClick(post.id)}
              className="cursor-pointer"
            >
              <PostCard post={post} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-text-muted dark:text-gray-400 mb-4">
            No plants found. Be the first to add one!
          </p>
          <button
            onClick={handleAddPost}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            Add Plant
          </button>
        </div>
      )}

      {/* Load more indicator */}
      {hasNextPage && (
        <div ref={loadMoreRef} className="flex justify-center py-8">
          {isFetchingNextPage ? (
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          ) : (
            <p className="text-text-muted dark:text-gray-400">
              Scroll to load more
            </p>
          )}
        </div>
      )}

      {/* Add Post Modal */}
      {isAddPostModalOpen && <AddPostModal />}

      {/* Post Detail Modal */}
      {postDetailModal.isOpen && postDetailModal.postId && (
        <PostDetailModal postId={postDetailModal.postId} />
      )}
    </div>
  );
};

export default Feed;
