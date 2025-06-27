import { Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import {
  TreePine,
  Home,
  Map,
  Trophy,
  User,
  Plus,
  Menu,
  X,
  LogOut,
  Moon,
  Sun,
} from "lucide-react";

import { type RootState, type AppDispatch } from "../store";
import {
  toggleSidebar,
  openAddPostModal,
  toggleDarkMode,
} from "../store/uiSlice";
import { useLogout } from "../hooks/useAuth";

const Navbar: React.FC = () => {
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const logout = useLogout();

  const { user } = useSelector((state: RootState) => state.auth);

  const { isSidebarOpen, isDarkMode } = useSelector(
    (state: RootState) => state.ui
  );

  const navLinks = [
    { path: "/feed", icon: Home, label: "Feed" },
    { path: "/map", icon: Map, label: "Community" },
    { path: "/leaderboard", icon: Trophy, label: "Leaderboard" },
    { path: "/profile", icon: User, label: "Profile" },
  ];

  const handleLogout = () => {
    logout.mutate();
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card dark:bg-gray-800 border-b border-border dark:border-gray-700 shadow-sm">
      <div className="px-4 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <button
              onClick={() => dispatch(toggleSidebar())}
              className="lg:hidden p-2 rounded-md text-text-muted hover:bg-secondary dark:hover:bg-gray-700"
            >
              {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <Link to="/feed" className="flex items-center ml-4 lg:ml-0">
              <TreePine className="h-8 w-8 text-primary" />
              <span className="ml-2 text-xl font-heading font-semibold text-text dark:text-white">
                iPlant
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className="relative px-4 py-2 rounded-lg transition-colors list-none"
                >
                  <div
                    className={`flex items-center space-x-2 ${
                      isActive
                        ? "text-primary"
                        : "text-text-muted hover:text-text dark:hover:text-white"
                    }`}
                  >
                    <Icon size={20} />
                    <span className="font-medium">{link.label}</span>
                  </div>
                  {isActive && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-3">
            {/* Add Post Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => dispatch(openAddPostModal())}
              className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium border-none"
            >
              <Plus size={20} />
              <span className="hidden sm:inline">Plant</span>
            </motion.button>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => dispatch(toggleDarkMode())}
              className="p-2 flex items-center justify-center rounded-lg text-text-muted hover:bg-secondary dark:hover:bg-gray-700 transition-colors border-none"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* User Menu */}
            <div className="relative group">
              <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-secondary dark:hover:bg-gray-700 transition-colors border-none">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center">
                    <span className="text-primary font-semibold">
                      {user?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </button>

              <div className="absolute right-0 mt-2 w-48 bg-card dark:bg-gray-800 rounded-lg shadow-lg border border-border dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <div className="p-2">
                  <Link
                    to="/profile"
                    className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-secondary dark:hover:bg-gray-700 transition-colors"
                  >
                    <User size={16} />
                    <span>Profile</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    disabled={logout.isPending}
                    className="w-full flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-secondary dark:hover:bg-gray-700 transition-colors text-error"
                  >
                    <LogOut size={16} />
                    <span>
                      {logout.isPending ? "Logging out..." : "Logout"}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="lg:hidden border-t border-border dark:border-gray-700">
        <div className="flex justify-around py-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;

            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex flex-col items-center py-2 px-3 rounded-lg ${
                  isActive
                    ? "text-primary"
                    : "text-text-muted hover:text-text dark:hover:text-white"
                }`}
              >
                <Icon size={24} />
                <span className="text-xs mt-1">{link.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
