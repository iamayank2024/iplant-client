import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import {
  Camera,
  Edit2,
  TreePine,
  Bookmark,
  Award,
  Check,
  X,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";

import { type RootState } from "../store";
import PostCard from "../components/PostCard.tsx";
import { useMe, useUpdateMe, useUserProfile } from "../hooks/useUser";
import { useUserPosts, useSavedPosts } from "../hooks/usePosts";

interface ProfileFormData {
  name: string;
  bio: string;
}

const badges = [
  {
    id: "tree-hugger",
    name: "Tree Hugger",
    icon: "🌳",
    description: "Planted 10+ trees",
  },
  {
    id: "green-thumb",
    name: "Green Thumb",
    icon: "🌿",
    description: "Shared 20+ plants",
  },
  {
    id: "eco-warrior",
    name: "Eco Warrior",
    icon: "🌍",
    description: "Saved 100kg+ CO₂",
  },
  {
    id: "community-hero",
    name: "Community Hero",
    icon: "🦸",
    description: "Top 10 planter",
  },
];

const Profile: React.FC = () => {
  const { userId } = useParams();
  const { user: authUser } = useSelector((state: RootState) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<"posts" | "saved">("posts");

  // Fetch current user data with the /me endpoint if viewing own profile
  const isOwnProfile = !userId || userId === authUser?.id;
  const { data: currentUser, isLoading: isLoadingMe } = useMe();

  // Fetch profile data if viewing another user's profile
  const { data: otherUserProfile, isLoading: isLoadingProfile } =
    useUserProfile(isOwnProfile ? undefined : userId);

  // Use the updateMe mutation for profile updates
  const updateMeMutation = useUpdateMe();

  // Determine which user data to display
  const profileUser = isOwnProfile ? currentUser : otherUserProfile;
  const isLoading = isOwnProfile ? isLoadingMe : isLoadingProfile;

  // Fetch user posts using React Query
  const { data: userPosts = [], isLoading: isLoadingUserPosts } = useUserPosts(
    profileUser?.id || userId || ""
  );

  // Fetch saved posts if viewing own profile
  const { data: savedPosts = [], isLoading: isLoadingSavedPosts } =
    useSavedPosts(profileUser?.id || userId || "");

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm<ProfileFormData>({
    defaultValues: {
      name: profileUser?.name || "",
      bio: profileUser?.bio || "",
    },
  });

  // Update form defaults when profile data loads
  useEffect(() => {
    if (profileUser) {
      reset({
        name: profileUser.name || "",
        bio: profileUser.bio || "",
      });
    }
  }, [profileUser, reset]);

  const onSubmit = async (data: ProfileFormData) => {
    try {
      updateMeMutation.mutate(data);
      setIsEditing(false);
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    reset();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-text-muted">Loading profile...</p>
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-text-muted">User not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6"
      >
        <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
          {/* Avatar */}
          <div className="relative">
            {profileUser.avatar ? (
              <img
                src={profileUser.avatar}
                alt={profileUser.name}
                className="w-24 h-24 rounded-full object-cover"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-primary-light flex items-center justify-center">
                <span className="text-3xl font-bold text-primary">
                  {profileUser.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            {isOwnProfile && (
              <button className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full hover:bg-primary-dark transition-colors">
                <Camera size={16} />
              </button>
            )}
          </div>

          {/* User Info */}
          <div className="flex-1 text-center sm:text-left">
            {isEditing ? (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <input
                  {...register("name", { required: "Name is required" })}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-border dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Your name"
                />
                <textarea
                  {...register("bio", { maxLength: 160 })}
                  rows={3}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-border dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  placeholder="Tell us about yourself..."
                />
                <div className="flex space-x-2">
                  <button
                    type="submit"
                    disabled={isSubmitting || updateMeMutation.isPending}
                    className="flex items-center px-3 py-1 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                  >
                    {updateMeMutation.isPending ? (
                      <span>Saving...</span>
                    ) : (
                      <>
                        <Check size={16} className="mr-1" />
                        Save
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex items-center px-3 py-1 bg-gray-200 dark:bg-gray-700 text-text dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  >
                    <X size={16} className="mr-1" />
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <>
                <div className="flex items-center space-x-3 mb-2">
                  <h1 className="text-2xl font-heading font-bold text-text dark:text-white">
                    {profileUser.name}
                  </h1>
                  {isOwnProfile && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                    >
                      <Edit2 size={16} className="text-text-muted" />
                    </button>
                  )}
                </div>
                <p className="text-text-muted dark:text-gray-300 mb-4">
                  {profileUser.bio || "No bio yet"}
                </p>
              </>
            )}

            {/* Stats */}
            <div className="flex flex-wrap gap-6 mt-4">
              <div className="text-center sm:text-left">
                <p className="text-2xl font-bold text-text dark:text-white">
                  {profileUser.plantsCount}
                </p>
                <p className="text-sm text-text-muted">Plants</p>
              </div>
              <div className="text-center sm:text-left">
                <p className="text-2xl font-bold text-text dark:text-white">
                  {profileUser.likesCount}
                </p>
                <p className="text-sm text-text-muted">Likes</p>
              </div>
              <div className="text-center sm:text-left">
                <p className="text-2xl font-bold text-text dark:text-white">
                  {profileUser.savedCount}
                </p>
                <p className="text-sm text-text-muted">Saved</p>
              </div>
            </div>
          </div>
        </div>

        {/* Badges */}
        {profileUser.badges && profileUser.badges.length > 0 && (
          <div className="mt-6 pt-6 border-t border-border dark:border-gray-700">
            <h3 className="font-heading font-semibold text-text dark:text-white mb-3 flex items-center">
              <Award className="mr-2 text-primary" size={20} />
              Achievements
            </h3>
            <div className="flex flex-wrap gap-3">
              {badges
                .filter((badge) => profileUser.badges?.includes(badge.id))
                .map((badge) => (
                  <motion.div
                    key={badge.id}
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center space-x-2 px-3 py-2 bg-primary-light rounded-lg"
                  >
                    <span className="text-2xl">{badge.icon}</span>
                    <div>
                      <p className="text-sm font-medium text-primary-dark">
                        {badge.name}
                      </p>
                      <p className="text-xs text-text-muted">
                        {badge.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
            </div>
          </div>
        )}
      </motion.div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6 bg-white dark:bg-gray-800 rounded-lg p-1">
        <button
          onClick={() => setActiveTab("posts")}
          className={`flex-1 py-2 rounded-md flex items-center justify-center transition-colors ${
            activeTab === "posts"
              ? "bg-primary text-white"
              : "text-text-muted hover:bg-gray-100 dark:hover:bg-gray-700"
          }`}
        >
          <TreePine size={18} className="mr-2" />
          Posts
        </button>
        {isOwnProfile && (
          <button
            onClick={() => setActiveTab("saved")}
            className={`flex-1 py-2 rounded-md flex items-center justify-center transition-colors ${
              activeTab === "saved"
                ? "bg-primary text-white"
                : "text-text-muted hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            <Bookmark size={18} className="mr-2" />
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
            userPosts.map((post) => <PostCard key={post.id} post={post} />)
          ) : (
            <div className="col-span-2 text-center py-10 text-text-muted">
              No posts yet
            </div>
          )
        ) : isLoadingSavedPosts ? (
          <div className="col-span-2 flex justify-center py-10">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : savedPosts.length > 0 ? (
          savedPosts.map((post) => <PostCard key={post.id} post={post} />)
        ) : (
          <div className="col-span-2 text-center py-10 text-text-muted">
            No saved posts yet
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
