import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import MetricForm from "../components/MetricForm";

export default function ProjectMetrics() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [submitted, setSubmitted] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("metrics"); // "metrics" or "lagging"
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    fetch("http://localhost:3000/projects/data")
      .then((res) => res.json())
      .then((data) => {
        const found = data.find((p) => p.id === Number(id));
        setProject(found);
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

  const isNonProjectPersonnel = project.name === "NON_PROJECT_PERSONNEL";

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 dark:text-white">
      <Navbar />

      <div className="flex gap-4 mt-12 px-4 max-w-6xl mx-auto">
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
              allowedMetricKeys={isNonProjectPersonnel ? ["workingHours"] : undefined}
            />

            {submitted && (
              <div className="mt-6 p-4 border rounded-lg bg-gray-50 dark:bg-gray-700">
                <h3 className="font-semibold mb-2">Submitted:</h3>
                <pre className="text-sm">
                  {JSON.stringify(submitted, null, 2)}
                </pre>
                <p className="mt-2 text-xs text-gray-400">
                  Timestamp: {new Date(submitted.timestamp).toLocaleString()}
                </p>
              </div>
            )}
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
  );
}
 