import { useState } from "react";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import {
  Heart,
  Bookmark,
  Share2,
  MapPin,
  MoreVertical,
  MessageCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

import { useToggleLike, useToggleSave } from "../hooks/usePosts";
import { type Post } from "../services/postsService";
import { openPostDetailModal } from "../store/uiSlice";

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const dispatch = useDispatch();
  const [imageLoading, setImageLoading] = useState(true);
  const [showMenu, setShowMenu] = useState(false);

  // Use the toggle hooks from usePosts
  const toggleLike = useToggleLike();
  const toggleSave = useToggleSave();

  const handleLike = () => {
    toggleLike(post);
    if (!post.isLiked) {
      toast.success("Post liked! 💚", { duration: 2000 });
    }
  };

  const handleSave = () => {
    toggleSave(post);
    toast.success(post.isSaved ? "Removed from saved" : "Post saved!", {
      duration: 2000,
    });
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `Check out ${post.userName}'s plant!`,
          text: post.caption,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard!");
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const handleCommentClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering parent click handlers
    dispatch(openPostDetailModal(post.id));
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-card dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
    >
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Link
            to={`/user/${post.userId}`}
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
            onClick={(e) => e.stopPropagation()}
          >
            {post.userAvatar ? (
              <img
                src={post.userAvatar}
                alt={post.userName}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center">
                <span className="text-3xl font-bold text-primary">
                  {post.userName.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div>
              <h3 className="font-medium text-text dark:text-white">
                {post.userName}
              </h3>
              {post.location && (
                <div className="flex items-center text-xs text-text-muted">
                  <MapPin size={12} className="mr-1" />
                  <span>{post.location.name || "Unknown location"}</span>
                </div>
              )}
            </div>
          </Link>
        </div>

        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="p-2 hover:bg-secondary dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <MoreVertical size={20} className="text-text-muted" />
          </button>

          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-card dark:bg-gray-800 rounded-lg shadow-lg border border-border dark:border-gray-700 z-10">
              <button
                className="w-full text-left px-4 py-2 hover:bg-secondary dark:hover:bg-gray-700 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  toast.error("Report functionality not implemented yet");
                  setShowMenu(false);
                }}
              >
                Report
              </button>
              <button
                className="w-full text-left px-4 py-2 hover:bg-secondary dark:hover:bg-gray-700 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  navigator.clipboard.writeText(window.location.href);
                  toast.success("Link copied to clipboard!");
                  setShowMenu(false);
                }}
              >
                Copy link
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Image */}
      <div className="relative aspect-square bg-secondary dark:bg-gray-700">
        {imageLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        <img
          src={post.imageUrl}
          alt={post.caption}
          className={`w-full h-full object-cover ${
            imageLoading ? "opacity-0" : "opacity-100"
          } transition-opacity`}
          onLoad={() => setImageLoading(false)}
        />
      </div>

      {/* Actions */}
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                handleLike();
              }}
              className="flex items-center space-x-1 transition-colors"
            >
              <motion.div
                animate={post.isLiked ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                <Heart
                  size={24}
                  className={`${
                    post.isLiked
                      ? "fill-error text-error"
                      : "text-text-muted hover:text-error"
                  } transition-colors`}
                />
              </motion.div>
              <span
                className={`text-sm ${
                  post.isLiked ? "text-error" : "text-text-muted"
                }`}
              >
                {post.likes}
              </span>
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleCommentClick}
              className="flex items-center space-x-1 text-text-muted hover:text-text dark:hover:text-white transition-colors"
            >
              <MessageCircle size={24} />
              <span className="text-sm">{post.commentsCount || 0}</span>
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                handleShare();
              }}
              className="text-text-muted hover:text-text dark:hover:text-white transition-colors"
            >
              <Share2 size={24} />
            </motion.button>
          </div>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              handleSave();
            }}
            className="transition-colors"
          >
            <Bookmark
              size={24}
              className={`${
                post.isSaved
                  ? "fill-primary text-primary"
                  : "text-text-muted hover:text-primary"
              } transition-colors`}
            />
          </motion.button>
        </div>

        {/* Caption */}
        <div>
          <p className="text-text dark:text-white">
            <Link
              to={`/user/${post.userId}`}
              className="font-medium mr-2 hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              {post.userName}
            </Link>
            {post.caption}
          </p>
        </div>

        {/* Plant Type Badge */}
        {post.plantType && (
          <div className="inline-flex items-center px-3 py-1 bg-primary-light text-primary rounded-full text-sm">
            <span className="font-medium capitalize">{post.plantType}</span>
          </div>
        )}

        {/* Timestamp */}
        <p className="text-xs text-text-muted uppercase">
          {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
        </p>
      </div>
    </motion.article>
  );
};

export default PostCard;
