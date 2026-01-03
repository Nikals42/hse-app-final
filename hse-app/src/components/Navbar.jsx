import { useState, useEffect } from "react";

export default function Navbar() {
  const [username, setUsername] = useState("Guest");

  useEffect(() => {
    const savedUsername = localStorage.getItem("username");
    if (savedUsername) setUsername(savedUsername);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("username"); // clear stored username
    window.location.href = "/";          // redirect to login page
  };

  return (
    <nav className="w-full px-6 py-4 bg-gray-200 dark:bg-gray-900 shadow-sm flex justify-between items-center">
      <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
        HSE Metrics
      </h1>

      <div className="flex items-center gap-4">
        {/* Show username */}
        <span className="text-gray-700 dark:text-gray-300">
          Logged in as: <strong>{username}</strong>
        </span>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
