"use client";

interface ComparisonProgressProps {
  status: "DRAFT" | "RUNNING" | "COMPLETED" | "PARTIAL" | "FAILED" | "INVALID_LOCATION";
  currentStep?: number;
  totalSteps?: number;
  message?: string;
  errors?: string[];
}

export default function ComparisonProgress({
  status,
  currentStep = 0,
  totalSteps = 6,
  message,
  errors,
}: ComparisonProgressProps) {
  const steps = [
    { name: "Validate Request", description: "Checking search parameters" },
    { name: "Verify IPs", description: "Confirming proxy locations" },
    { name: "Search Providers", description: "Fetching flight offers" },
    { name: "Match Offers", description: "Comparing baseline to regional" },
    { name: "Normalize Prices", description: "Converting to selected currency" },
    { name: "Generate Evidence", description: "Creating audit trail" },
  ];

  const isError = status === "FAILED" || status === "INVALID_LOCATION";
  const isCompleted = status === "COMPLETED" || status === "PARTIAL";

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg p-6 mb-8">
      <div className="mb-6">
        <h2 className="text-lg font-bold mb-2">
          {isCompleted && "✓ Comparison Complete"}
          {isError && "✗ Comparison Failed"}
          {status === "RUNNING" && "⏳ Searching..."}
          {status === "DRAFT" && "→ Ready to Compare"}
        </h2>
        {message && <p className="text-sm text-gray-600 dark:text-gray-400">{message}</p>}
      </div>

      {status === "RUNNING" && (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Progress</span>
            <span className="text-xs text-gray-500">
              Step {currentStep} of {totalSteps}
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-blue-500 dark:bg-blue-400 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>
      )}

      <div className="space-y-3">
        {steps.map((step, idx) => {
          const stepNum = idx + 1;
          let stepStatus: "pending" | "current" | "completed" | "error" = "pending";

          if (isError) {
            stepStatus = stepNum <= currentStep ? "completed" : "pending";
          } else if (status === "RUNNING" || status === "COMPLETED" || status === "PARTIAL") {
            if (stepNum < currentStep) stepStatus = "completed";
            if (stepNum === currentStep) stepStatus = "current";
            if (stepNum <= currentStep && status !== "RUNNING") stepStatus = "completed";
          }

          const bgColor =
            stepStatus === "completed"
              ? "bg-green-50 dark:bg-green-900"
              : stepStatus === "current"
                ? "bg-blue-50 dark:bg-blue-900"
                : "bg-gray-50 dark:bg-gray-800";

          const borderColor =
            stepStatus === "completed"
              ? "border-green-200 dark:border-green-700"
              : stepStatus === "current"
                ? "border-blue-200 dark:border-blue-700"
                : "border-gray-200 dark:border-gray-700";

          const iconColor =
            stepStatus === "completed"
              ? "text-green-600 dark:text-green-400"
              : stepStatus === "current"
                ? "text-blue-600 dark:text-blue-400"
                : "text-gray-400 dark:text-gray-600";

          return (
            <div
              key={idx}
              className={`flex items-center gap-3 p-3 rounded border ${bgColor} ${borderColor}`}
            >
              <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center font-bold text-sm ${iconColor}`}>
                {stepStatus === "completed" ? "✓" : stepStatus === "current" ? "→" : stepNum}
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">{step.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{step.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      {isError && errors && errors.length > 0 && (
        <div className="mt-6 p-4 bg-red-50 dark:bg-red-900 rounded border border-red-200 dark:border-red-700">
          <p className="text-sm font-medium text-red-800 dark:text-red-200 mb-2">Errors:</p>
          <ul className="space-y-1">
            {errors.map((error, idx) => (
              <li key={idx} className="text-xs text-red-700 dark:text-red-300">
                • {error}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
