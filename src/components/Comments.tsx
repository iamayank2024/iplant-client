import { useState } from "react";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { Send, Trash2, Loader2, LogIn } from "lucide-react";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

import {
  useComments,
  useAddComment,
  useDeleteComment,
} from "../hooks/usePosts";
import { type RootState } from "../store";

interface CommentsProps {
  postId: string;
}

interface CommentFormData {
  text: string;
}

const Comments: React.FC<CommentsProps> = ({ postId }) => {
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );
  const [commentId, setCommentId] = useState<string | null>(null);
  const { data: comments, isLoading, isError } = useComments(postId);
  const addCommentMutation = useAddComment();
  const deleteCommentMutation = useDeleteComment();

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<CommentFormData>();

  const onSubmit = async (data: CommentFormData) => {
    if (!isAuthenticated) {
      return;
    }

    try {
      await addCommentMutation.mutateAsync({
        postId,
        data: { text: data.text },
      });
      reset(); // Clear the form after successful submission
    } catch (error) {}
  };

  const handleDeleteComment = (commentId: string) => {
    setCommentId(commentId);
    deleteCommentMutation.mutate({ postId, commentId });
  };

  return (
    <div className="border-t border-border dark:border-gray-700 p-4">
      {/* Comment Form */}
      {isAuthenticated ? (
        <form onSubmit={handleSubmit(onSubmit)} className="mb-4">
          <div className="flex items-center space-x-2">
            <div className="flex-1 relative">
              <input
                type="text"
                {...register("text", {
                  required: "Comment text is required",
                  maxLength: {
                    value: 500,
                    message: "Comment must be less than 500 characters",
                  },
                })}
                placeholder="Add a comment..."
                className="w-full px-4 py-2 bg-secondary dark:bg-gray-700 border border-border dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              {errors.text && (
                <p className="absolute text-xs text-error mt-1 ml-2">
                  {errors.text.message}
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={isSubmitting || addCommentMutation.isPending}
              className="p-2 bg-primary text-white rounded-full hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {addCommentMutation.isPending ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Send size={18} />
              )}
            </button>
          </div>
        </form>
      ) : (
        <div className="mb-4 p-4 bg-secondary dark:bg-gray-700 rounded-lg text-center">
          <p className="text-text-muted mb-2">Please log in to add a comment</p>
          <Link
            to="/login"
            className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            <LogIn size={18} className="mr-2" />
            Log In
          </Link>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="flex justify-center py-4">
            <Loader2 size={24} className="animate-spin text-primary" />
          </div>
        ) : isError ? (
          <p className="text-center text-error py-2">Failed to load comments</p>
        ) : comments?.comments && comments?.comments.length > 0 ? (
          comments?.comments.map((comment) => (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start space-x-3"
            >
              {/* User Avatar */}
              {comment.userAvatar ? (
                <img
                  src={comment.userAvatar}
                  alt={comment.userName}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center">
                  <span className="text-sm font-bold text-primary">
                    {comment.userName.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}

              {/* Comment Content */}
              <div className="flex-1">
                <div className="bg-secondary dark:bg-gray-700 rounded-lg px-3 py-2">
                  <p className="text-sm">
                    <span className="font-medium text-text dark:text-white mr-2">
                      {comment.userName}
                    </span>
                    <span className="text-text dark:text-gray-200">
                      {comment.text}
                    </span>
                  </p>
                </div>

                {/* Timestamp & Actions */}
                <div className="flex items-center mt-1 text-xs text-text-muted">
                  <span>
                    {formatDistanceToNow(new Date(comment.createdAt), {
                      addSuffix: true,
                    })}
                  </span>

                  {/* Delete button (only for own comments) */}
                  {user && user.id === comment.userId && (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleDeleteComment(comment.id);
                      }}
                      className="ml-2 p-1 hover:text-error transition-colors"
                      disabled={deleteCommentMutation.isPending}
                    >
                      <Trash2 size={14} />
                      {commentId === comment.id && isLoading && (
                        <Loader2 size={14} className="animate-spin" />
                      )}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <p className="text-center text-text-muted py-2">
            No comments yet. Be the first to comment!
          </p>
        )}
      </div>
    </div>
  );
};

export default Comments;
