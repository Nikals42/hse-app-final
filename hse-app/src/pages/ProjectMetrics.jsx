import { useParams } from "react-router-dom";
import { projects } from "../mock/projects";
import { externalMetricsByProject } from "../mock/externalMetrics";
import { externalMetricDefinitions } from "../constants/externalMetricsDefinitions";
import Navbar from "../components/Navbar";
import MetricForm from "../components/MetricForm";
import { useState } from "react";


export default function ProjectMetrics() {
  const { id } = useParams();
  const readOnlyMetrics = externalMetricsByProject[Number(id)];
  const project = projects.find((p) => p.id === Number(id));
  const [submitted, setSubmitted] = useState(null);

  const handleSubmit = async (data) => {
  setSubmitted(data);
    // const request = await fetch('https://hse-app-backend.vercel.app/report', {
    const request = await fetch('http://localhost:3000/report', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ProjectID: id, ...data})
    });
};

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 dark:text-white">
      <Navbar />

      <div className="max-w-xl mx-auto mt-12 bg-white dark:bg-gray-800 p-8 rounded-xl shadow">
        <h2 className="text-2xl font-semibold text-center">
          {project?.name} — Metrics
        </h2>

        <MetricForm onSubmit={handleSubmit} />
        {/* Read-only external metrics, for now is mock */}
          <div className="mt-10 pt-6 border-t border-gray-300 dark:border-gray-600">
            <h3 className="text-lg font-semibold mb-4">
              Lagging Indicators (Read-Only)
            </h3>

            {readOnlyMetrics ? (
              <div className="grid grid-cols-2 gap-4">
                {externalMetricDefinitions.map(({ key, label }) => (
                  <div
                    key={key}
                    className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700"
                  >
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {label}
                    </p>
                    <p className="text-xl font-semibold">
                      {readOnlyMetrics[key] ?? 0}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                No system metrics available for this project.
              </p>
            )}
          </div>

        {submitted && (
          <div className="mt-6 p-4 border rounded-lg bg-gray-50 dark:bg-gray-700">
            <h3 className="font-semibold mb-2">Submitted:</h3>
            <pre className="text-sm">{JSON.stringify(submitted, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
