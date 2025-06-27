import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import type { ReactNode } from "react";

import { selectIsSidebarOpen } from "../store/selectors";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

interface LayoutProps {
  children?: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const isSidebarOpen = useSelector(selectIsSidebarOpen);

  return (
    <div className="min-h-screen bg-background dark:bg-gray-900">
      <Navbar />

      <div className="flex pt-16">
        {/* Sidebar - Desktop */}
        <div className="hidden lg:block">{/* <Sidebar /> */}</div>

        {/* Sidebar - Mobile */}
        {isSidebarOpen && (
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed left-0 top-16 z-40 lg:hidden"
          >
            <Sidebar />
          </motion.div>
        )}

        {/* Main Content */}
        <main className="flex-1 px-4 py-6 lg:px-8">
          <div className="max-w-7xl mx-auto">{children || <Outlet />}</div>
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => {
            // Close sidebar when clicking overlay
            // We'll dispatch action in Navbar component
          }}
        />
      )}
    </div>
  );
};

export default Layout;
