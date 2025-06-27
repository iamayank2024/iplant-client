import { useState } from "react";
import { motion } from "framer-motion";
import {
  Filter,
  Calendar,
  TreePine,
  Flower2,
  Palmtree,
  Sprout,
  Leaf,
  Trees,
} from "lucide-react";

interface FilterOption {
  label: string;
  value: string;
  icon?: React.ReactNode;
}

const timeFilters: FilterOption[] = [
  { label: "Today", value: "today" },
  { label: "This Week", value: "week" },
  { label: "This Month", value: "month" },
  { label: "All Time", value: "all" },
];

const plantTypes: FilterOption[] = [
  { label: "All Plants", value: "all", icon: <Trees size={16} /> },
  { label: "Trees", value: "tree", icon: <TreePine size={16} /> },
  { label: "Flowers", value: "flower", icon: <Flower2 size={16} /> },
  { label: "Palms", value: "palm", icon: <Palmtree size={16} /> },
  { label: "Herbs", value: "herb", icon: <Sprout size={16} /> },
  { label: "Other", value: "other", icon: <Leaf size={16} /> },
];

const Sidebar: React.FC = () => {
  const [selectedTime, setSelectedTime] = useState("all");
  const [selectedPlantType, setSelectedPlantType] = useState("all");

  return (
    <motion.aside
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="w-64 h-[calc(100vh-4rem)] bg-card dark:bg-gray-800 border-r border-border dark:border-gray-700 overflow-y-auto pb-3"
    >
      <div className="p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Filter className="text-primary" size={20} />
          <h2 className="text-lg font-heading font-semibold text-text dark:text-white">
            Filters
          </h2>
        </div>

        {/* Time Filter */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <Calendar size={16} className="text-text-muted" />
            <h3 className="font-medium text-text dark:text-white">
              Time Period
            </h3>
          </div>
          <div className="space-y-2">
            {timeFilters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setSelectedTime(filter.value)}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                  selectedTime === filter.value
                    ? "bg-primary text-white"
                    : "hover:bg-secondary dark:hover:bg-gray-700 text-text-muted dark:text-gray-300"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Plant Type Filter */}
        <div className="mb-8">
          <h3 className="font-medium text-text dark:text-white mb-4">
            Plant Type
          </h3>
          <div className="space-y-2">
            {plantTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => setSelectedPlantType(type.value)}
                className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
                  selectedPlantType === type.value
                    ? "bg-primary text-white"
                    : "hover:bg-secondary dark:hover:bg-gray-700 text-text-muted dark:text-gray-300"
                }`}
              >
                {type.icon}
                <span>{type.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Stats Summary */}
        <div className="bg-secondary dark:bg-gray-700 rounded-lg p-4">
          <h3 className="font-medium text-text dark:text-white mb-3">
            Community Impact
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-text-muted dark:text-gray-300">
                Trees Planted
              </span>
              <span className="text-sm font-semibold text-primary">12,456</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-text-muted dark:text-gray-300">
                CO₂ Saved
              </span>
              <span className="text-sm font-semibold text-primary">
                456 tons
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-text-muted dark:text-gray-300">
                Active Planters
              </span>
              <span className="text-sm font-semibold text-primary">3,789</span>
            </div>
          </div>
        </div>

        {/* Apply Filters Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full mt-6 px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium"
        >
          Apply Filters
        </motion.button>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
