import { useState, useEffect } from "react";
import { editableMetricDefinitions } from "../constants/editableMetricsDefinitions";

export default function MetricForm({ onSubmit, projectId }) {
  const [metrics, setMetrics] = useState(
    Object.fromEntries(editableMetricDefinitions.map((m) => [m.key, ""]))
  );

  const [timestamp, setTimestamp] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Personnel type state
  const [personnelType, setPersonnelType] = useState(""); // "almaco" or "contractor"
  
  // New state for one-by-one input
  const [selectedMetricKey, setSelectedMetricKey] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [trainingDetails, setTrainingDetails] = useState({ people: "", length: "", minutes: "" });
  const [trainingInputMode, setTrainingInputMode] = useState("direct"); // "direct" or "calculated"
  
  // Contractor state
  const [contractors, setContractors] = useState([]);
  const [selectedContractor, setSelectedContractor] = useState("");
  const [loadingContractors, setLoadingContractors] = useState(false);
  const [workingHoursContractor, setWorkingHoursContractor] = useState(null); // Store contractor name for display
  
  // Filter metrics based on personnel type
  const allowedDefinitions = personnelType === "almaco"
    ? editableMetricDefinitions.filter(m => m.key !== "workingHours")
    : personnelType === "contractor"
    ? editableMetricDefinitions.filter(m => m.key === "workingHours")
    : [];

  // Set default date to today when component loads
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setTimestamp(today);
  }, []);

  // Fetch contractors from backend
  useEffect(() => {
    if (!projectId) return;
    
    setLoadingContractors(true);
    fetch(`https://hse-app-backend.vercel.app/projects/contractors?projectId=${projectId}`)
      .then(res => res.json())
      .then(data => {
        setContractors(data || []);
      })
      .catch(err => {
        console.error("Failed to fetch contractors:", err);
        setContractors([]);
      })
      .finally(() => {
        setLoadingContractors(false);
      });
  }, [projectId]);
  
  // Handle personnel type change
  const handlePersonnelTypeChange = (type) => {
    setPersonnelType(type);
    // Reset form when changing personnel type
    setMetrics(Object.fromEntries(editableMetricDefinitions.map((m) => [m.key, ""])));
    setSelectedMetricKey("");
    setInputValue("");
    setTrainingDetails({ people: "", length: "", minutes: "" });
    setSelectedContractor("");
    setWorkingHoursContractor(null);
    
    // If contractor type, pre-select workingHours metric
    if (type === "contractor") {
      setSelectedMetricKey("workingHours");
    }
  };

  const handleMetricSelect = (key) => {
    setSelectedMetricKey(key);
    if (key === "trainingHours") {
      setInputValue("");
      setTrainingDetails((prev) => ({
        people: prev.people ?? "",
        length: prev.length ?? "",
        minutes: prev.minutes ?? "",
      }));
      setTrainingInputMode("direct"); // Reset to direct mode
    } else {
      setInputValue(metrics[key] || "");
    }
    // Reset contractor selection when changing metrics
    if (key === "workingHours") {
      setSelectedContractor("");
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
      if (trainingInputMode === "direct") {
        // Direct input mode
        if (inputValue !== "") {
          const numericValue = Number(inputValue);
          if (numericValue < 0) return;
          setMetrics({ ...metrics, trainingHours: inputValue });
          setTrainingDetails({ people: "", length: "", minutes: "" }); // Clear calculated details
        } else {
          return;
        }
      } else {
        // Calculated mode
        const people = Number(trainingDetails.people);
        const length = Number(trainingDetails.length);
        const minutes = Number(trainingDetails.minutes || 0);
        if (people < 0 || length < 0 || minutes < 0) return;
        if (!people || (!length && !minutes)) return;

        const totalHours = length + minutes / 60;
        const total = people * totalHours;
        setMetrics({ ...metrics, trainingHours: String(total) });
      }
    } else if (inputValue !== "") {
      const numericValue = Number(inputValue);
      if (numericValue < 0) return;
      setMetrics({ ...metrics, [selectedMetricKey]: inputValue });
      
      // Store contractor info for workingHours
      if (selectedMetricKey === "workingHours" && selectedContractor) {
        const contractor = contractors.find(c => c.contractorId === parseInt(selectedContractor));
        if (contractor) {
          setWorkingHoursContractor(contractor.contractorName);
        }
      }
    } else {
      return;
    }

    // Auto-reset for next metric input (but keep workingHours selected for contractors)
    if (personnelType === "contractor") {
      setInputValue("");
    } else {
      setSelectedMetricKey("");
      setInputValue("");
    }
  };

  const handleDeleteMetric = (key) => {
    setMetrics({ ...metrics, [key]: "" });
    if (key === "trainingHours") {
      setTrainingDetails({ people: "", length: "", minutes: "" });
    }
    if (key === "workingHours") {
      setWorkingHoursContractor(null);
      setSelectedContractor("");
    }
  };

  const handleSubmitMetrics = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    
    // Validate personnel type is selected
    if (!personnelType) {
      setErrorMessage("Please select whether you are Almaco personnel or a contractor.");
      return;
    }
    
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
    
    // Validate contractor selection for working hours
    if (metrics.workingHours && metrics.workingHours !== "" && metrics.workingHours !== "0" && !selectedContractor) {
      setErrorMessage("Please select a contractor for working hours before submitting.");
      return;
    }
    
    setIsSubmitting(true);
    setSuccessMessage("");
    setErrorMessage("");
    try {
      const submissionData = { ...metrics, timestamp };
      // Set contractor ID: 1 for Almaco personnel, selected contractor for contractors
      if (personnelType === "almaco") {
        submissionData.contractor = "1";
      } else if (selectedContractor) {
        submissionData.contractor = selectedContractor;
      }
      await onSubmit(submissionData);
      
      // Reset form on successful submission
      setMetrics(
        Object.fromEntries(editableMetricDefinitions.map((m) => [m.key, ""]))
      );
      const today = new Date().toISOString().split('T')[0];
      setTimestamp(today);
      setSelectedMetricKey("");
      setInputValue("");
      setTrainingDetails({ people: "", length: "", minutes: "" });
      setSelectedContractor("");
      setWorkingHoursContractor(null);
      setPersonnelType("");

    } catch (error) {
      console.error("Submission failed:", error);
      // Show error message
      const errorMsg = error.message || "Failed to submit metrics. Please try again.";
      setErrorMessage(`Submission failed: ${errorMsg}`);
      setTimeout(() => setErrorMessage(""), 8000);
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

        {/* Personnel Type Selection */}
        <div className="p-3 sm:p-4 rounded-xl border-2 border-blue-300 dark:border-blue-700
                   bg-blue-50 dark:bg-blue-900/20 shadow-sm">
          
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={() => handlePersonnelTypeChange("almaco")}
              disabled={isSubmitting}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition ${
                personnelType === "almaco"
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-2 border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500"
              } disabled:opacity-50`}
            >
              Create HSE Report
            </button>
            <button
              type="button"
              onClick={() => handlePersonnelTypeChange("contractor")}
              disabled={isSubmitting}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition ${
                personnelType === "contractor"
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-2 border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500"
              } disabled:opacity-50`}
            >
              Submit Working Hours
            </button>
          </div>
          
          {personnelType === "contractor" && (
            <div className="mt-4">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-200 block mb-2">
                Select Your Company *
              </label>
              {loadingContractors ? (
                <p className="text-sm text-gray-600 dark:text-gray-400">Loading contractors...</p>
              ) : contractors.length === 0 ? (
                <p className="text-sm text-red-600 dark:text-red-400">No contractors available for this project</p>
              ) : (
                <select
                  value={selectedContractor}
                  onChange={(e) => setSelectedContractor(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600
                           bg-white dark:bg-gray-800
                           focus:ring-2 focus:ring-blue-500 disabled:opacity-50 text-base"
                  style={{ fontSize: '16px' }}
                >
                  <option value="">-- Select your company --</option>
                  {contractors.map((contractor) => (
                    <option key={contractor.contractorId} value={contractor.contractorId}>
                      {contractor.contractorName}
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}
        </div>

        {personnelType && (
          <>
        {/* Timestamp input */}
        <div className="p-3 sm:p-4 rounded-xl border border-gray-200 dark:border-gray-700
                   bg-white dark:bg-gray-900 shadow-sm overflow-hidden">
          <label className="text-sm font-semibold text-gray-600 dark:text-gray-300 block mb-2">
            Date
          </label>

          <input
            type="date"
            name="timestamp"
            value={timestamp}
            onChange={(e) => setTimestamp(e.target.value)}
            max={today}
            className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600
                     bg-gray-50 dark:bg-gray-800
                     focus:ring-2 focus:ring-blue-500 text-base box-border"
            style={{ 
              fontSize: '16px', 
              maxWidth: '100%',
              minWidth: '0',
              width: '100%',
              WebkitAppearance: 'none'
            }}
          />
        </div>

        {/* One-by-one metric input */}
        <div className="p-3 sm:p-4 rounded-xl border border-gray-200 dark:border-gray-700
                   bg-white dark:bg-gray-900 shadow-sm">
          <label className="text-sm font-semibold text-gray-600 dark:text-gray-300 block mb-2">
            Select Metric to Input
          </label>

          <select
            value={selectedMetricKey}
              onChange={(e) => handleMetricSelect(e.target.value)}
              disabled={isSubmitting}
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600
                       bg-gray-50 dark:bg-gray-800
                       focus:ring-2 focus:ring-blue-500 disabled:opacity-50 text-base"
              style={{ fontSize: '16px' }}
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
          <div className="p-3 sm:p-4 rounded-xl border border-blue-200 dark:border-blue-700
                     bg-blue-50 dark:bg-gray-900 shadow-sm overflow-hidden">
            <label className="text-sm font-semibold text-gray-600 dark:text-gray-300 block mb-2">
              {editableMetricDefinitions.find((m) => m.key === selectedMetricKey)?.label}
            </label>

            {selectedMetricKey === "trainingHours" ? (
              <div className="space-y-3">
                {/* Mode selector */}
                <div className="flex gap-2 mb-3">
                  <button
                    type="button"
                    onClick={() => {
                      setTrainingInputMode("direct");
                      setTrainingDetails({ people: "", length: "", minutes: "" });
                    }}
                    className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition ${
                      trainingInputMode === "direct"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    Direct Input
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setTrainingInputMode("calculated");
                      setInputValue("");
                    }}
                    className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition ${
                      trainingInputMode === "calculated"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    Calculate
                  </button>
                </div>

                {trainingInputMode === "direct" ? (
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={inputValue}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                      min="0"
                      placeholder="Enter total hours"
                      autoFocus
                      className="flex-1 p-3 rounded-lg border border-gray-300 dark:border-gray-600
                               bg-gray-50 dark:bg-gray-800
                               focus:ring-2 focus:ring-blue-500 disabled:opacity-50 text-base"
                      style={{ fontSize: '16px' }}
                    />
                    <button
                      type="button"
                      onClick={handleSaveMetric}
                      disabled={isSubmitting || inputValue === ""}
                      className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:bg-blue-800 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium whitespace-nowrap"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="number"
                        value={trainingDetails.people}
                        onChange={handleTrainingDetailChange("people")}
                        disabled={isSubmitting}
                        min="0"
                        placeholder="# People"
                        autoFocus
                        className="flex-1 p-3 rounded-lg border border-gray-300 dark:border-gray-600
                                 bg-gray-50 dark:bg-gray-800
                                 focus:ring-2 focus:ring-blue-500 disabled:opacity-50 text-base"
                        style={{ fontSize: '16px' }}
                      />
                      <input
                        type="number"
                        value={trainingDetails.length}
                        onChange={handleTrainingDetailChange("length")}
                        disabled={isSubmitting}
                        min="0"
                        placeholder="Hours"
                        className="flex-1 p-3 rounded-lg border border-gray-300 dark:border-gray-600
                                 bg-gray-50 dark:bg-gray-800
                                 focus:ring-2 focus:ring-blue-500 disabled:opacity-50 text-base"
                        style={{ fontSize: '16px' }}
                      />
                      <input
                        type="number"
                        value={trainingDetails.minutes}
                        onChange={handleTrainingDetailChange("minutes")}
                        disabled={isSubmitting}
                        min="0"
                        placeholder="Min"
                        className="flex-1 p-3 rounded-lg border border-gray-300 dark:border-gray-600
                                 bg-gray-50 dark:bg-gray-800
                                 focus:ring-2 focus:ring-blue-500 disabled:opacity-50 text-base"
                        style={{ fontSize: '16px' }}
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
                      className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:bg-blue-800 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                    >
                      Save
                    </button>
                  </>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={inputValue}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    min="0"
                    placeholder="Enter value"
                    autoFocus
                    className="flex-1 p-3 rounded-lg border border-gray-300 dark:border-gray-600
                             bg-gray-50 dark:bg-gray-800
                             focus:ring-2 focus:ring-blue-500 disabled:opacity-50 text-base"
                    style={{ fontSize: '16px' }}
                  />
                  <button
                    type="button"
                    onClick={handleSaveMetric}
                    disabled={isSubmitting || inputValue === "" || (selectedMetricKey === "workingHours" && personnelType === "almaco" && !selectedContractor) || (selectedMetricKey === "workingHours" && personnelType === "contractor" && !selectedContractor)}
                    className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:bg-blue-800 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium whitespace-nowrap"
                  >
                    Save
                  </button>
                </div>
                
                {/* Contractor selection for working hours - only show if Almaco personnel */}
                {selectedMetricKey === "workingHours" && personnelType === "almaco" && (
                  <div>
                    <label className="text-sm font-semibold text-gray-600 dark:text-gray-300 block mb-2">
                      Select Contractor *
                    </label>
                    {loadingContractors ? (
                      <p className="text-sm text-gray-500">Loading contractors...</p>
                    ) : contractors.length === 0 ? (
                      <p className="text-sm text-red-500">No contractors available for this project</p>
                    ) : (
                      <select
                        value={selectedContractor}
                        onChange={(e) => setSelectedContractor(e.target.value)}
                        disabled={isSubmitting}
                        className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600
                                 bg-gray-50 dark:bg-gray-800
                                 focus:ring-2 focus:ring-blue-500 disabled:opacity-50 text-base"
                        style={{ fontSize: '16px' }}
                      >
                        <option value="">-- Select a contractor --</option>
                        {contractors.map((contractor) => (
                          <option key={contractor.contractorId} value={contractor.contractorId}>
                            {contractor.contractorName}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                )}
                {/* For contractors, the company is already selected at the top */}
                {selectedMetricKey === "workingHours" && personnelType === "contractor" && selectedContractor && (
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      <span className="font-semibold">Company:</span> {contractors.find(c => c.contractorId === parseInt(selectedContractor))?.contractorName}
                    </p>
                  </div>
                )}
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
            <div className="space-y-2">
              {Object.entries(metrics).map(([key, value]) =>
                value !== "" && value !== "0" ? (
                  <div key={key} className="flex items-center justify-between text-sm text-gray-700 dark:text-gray-400 p-2 rounded-lg bg-white dark:bg-gray-700">
                    <span>
                      • {editableMetricDefinitions.find((m) => m.key === key)?.label}:
                      {key === "trainingHours" && trainingDetails.people && (trainingDetails.length || trainingDetails.minutes) ? (
                        <span className="font-semibold">
                          {" "}{trainingDetails.people} people × {trainingDetails.length || 0}h {trainingDetails.minutes || 0}m = {value}
                        </span>
                      ) : key === "workingHours" && workingHoursContractor ? (
                        <span className="font-semibold">
                          {" "}{value} hours ({workingHoursContractor})
                        </span>
                      ) : (
                        <span className="font-semibold"> {value}</span>
                      )}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDeleteMetric(key)}
                      disabled={isSubmitting}
                      className="ml-4 px-2 py-1 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900 rounded transition disabled:opacity-50"
                      title="Delete this metric"
                    >
                      ✕
                    </button>
                  </div>
                ) : null
              )}
            </div>
          </div>
        )}

        {/* Submit button */}
        <button
          type="submit"
          disabled={isSubmitting || !Object.values(metrics).some(v => v !== "" && v !== "0")}
          className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 active:bg-green-800 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium text-base min-h-[48px]"
        >
          {isSubmitting ? "Submitting..." : "Submit Metrics"}
        </button>
        </>
        )}
      </form>
    </>
  );
}
