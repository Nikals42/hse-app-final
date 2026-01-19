import { useState } from "react";
import { editableMetricDefinitions } from "../constants/editableMetricsDefinitions";

export default function MetricForm({ onSubmit }) {
  const [metrics, setMetrics] = useState(
    Object.fromEntries(editableMetricDefinitions.map((m) => [m.key, ""]))
  );

  // NEW: timestamp state
  const [timestamp, setTimestamp] = useState("");

  const handleChange = (e) => {
    setMetrics({ ...metrics, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...metrics, timestamp });
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">

      {/* Timestamp input */}
      <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700
                 bg-white dark:bg-gray-900 shadow-sm">
        <label className="text-sm font-semibold text-gray-600 dark:text-gray-300 block mb-2">
          Timestamp (date + time)
        </label>

        <input
          type="datetime-local"
          name="timestamp"
          value={timestamp}
          onChange={(e) => setTimestamp(e.target.value)}
          className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600
                   bg-gray-50 dark:bg-gray-800
                   focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {editableMetricDefinitions.map(({ key, label }) => (
          <div
            key={key}
            className="p-4 rounded-xl border border-gray-200 dark:border-gray-700
                       bg-white dark:bg-gray-900 shadow-sm"
          >
            <label className="text-sm font-semibold text-gray-600 dark:text-gray-300 block mb-2">
              {label}
            </label>

            <input
              type="number"
              name={key}
              value={metrics[key]}
              onChange={handleChange}
              className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600
                       bg-gray-50 dark:bg-gray-800
                       focus:ring-2 focus:ring-blue-500"
            />
          </div>
        ))}
      </div>

      <button
        type="submit"
        className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
      >
        Submit Metrics
      </button>
    </form>
  );
}
