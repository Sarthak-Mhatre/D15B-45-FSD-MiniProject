import React, { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/api";

const Navbar: React.FC = () => {
  const { auth, setAuth, logout } = useAuth();

  // Optionally: Always ensure latest user info from backend
  useEffect(() => {
    // Only fetch if accessToken exists and no user info yet
    if (auth.accessToken && !auth.user) {
      api.get("/profile")
        .then(({ data }) => {
          setAuth((prev: any) => ({ ...prev, user: data.user }));
        })
        .catch(() => {
          // Optionally handle error or force logout
          logout();
        });
    }
  }, [auth.accessToken, auth.user, setAuth, logout]);

  if (!auth.user) return null; // Hide navbar if not logged in

  return (
    <nav className="w-full flex items-center justify-between px-6 py-4 bg-white shadow-lg border-b border-gray-200">
      <div className="flex items-center space-x-4">
        <img
          src={auth.user.avatarUrl || "/default-avatar.png"}
          alt="Profile"
          className="w-9 h-9 rounded-full object-cover border border-gray-300 shadow"
        />
        <span className="text-lg font-medium text-gray-800">
          {auth.user.name}
        </span>
      </div>
      <button
        onClick={logout}
        className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition font-semibold shadow"
      >
        Logout
      </button>
    </nav>
  );
};

export default Navbar;
