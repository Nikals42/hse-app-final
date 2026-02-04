import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import MetricForm from "../components/MetricForm";

export default function ProjectMetrics() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [submitted, setSubmitted] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("metrics"); // "metrics" or "lagging"
  const [menuOpen, setMenuOpen] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

useEffect(() => {
  setLoading(true);

  fetch(`http://localhost:3000/projects/data?projectId=${id}`)
    .then((res) => {
      if (!res.ok) throw new Error("Failed to fetch project data");
      return res.json();
    }) 
    .then((data) => {
      const foundProject = data.find((p) => p.id === Number(id));
      setProject(foundProject ?? null);
      setLoading(false);
    })
    .catch((err) => {
      console.error("Failed to fetch project:", err);
      setLoading(false);
    });
}, [id]);


  const handleSubmit = async (data) => {
    setSubmitted(data);
    try {
      const response = await fetch("http://localhost:3000/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ProjectID: id, ...data}),
      });
      const result = await response.json();
      console.log("Report response:", result);
      if (!response.ok) {
        console.error("Error submitting report:", result);
        throw new Error(result.error);
      }
      // Show success modal
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error submitting report:", error);
      throw error;
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading…</div>;
  }

  if (!project) {
    return <div className="min-h-screen flex items-center justify-center">Project not found</div>;
  }

  // NORMALIZE laggingIndicators
  const laggingIndicatorsRaw = project.laggingIndicators;
  const laggingIndicators =
    Array.isArray(laggingIndicatorsRaw)
      ? laggingIndicatorsRaw[0] ?? {}
      : laggingIndicatorsRaw ?? {};

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 dark:text-white">
      <Navbar />

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl max-w-md mx-4">
            <div className="text-center">
              <div className="text-6xl mb-4">✓</div>
              <h3 className="text-2xl font-bold mb-2 text-green-600 dark:text-green-400">
                Success!
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Your metrics have been submitted successfully.
              </p>
              <button
                onClick={() => navigate("/projects")}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
              >
                Return to Projects
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-12 px-4 max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate("/projects")}
          className="flex items-center gap-2 mb-4 px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-lg shadow hover:bg-gray-50 dark:hover:bg-gray-700 transition font-medium"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Projects
        </button>

        <div className="flex gap-4">
        {/* Hamburger Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex flex-col gap-1.5 justify-center items-center w-10 h-10 rounded-lg bg-white dark:bg-gray-800 shadow hover:bg-gray-50 dark:hover:bg-gray-700 transition md:hidden"
        >
          <span className={`block w-6 h-0.5 bg-gray-800 dark:bg-white transition-transform ${
            menuOpen ? 'rotate-45 translate-y-2' : ''
          }`}></span>
          <span className={`block w-6 h-0.5 bg-gray-800 dark:bg-white transition-opacity ${
            menuOpen ? 'opacity-0' : 'opacity-100'
          }`}></span>
          <span className={`block w-6 h-0.5 bg-gray-800 dark:bg-white transition-transform ${
            menuOpen ? '-rotate-45 -translate-y-2' : ''
          }`}></span>
        </button>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="fixed inset-0 z-40 md:hidden">
            <div className="absolute inset-0 bg-black/50" onClick={() => setMenuOpen(false)}></div>
            <div className="absolute left-0 top-0 h-full w-64 bg-white dark:bg-gray-800 shadow-lg flex flex-col p-4 gap-2 z-50">
              <button
                onClick={() => {
                  setActiveTab('metrics');
                  setMenuOpen(false);
                }}
                className={`px-4 py-3 rounded-lg text-left transition font-medium ${
                  activeTab === 'metrics'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                📝 Input Metrics
              </button>
              <button
                onClick={() => {
                  setActiveTab('lagging');
                  setMenuOpen(false);
                }}
                className={`px-4 py-3 rounded-lg text-left transition font-medium ${
                  activeTab === 'lagging'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                📊 Lagging Indicators
              </button>
            </div>
          </div>
        )}

        {/* Desktop Sidebar */}
        <div className="hidden md:flex flex-col gap-2 w-48">
          <button
            onClick={() => setActiveTab('metrics')}
            className={`px-4 py-3 rounded-lg text-left transition font-medium ${
              activeTab === 'metrics'
                ? 'bg-blue-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            📝 Input Metrics
          </button>
          <button
            onClick={() => setActiveTab('lagging')}
            className={`px-4 py-3 rounded-lg text-left transition font-medium ${
              activeTab === 'lagging'
                ? 'bg-blue-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            📊 Lagging Indicators
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-white dark:bg-gray-800 p-8 rounded-xl shadow">
          <h2 className="text-2xl font-semibold text-center mb-6">
            {project.name} — Metrics
          </h2>

        {/* Metrics Tab */}
        {activeTab === "metrics" && (
          <>
            {/* Leading indicators form */}
            <MetricForm
              onSubmit={handleSubmit}
            />
          </>
        )}

        {/* Lagging Indicators Tab */}
        {activeTab === "lagging" && (
          <div>
            <h3 className="text-lg font-semibold mb-4">
              Lagging Indicators (Read-Only)
            </h3>

            {Object.keys(laggingIndicators).length === 0 ? (
              <p className="text-sm text-gray-500">
                No lagging indicators available.
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(laggingIndicators).map(([key, value]) => (
                  <div
                    key={key}
                    className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700"
                  >
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {key}
                    </p>
                    <p className="text-xl font-semibold">
                      {value ?? 0}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        </div>
        </div>
      </div>
    </div>
  );
}
 