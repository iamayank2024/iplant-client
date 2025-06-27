import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { AnimatePresence } from "framer-motion";

import {
  selectIsAuthenticated,
  selectIsAddPostModalOpen,
} from "./store/selectors";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";

// Pages
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import Feed from "./pages/Feed";
import CommunityMap from "./pages/CommunityMap";
import Profile from "./pages/Profile";
import PublicProfile from "./pages/PublicProfile";
import Leaderboard from "./pages/Leaderboard";

// Modals
import AddPostModal from "./components/AddPostModal";

function App() {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isAddPostModalOpen = useSelector(selectIsAddPostModalOpen);

  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={
            isAuthenticated ? <Navigate to="/feed" replace /> : <Login />
          }
        />
        <Route
          path="/signup"
          element={
            isAuthenticated ? <Navigate to="/feed" replace /> : <Signup />
          }
        />
        <Route
          path="/forgot-password"
          element={
            isAuthenticated ? (
              <Navigate to="/feed" replace />
            ) : (
              <ForgotPassword />
            )
          }
        />

        {/* Public Profile Route - Accessible without authentication */}
        <Route path="/user/:userId" element={<PublicProfile />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/feed" element={<Feed />} />
            <Route path="/map" element={<CommunityMap />} />
            <Route path="/profile/:userId?" element={<Profile />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
          </Route>
        </Route>

        {/* Default Route */}
        <Route path="/" element={<Navigate to="/feed" replace />} />
      </Routes>

      {/* Modals */}
      <AnimatePresence>
        {isAddPostModalOpen && <AddPostModal />}
      </AnimatePresence>
    </>
  );
}

export default App;
