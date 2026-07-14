"use client";

interface LocationStatusProps {
  locationLabel: string;
  status: "DRAFT" | "VERIFIED" | "INVALID_LOCATION" | "FAILED";
  verifiedIpCountry?: string;
  warning?: string;
}

export default function LocationStatus({
  locationLabel,
  status,
  verifiedIpCountry,
  warning,
}: LocationStatusProps) {
  const statusConfig = {
    DRAFT: {
      bg: "bg-gray-100 dark:bg-gray-800",
      text: "text-gray-700 dark:text-gray-300",
      dot: "bg-gray-400",
      label: "Pending",
    },
    VERIFIED: {
      bg: "bg-green-100 dark:bg-green-900",
      text: "text-green-700 dark:text-green-300",
      dot: "bg-green-500",
      label: "Verified",
    },
    INVALID_LOCATION: {
      bg: "bg-yellow-100 dark:bg-yellow-900",
      text: "text-yellow-700 dark:text-yellow-300",
      dot: "bg-yellow-500",
      label: "Invalid Location",
    },
    FAILED: {
      bg: "bg-red-100 dark:bg-red-900",
      text: "text-red-700 dark:text-red-300",
      dot: "bg-red-500",
      label: "Failed",
    },
  };

  const config = statusConfig[status];

  return (
    <div className={`relative inline-flex items-center gap-2 px-3 py-2 rounded-full ${config.bg} ${config.text} group cursor-help`}>
      <span className={`w-2 h-2 rounded-full ${config.dot}`} />
      <span className="text-sm font-medium">{locationLabel}</span>
      <span className="text-xs opacity-70">{config.label}</span>

      {(verifiedIpCountry || warning) && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-3 rounded bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-10">
          {verifiedIpCountry && <p>✓ Detected: {verifiedIpCountry}</p>}
          {warning && <p className="text-yellow-300">⚠ {warning}</p>}
        </div>
      )}
    </div>
  );
}
