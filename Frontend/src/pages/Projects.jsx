import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:3000/projects")
      .then((res) => res.json())
      .then((data) => {
        setProjects(data);
        if (data.length > 0) {
          setSelected(data[0].id); // default selection
        }
      })
      .catch((err) => {
        console.error("Failed to fetch projects:", err);
      });
  }, []);

  const goToProject = () => {
    if (selected) {
      navigate(`/projects/${selected}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 dark:text-white">
      <Navbar />

      <div className="max-w-2xl mx-auto mt-4 sm:mt-12 px-4 sm:px-0">
        <div className="bg-white dark:bg-gray-800 p-4 sm:p-8 rounded-xl shadow">
          <h2 className="text-xl sm:text-2xl font-semibold text-center mb-4 sm:mb-6">
            Select a Project
          </h2>

        {/* Loading state */}
        {projects.length === 0 ? (
          <p className="text-center text-gray-500">Loading projects...</p>
        ) : (
          <>
            {/* Dropdown */}
            <div className="mb-4 sm:mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select a Project
              </label>
              <select
                value={selected}
                onChange={(e) => setSelected(e.target.value)}
                className="w-full px-4 py-3 sm:py-2 text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
                style={{ fontSize: '16px' }}
              >
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={goToProject}
              className="w-full bg-blue-600 text-white py-3 sm:py-2 text-base rounded-lg hover:bg-blue-700 transition font-medium"
            >
              Continue to Metrics
            </button>
          </>
        )}
      </div>
      </div>
    </div>
  );
}
