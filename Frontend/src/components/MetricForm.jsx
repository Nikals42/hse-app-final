import { useState, useEffect } from "react";
import { editableMetricDefinitions } from "../constants/editableMetricsDefinitions";

export default function MetricForm({ onSubmit }) {
  const [metrics, setMetrics] = useState(
    Object.fromEntries(editableMetricDefinitions.map((m) => [m.key, ""]))
  );

  // NEW: timestamp state
  const [timestamp, setTimestamp] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Set default date to today when component loads
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setTimestamp(today);
  }, []);

  const handleChange = (e) => {
    setMetrics({ ...metrics, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    
    // Validate that date is selected
    if (!timestamp) {
      setErrorMessage("Please select a date before submitting.");
      return;
    }
    
    // Validate that at least one metric has a value
    const hasAtLeastOneMetric = Object.values(metrics).some(value => value !== "" && value !== "0");
    if (!hasAtLeastOneMetric) {
      setErrorMessage("Please enter at least one metric value before submitting.");
      return;
    }
    
    setIsSubmitting(true);
    try {
      await onSubmit({ ...metrics, timestamp });
      // Reset form on successful submission
      setMetrics(
        Object.fromEntries(editableMetricDefinitions.map((m) => [m.key, ""]))
      );
      const today = new Date().toISOString().split('T')[0];
      setTimestamp(today);
      
      // Show success message
      setSuccessMessage("Metrics submitted successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Submission failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get today's date for max attribute
  const today = new Date().toISOString().split('T')[0];

  return (
    <>
      {successMessage && (
        <div className="p-4 rounded-lg bg-green-100 dark:bg-green-900 border border-green-300 dark:border-green-700">
          <p className="text-green-800 dark:text-green-200 font-semibold">
            ✓ {successMessage}
          </p>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-lg bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-700">
          <p className="text-red-800 dark:text-red-200 font-semibold">
            ✕ {errorMessage}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">

        {/* Timestamp input */}
        <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700
                   bg-white dark:bg-gray-900 shadow-sm">
          <label className="text-sm font-semibold text-gray-600 dark:text-gray-300 block mb-2">
            Date
          </label>

          <input
            type="date"
            name="timestamp"
            value={timestamp}
            onChange={(e) => setTimestamp(e.target.value)}
            max={today}
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
                disabled={isSubmitting}
                min="0"
                className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600
                         bg-gray-50 dark:bg-gray-800
                         focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              />
            </div>
          ))}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Submitting..." : "Submit Metrics"}
        </button>
      </form>
    </>
  );
}
