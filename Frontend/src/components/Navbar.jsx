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
    <nav className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-gray-200 dark:bg-gray-900 shadow-sm">
      <div className="flex flex-row justify-between items-center gap-2">
        <h1 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-100">
          HSE Metrics
        </h1>

        <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-base">
          {/* Show username */}
          <span className="text-gray-700 dark:text-gray-300 text-right">
            <span className="hidden sm:inline">Logged in as: </span>
            <strong className="text-xs sm:text-base">{username}</strong>
          </span>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="px-3 sm:px-4 py-2 bg-red-500 hover:bg-red-600 active:bg-red-700 text-white rounded-lg text-xs sm:text-base font-medium min-h-[44px] whitespace-nowrap"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
