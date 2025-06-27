import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2 } from "lucide-react";
import { useDispatch } from "react-redux";

import { usePost } from "../hooks/usePosts";
import { closePostDetailModal } from "../store/uiSlice";
import Comments from "./Comments";

interface PostDetailModalProps {
  postId: string;
}

const PostDetailModal: React.FC<PostDetailModalProps> = ({ postId }) => {
  const dispatch = useDispatch();
  const { data: post, isLoading, isError } = usePost(postId);

  const handleClose = () => {
    dispatch(closePostDetailModal());
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-card dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border dark:border-gray-700">
            <h2 className="text-xl font-heading font-semibold text-text dark:text-white">
              Post Details
            </h2>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-secondary dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              <X size={24} className="text-text-muted" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : isError ? (
              <div className="flex flex-col items-center justify-center h-64">
                <p className="text-error mb-4">Failed to load post</p>
                <button
                  onClick={handleClose}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                >
                  Close
                </button>
              </div>
            ) : post ? (
              <div className="md:flex">
                {/* Post Image */}
                <div className="md:w-1/2 bg-secondary dark:bg-gray-700">
                  <img
                    src={post.imageUrl}
                    alt={post.caption}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Post Details and Comments */}
                <div className="md:w-1/2 flex flex-col">
                  {/* Post Header */}
                  <div className="p-4 border-b border-border dark:border-gray-700">
                    <div className="flex items-center space-x-3">
                      {post.userAvatar ? (
                        <img
                          src={post.userAvatar}
                          alt={post.userName}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center">
                          <span className="text-xl font-bold text-primary">
                            {post.userName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div>
                        <h3 className="font-medium text-text dark:text-white">
                          {post.userName}
                        </h3>
                        {post.location && (
                          <div className="text-xs text-text-muted">
                            {post.location.name || "Unknown location"}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Caption */}
                  <div className="p-4 border-b border-border dark:border-gray-700">
                    <p className="text-text dark:text-white">
                      <span className="font-medium mr-2">{post.userName}</span>
                      {post.caption}
                    </p>
                    {/* Plant Type Badge */}
                    {post.plantType && (
                      <div className="inline-flex items-center px-3 py-1 mt-2 bg-primary-light text-primary rounded-full text-sm">
                        <span className="font-medium capitalize">
                          {post.plantType}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Comments Section */}
                  <div className="flex-1 overflow-y-auto">
                    <Comments postId={post.id} />
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64">
                <p className="text-text-muted">Post not found</p>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PostDetailModal;
