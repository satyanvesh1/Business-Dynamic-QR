
"use client";

import { useState } from "react";

const statuses = [
  "REQUESTED",
  "CONTACTED",
  "CONFIRMED",
  "COMPLETED",
  "CANCELLED",
] as const;

type Status = (typeof statuses)[number];

type Props = {
  requestId: string;
  initialStatus: Status;
};

function getStatusClasses(status: Status) {
  switch (status) {
    case "REQUESTED":
      return "bg-yellow-100 text-yellow-800 border-yellow-300";

    case "CONTACTED":
      return "bg-purple-100 text-purple-800 border-purple-300";

    case "CONFIRMED":
      return "bg-green-100 text-green-800 border-green-300";

    case "COMPLETED":
      return "bg-blue-100 text-blue-800 border-blue-300";

    case "CANCELLED":
      return "bg-red-100 text-red-800 border-red-300";

    default:
      return "bg-gray-100 text-gray-800 border-gray-300";
  }
}

export default function StatusControl({
  requestId,
  initialStatus,
}: Props) {
  const [status, setStatus] = useState<Status>(initialStatus);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleStatusChange(
    event: React.ChangeEvent<HTMLSelectElement>
  ) {
    const newStatus = event.target.value as Status;

    if (newStatus === status) {
      return;
    }

    const previousStatus = status;

    setStatus(newStatus);
    setSaving(true);
    setError("");

    try {
      const response = await fetch(
        `/api/transport-requests/${requestId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || "Failed to update request status."
        );
      }

      setStatus(data.request.status as Status);
    } catch (error) {
      console.error("Status update error:", error);

      setStatus(previousStatus);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to update request status."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-w-[220px]">
      <label
        htmlFor={`status-${requestId}`}
        className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500"
      >
        Request Status
      </label>

      <select
        id={`status-${requestId}`}
        value={status}
        onChange={handleStatusChange}
        disabled={saving}
        className={`w-full rounded-lg border px-3 py-2.5 text-sm font-semibold outline-none transition ${getStatusClasses(
          status
        )} ${
          saving
            ? "cursor-wait opacity-60"
            : "cursor-pointer"
        }`}
      >
        {statuses.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>

      {saving ? (
        <p className="mt-2 text-xs font-medium text-gray-500">
          Updating status...
        </p>
      ) : null}

      {error ? (
        <p className="mt-2 text-xs font-medium text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}