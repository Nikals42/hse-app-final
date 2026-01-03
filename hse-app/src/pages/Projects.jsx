import { useState } from "react";
import { projects } from "../mock/projects";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

export default function Projects() {
  const [selected, setSelected] = useState(projects[0].id);
  const navigate = useNavigate();

  const goToProject = () => navigate(`/projects/${selected}`);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 dark:text-white">
      <Navbar />

      <div className="max-w-2xl mx-auto mt-12 bg-white dark:bg-gray-800 p-8 rounded-xl shadow">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Select a Project
        </h2>

        {/* Tabs */}
        <div className="flex border-b dark:border-gray-700 mb-6">
          {projects.map((project) => (
            <button
              key={project.id}
              onClick={() => setSelected(project.id)}
              className={`flex-1 py-2 text-center border-b-2 transition 
                ${
                  selected === project.id
                    ? "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
                    : "border-transparent hover:bg-gray-100 dark:hover:bg-gray-700"
                }
              `}
            >
              {project.name}
            </button>
          ))}
        </div>

        <button
          onClick={goToProject}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Continue to Metrics
        </button>
      </div>
    </div>
  );
}
