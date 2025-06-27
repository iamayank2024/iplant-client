import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  TreePine,
  Heart,
  Bookmark,
  Award,
  Calendar,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

import { type RootState } from "../store";
import PostCard from "../components/PostCard";
import { useUserPosts } from "../hooks/usePosts";
import { useUserProfile } from "../hooks/useUser";
import type { Post } from "../services/postsService";

const PublicProfile: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const { user: currentUser } = useSelector((state: RootState) => state.auth);
  const [activeTab, setActiveTab] = useState<"posts" | "saved">("posts");

  // Fetch user profile data
  const {
    data: profileUser,
    isLoading: isLoadingProfile,
    error: profileError,
  } = useUserProfile(userId || "");

  // Fetch user posts
  const { data: userPosts = [], isLoading: isLoadingUserPosts } = useUserPosts(
    userId || ""
  );

  // Check if viewing own profile
  const isOwnProfile = currentUser?.id === userId;

  const badges = [
    {
      id: "tree-hugger",
      name: "Tree Hugger",
      icon: TreePine,
      earned: true,
    },
    {
      id: "green-thumb",
      name: "Green Thumb",
      icon: Award,
      earned: userPosts.length >= 10,
    },
    {
      id: "eco-warrior",
      name: "Eco Warrior",
      icon: Heart,
      earned: userPosts.length >= 50,
    },
    {
      id: "community-hero",
      name: "Community Hero",
      icon: Award,
      earned: userPosts.length >= 100,
    },
  ];

  if (isLoadingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-text-muted">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (profileError || !profileUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <TreePine className="w-16 h-16 text-text-muted mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-text dark:text-white mb-2">
            User Not Found
          </h2>
          <p className="text-text-muted mb-4">
            The user you're looking for doesn't exist or has been removed.
          </p>
          <Link
            to="/feed"
            className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Feed
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Back Button */}
      <div className="mb-6">
        <Link
          to="/feed"
          className="inline-flex items-center text-text-muted hover:text-text dark:hover:text-white transition-colors"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to Feed
        </Link>
      </div>

      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
          {/* Avatar */}
          <div className="relative">
            {profileUser.avatarUrl ? (
              <img
                src={profileUser.avatarUrl}
                alt={profileUser.name}
                className="w-24 h-24 rounded-full object-cover border-4 border-primary-light"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-primary-light flex items-center justify-center border-4 border-primary-light">
                <span className="text-4xl font-bold text-primary">
                  {profileUser.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>

          {/* Profile Info */}
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-heading font-bold text-text dark:text-white mb-2">
                  {profileUser.name}
                </h1>
                {profileUser.bio && (
                  <p className="text-text-muted dark:text-gray-300 mb-3 max-w-md">
                    {profileUser.bio}
                  </p>
                )}
                <div className="flex items-center space-x-4 text-sm text-text-muted">
                  <div className="flex items-center">
                    <Calendar size={16} className="mr-1" />
                    <span>
                      Joined{" "}
                      {formatDistanceToNow(new Date(profileUser.createdAt), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                  {/* {profileUser.location && (
                    <div className="flex items-center">
                      <MapPin size={16} className="mr-1" />
                      <span>{profileUser.location}</span>
                    </div>
                  )} */}
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center space-x-6 mt-4 md:mt-0">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">
                    {userPosts.length}
                  </p>
                  <p className="text-sm text-text-muted">Plants</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">
                    {profileUser?.followersCount || 0}
                  </p>
                  <p className="text-sm text-text-muted">Followers</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">
                    {profileUser?.followingCount || 0}
                  </p>
                  <p className="text-sm text-text-muted">Following</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Achievement Badges */}
        <div className="mt-6 pt-6 border-t border-border dark:border-gray-700">
          <h3 className="text-lg font-semibold text-text dark:text-white mb-3">
            Achievements
          </h3>
          <div className="flex flex-wrap gap-3">
            {badges.map((badge) => {
              const IconComponent = badge.icon;
              return (
                <div
                  key={badge.id}
                  className={`flex items-center px-3 py-2 rounded-full text-sm ${
                    badge.earned
                      ? "bg-primary-light text-primary"
                      : "bg-gray-100 dark:bg-gray-700 text-text-muted"
                  }`}
                >
                  <IconComponent size={16} className="mr-2" />
                  <span>{badge.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex border-b border-border dark:border-gray-700 mb-6">
        <button
          onClick={() => setActiveTab("posts")}
          className={`px-6 py-3 font-medium transition-colors ${
            activeTab === "posts"
              ? "text-primary border-b-2 border-primary"
              : "text-text-muted hover:text-text dark:hover:text-white"
          }`}
        >
          Posts ({userPosts.length})
        </button>
        {isOwnProfile && (
          <button
            onClick={() => setActiveTab("saved")}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === "saved"
                ? "text-primary border-b-2 border-primary"
                : "text-text-muted hover:text-text dark:hover:text-white"
            }`}
          >
            Saved
          </button>
        )}
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {activeTab === "posts" ? (
          isLoadingUserPosts ? (
            <div className="col-span-2 flex justify-center py-10">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : userPosts.length > 0 ? (
            userPosts.map((post: Post) => (
              <PostCard key={post._id} post={post} />
            ))
          ) : (
            <div className="col-span-2 text-center py-10 text-text-muted">
              <TreePine className="w-16 h-16 mx-auto mb-4 text-text-muted" />
              <h3 className="text-lg font-medium text-text dark:text-white mb-2">
                No posts yet
              </h3>
              <p className="text-text-muted">
                {isOwnProfile
                  ? "Start sharing your plants to see them here!"
                  : "This user hasn't shared any plants yet."}
              </p>
            </div>
          )
        ) : (
          <div className="col-span-2 text-center py-10 text-text-muted">
            <Bookmark className="w-16 h-16 mx-auto mb-4 text-text-muted" />
            <h3 className="text-lg font-medium text-text dark:text-white mb-2">
              No saved posts
            </h3>
            <p className="text-text-muted">Posts you save will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicProfile;
