import { useState, useEffect } from "react";
import { editableMetricDefinitions } from "../constants/editableMetricsDefinitions";

export default function MetricForm({ onSubmit }) {
  const allowedDefinitions = editableMetricDefinitions;

  const [metrics, setMetrics] = useState(
    Object.fromEntries(editableMetricDefinitions.map((m) => [m.key, ""]))
  );

  const [timestamp, setTimestamp] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // New state for one-by-one input
  const [selectedMetricKey, setSelectedMetricKey] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [trainingDetails, setTrainingDetails] = useState({ people: "", length: "", minutes: "" });

  // Set default date to today when component loads
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setTimestamp(today);
  }, []);

  const handleMetricSelect = (key) => {
    setSelectedMetricKey(key);
    if (key === "trainingHours") {
      setInputValue("");
      setTrainingDetails((prev) => ({
        people: prev.people ?? "",
        length: prev.length ?? "",
        minutes: prev.minutes ?? "",
      }));
    } else {
      setInputValue(metrics[key] || "");
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    if (value.startsWith("-")) {
      setErrorMessage("Negative values are not allowed.");
      return;
    }
    if (errorMessage === "Negative values are not allowed.") {
      setErrorMessage("");
    }
    setInputValue(value);
  };

  const handleTrainingDetailChange = (field) => (e) => {
    const value = e.target.value;
    if (value.startsWith("-")) {
      setErrorMessage("Negative values are not allowed.");
      return;
    }
    if (errorMessage === "Negative values are not allowed.") {
      setErrorMessage("");
    }
    setTrainingDetails((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveMetric = () => {
    if (!selectedMetricKey) return;

    if (selectedMetricKey === "trainingHours") {
      const people = Number(trainingDetails.people);
      const length = Number(trainingDetails.length);
      const minutes = Number(trainingDetails.minutes || 0);
      if (people < 0 || length < 0 || minutes < 0) return;
      if (!people || (!length && !minutes)) return;

      const totalHours = length + minutes / 60;
      const total = people * totalHours;
      setMetrics({ ...metrics, trainingHours: String(total) });
    } else if (inputValue !== "") {
      const numericValue = Number(inputValue);
      if (numericValue < 0) return;
      setMetrics({ ...metrics, [selectedMetricKey]: inputValue });
    } else {
      return;
    }

    // Auto-reset for next metric input
    setSelectedMetricKey("");
    setInputValue("");
  };

  const handleSubmitMetrics = async (e) => {
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
      setSelectedMetricKey("");
      setInputValue("");
      setTrainingDetails({ people: "", length: "", minutes: "" });
      
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

      <form onSubmit={handleSubmitMetrics} className="mt-6 space-y-4">

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

        {/* One-by-one metric input */}
        <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700
                   bg-white dark:bg-gray-900 shadow-sm">
          <label className="text-sm font-semibold text-gray-600 dark:text-gray-300 block mb-2">
            Select Metric to Input
          </label>

          <select
            value={selectedMetricKey}
              onChange={(e) => handleMetricSelect(e.target.value)}
              disabled={isSubmitting}
              className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600
                       bg-gray-50 dark:bg-gray-800
                       focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <option value="">-- Choose a metric --</option>
              {allowedDefinitions.map(({ key, label }) => (
                <option key={key} value={key}>
                  {label}
                  {metrics[key] !== "" ? " ✓" : ""}
                </option>
              ))}
            </select>
        </div>

        {/* Input field for selected metric */}
        {selectedMetricKey && (
          <div className="p-4 rounded-xl border border-blue-200 dark:border-blue-700
                     bg-blue-50 dark:bg-gray-900 shadow-sm">
            <label className="text-sm font-semibold text-gray-600 dark:text-gray-300 block mb-2">
              {editableMetricDefinitions.find((m) => m.key === selectedMetricKey)?.label}
            </label>

            {selectedMetricKey === "trainingHours" ? (
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={trainingDetails.people}
                    onChange={handleTrainingDetailChange("people")}
                    disabled={isSubmitting}
                    min="0"
                    placeholder="Number of people"
                    autoFocus
                    className="flex-1 p-2 rounded-lg border border-gray-300 dark:border-gray-600
                             bg-gray-50 dark:bg-gray-800
                             focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  />
                  <input
                    type="number"
                    value={trainingDetails.length}
                    onChange={handleTrainingDetailChange("length")}
                    disabled={isSubmitting}
                    min="0"
                    placeholder="Length (hours)"
                    className="flex-1 p-2 rounded-lg border border-gray-300 dark:border-gray-600
                             bg-gray-50 dark:bg-gray-800
                             focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  />
                  <input
                    type="number"
                    value={trainingDetails.minutes}
                    onChange={handleTrainingDetailChange("minutes")}
                    disabled={isSubmitting}
                    min="0"
                    placeholder="Minutes"
                    className="flex-1 p-2 rounded-lg border border-gray-300 dark:border-gray-600
                             bg-gray-50 dark:bg-gray-800
                             focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleSaveMetric}
                  disabled={
                    isSubmitting ||
                    trainingDetails.people === "" ||
                    (trainingDetails.length === "" && trainingDetails.minutes === "")
                  }
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  Save
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="number"
                  value={inputValue}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  min="0"
                  placeholder="Enter value"
                  autoFocus
                  className="flex-1 p-2 rounded-lg border border-gray-300 dark:border-gray-600
                           bg-gray-50 dark:bg-gray-800
                           focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={handleSaveMetric}
                  disabled={isSubmitting || inputValue === ""}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  Save
                </button>
              </div>
            )}
          </div>
        )}

        {/* Metrics summary */}
        {Object.values(metrics).some(v => v !== "" && v !== "0") && (
          <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700
                     bg-gray-50 dark:bg-gray-800 shadow-sm">
            <p className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">
              Entered Metrics:
            </p>
            <div className="space-y-1">
              {Object.entries(metrics).map(([key, value]) =>
                value !== "" && value !== "0" ? (
                  <p key={key} className="text-sm text-gray-700 dark:text-gray-400">
                    • {editableMetricDefinitions.find((m) => m.key === key)?.label}:
                    {key === "trainingHours" && trainingDetails.people && (trainingDetails.length || trainingDetails.minutes) ? (
                      <span className="font-semibold">
                        {" "}{trainingDetails.people} people × {trainingDetails.length || 0}h {trainingDetails.minutes || 0}m = {value}
                      </span>
                    ) : (
                      <span className="font-semibold"> {value}</span>
                    )}
                  </p>
                ) : null
              )}
            </div>
          </div>
        )}

        {/* Submit button */}
        <button
          type="submit"
          disabled={isSubmitting || !Object.values(metrics).some(v => v !== "" && v !== "0")}
          className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {isSubmitting ? "Submitting..." : "Submit Metrics"}
        </button>
      </form>
    </>
  );
}
