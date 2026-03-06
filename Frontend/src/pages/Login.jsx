import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    if (username.trim() !== "") {
      // Save username to localStorage
      localStorage.setItem("username", username);
       //const request = await fetch('https://hse-app-backend.vercel.app/login', {
      const request = await fetch('https://hse-app-backend.vercel.app/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({username: username})
      })
      const data = await request.json()
      console.log(data)
      if (request.ok) {
        navigate("/projects");
      } else {
        alert('Wrong username')
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-xl shadow-md w-full max-w-sm">
        <h2 className="text-xl sm:text-2xl font-semibold text-center mb-4 sm:mb-6 text-gray-800 dark:text-gray-100">
          HSE Coordinator Login
        </h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-base"
            style={{ fontSize: '16px' }}
            autoComplete="username"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 text-base rounded-lg hover:bg-blue-700 transition font-medium active:bg-blue-800"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}