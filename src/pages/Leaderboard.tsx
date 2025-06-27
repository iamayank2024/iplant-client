import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Trophy,
  Medal,
  Award,
  TreePine,
  TrendingUp,
  Users,
  Loader2,
} from "lucide-react";

import { useLeaderboard, useLeaderboardStats } from "../hooks/usePosts";
import type { LeaderboardFilters } from "../services/postsService";

const Leaderboard: React.FC = () => {
  const [filters, setFilters] = useState<LeaderboardFilters>({
    timeRange: "month",
    category: "plants",
  });

  const { data: users = { leaderboard: [] }, isLoading: isLoadingUsers } =
    useLeaderboard(filters);
  const { data: stats, isLoading: isLoadingStats } =
    useLeaderboardStats(filters);

  const handleTimeRangeChange = (timeRange: "week" | "month" | "all") => {
    setFilters((prev) => ({ ...prev, timeRange }));
  };

  const handleCategoryChange = (category: "plants" | "co2" | "engagement") => {
    setFilters((prev) => ({ ...prev, category }));
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="text-yellow-500" size={24} />;
      case 2:
        return <Medal className="text-gray-400" size={24} />;
      case 3:
        return <Medal className="text-orange-600" size={24} />;
      default:
        return (
          <span className="text-lg font-bold text-text-muted">#{rank}</span>
        );
    }
  };

  const getRankBackground = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 border-yellow-200 dark:border-yellow-700";
      case 2:
        return "bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-700/50 border-gray-200 dark:border-gray-600";
      case 3:
        return "bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-700";
      default:
        return "bg-white dark:bg-gray-800 border-border dark:border-gray-700";
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl font-heading font-bold text-text dark:text-white mb-2">
          Global Leaderboard
        </h1>
        <p className="text-text-muted">
          Recognizing our top environmental heroes
        </p>
      </motion.div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
        {/* Time Range Selector */}
        <div className="inline-flex bg-white dark:bg-gray-800 rounded-lg p-1 shadow-md">
          {(["week", "month", "all"] as const).map((range) => (
            <button
              key={range}
              onClick={() => handleTimeRangeChange(range)}
              className={`px-4 py-2 rounded-md transition-all ${
                filters.timeRange === range
                  ? "bg-primary text-white"
                  : "text-text-muted hover:text-text dark:hover:text-white"
              }`}
            >
              <span className="capitalize">
                {range === "all" ? "All Time" : `This ${range}`}
              </span>
            </button>
          ))}
        </div>

        {/* Category Selector */}
        <div className="inline-flex bg-white dark:bg-gray-800 rounded-lg p-1 shadow-md">
          {(["plants", "co2", "engagement"] as const).map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`px-4 py-2 rounded-md transition-all ${
                filters.category === category
                  ? "bg-primary text-white"
                  : "text-text-muted hover:text-text dark:hover:text-white"
              }`}
            >
              <span className="capitalize">
                {category === "co2" ? "CO₂ Impact" : category}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md text-center"
        >
          <Users className="mx-auto mb-3 text-primary" size={32} />
          {isLoadingStats ? (
            <Loader2
              className="mx-auto mb-3 text-primary animate-spin"
              size={32}
            />
          ) : (
            <p className="text-2xl font-bold text-text dark:text-white">
              {formatNumber(stats?.platformStats?.totalUsers || 0)}
            </p>
          )}
          <p className="text-sm text-text-muted">Active Planters</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md text-center"
        >
          <TreePine className="mx-auto mb-3 text-primary" size={32} />
          {isLoadingStats ? (
            <Loader2
              className="mx-auto mb-3 text-primary animate-spin"
              size={32}
            />
          ) : (
            <p className="text-2xl font-bold text-text dark:text-white">
              {formatNumber(stats?.platformStats?.totalPlants || 0)}
            </p>
          )}
          <p className="text-sm text-text-muted">Total Plants</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md text-center"
        >
          <Award className="mx-auto mb-3 text-primary" size={32} />
          {isLoadingStats ? (
            <Loader2
              className="mx-auto mb-3 text-primary animate-spin"
              size={32}
            />
          ) : (
            <p className="text-2xl font-bold text-text dark:text-white">
              {(stats?.platformStats?.environmentalImpact || 0).toFixed(1)}
            </p>
          )}
          <p className="text-sm text-text-muted">Tons CO₂ Saved</p>
        </motion.div>
      </div>

      {/* Leaderboard List */}
      {isLoadingUsers ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : users.leaderboard.length > 0 ? (
        <div className="space-y-3">
          {users.leaderboard.map((user, index) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02 }}
              className={`p-4 rounded-lg border transition-all ${getRankBackground(
                user.rank
              )}`}
            >
              <div className="flex items-center">
                {/* Rank */}
                <div className="w-12 flex justify-center">
                  {getRankIcon(user.rank)}
                </div>

                {/* User Info */}
                <Link
                  to={`/user/${user._id}`}
                  className="flex items-center flex-1 ml-4 hover:opacity-80 transition-opacity"
                >
                  {user.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-primary-light flex items-center justify-center">
                      <span className="text-primary font-semibold">
                        {user.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div className="ml-4">
                    <h3 className="font-medium text-text dark:text-white">
                      {user.name}
                    </h3>
                    <p className="text-sm text-text-muted">
                      {user.numberOfPlants} plants •{" "}
                      {(user.numberOfPlants * 20).toFixed(1)} tons CO₂
                    </p>
                  </div>
                </Link>

                {/* Trend Indicator */}
                <div className="flex items-center ml-auto">
                  {user.trend === "up" && (
                    <div className="flex items-center text-green-600 dark:text-green-400">
                      <TrendingUp size={16} />
                      <span className="ml-1 text-sm font-medium">
                        +{user.change}
                      </span>
                    </div>
                  )}
                  {user.trend === "down" && (
                    <div className="flex items-center text-red-600 dark:text-red-400">
                      <TrendingUp size={16} className="rotate-180" />
                      <span className="ml-1 text-sm font-medium">
                        -{user.change}
                      </span>
                    </div>
                  )}
                  {user.trend === "same" && (
                    <span className="text-text-muted text-sm">—</span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <TreePine className="mx-auto mb-4 text-text-muted" size={48} />
          <h3 className="text-lg font-medium text-text dark:text-white mb-2">
            No leaderboard data available
          </h3>
          <p className="text-text-muted">
            Start planting to see yourself on the leaderboard!
          </p>
        </div>
      )}

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-12 text-center bg-primary-light dark:bg-primary/20 rounded-lg p-8"
      >
        <TreePine className="mx-auto mb-4 text-primary" size={48} />
        <h2 className="text-2xl font-heading font-bold text-primary-dark dark:text-primary mb-2">
          Join the Movement!
        </h2>
        <p className="text-text-muted dark:text-gray-300 mb-4">
          Start planting today and climb the ranks while saving our planet
        </p>
        <Link
          to="/feed"
          className="inline-block px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium"
        >
          Start Planting
        </Link>
      </motion.div>
    </div>
  );
};

export default Leaderboard;
