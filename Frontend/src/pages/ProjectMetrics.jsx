import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import MetricForm from "../components/MetricForm";

export default function ProjectMetrics() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [submitted, setSubmitted] = useState(null);
  const [loading, setLoading] = useState(true);

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
    await fetch("http://localhost:3000/report", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ProjectID: id, ...data}),
    });
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

      <div className="max-w-xl mx-auto mt-12 bg-white dark:bg-gray-800 p-8 rounded-xl shadow">
        <h2 className="text-2xl font-semibold text-center">
          {project.name} — Metrics
        </h2>

        {/* Leading indicators form */}
        <MetricForm onSubmit={handleSubmit} />

        {/* Lagging indicators – fully dynamic */}
        <div className="mt-10 pt-6 border-t border-gray-300 dark:border-gray-600">
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
      </div>
    </div>
  );
}
