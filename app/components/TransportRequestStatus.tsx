"use client";

import { useState } from "react";

type Props = {
  requestId: string;
  currentStatus: string;
  customerPhone: string;
};

const statuses = [
  {
    value: "CONTACTED",
    label: "Contacted",
    activeClass: "bg-blue-600 text-white border-blue-600",
    hoverClass: "hover:bg-blue-50 hover:border-blue-300",
  },
  {
    value: "CONFIRMED",
    label: "Confirmed",
    activeClass: "bg-violet-600 text-white border-violet-600",
    hoverClass: "hover:bg-violet-50 hover:border-violet-300",
  },
  {
    value: "COMPLETED",
    label: "Completed",
    activeClass: "bg-green-600 text-white border-green-600",
    hoverClass: "hover:bg-green-50 hover:border-green-300",
  },
  {
    value: "CANCELLED",
    label: "Cancelled",
    activeClass: "bg-red-600 text-white border-red-600",
    hoverClass: "hover:bg-red-50 hover:border-red-300",
  },
];

const statusStyles: Record<string, string> = {
  REQUESTED: "bg-yellow-50 text-yellow-700 border-yellow-200",
  CONTACTED: "bg-blue-50 text-blue-700 border-blue-200",
  CONFIRMED: "bg-violet-50 text-violet-700 border-violet-200",
  COMPLETED: "bg-green-50 text-green-700 border-green-200",
  CANCELLED: "bg-red-50 text-red-700 border-red-200",
};

export default function TransportRequestStatus({
  requestId,
  currentStatus,
  customerPhone,
}: Props) {
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);

  async function updateStatus(newStatus: string) {
    if (loading || newStatus === status) return;

    setLoading(true);

    try {
      const response = await fetch("/api/transport-requests", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          requestId,
          status: newStatus,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to update request status"
        );
      }

      setStatus(newStatus);
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to update request status"
      );
    } finally {
      setLoading(false);
    }
  }

  const currentStatusClass =
    statusStyles[status] ||
    "bg-gray-50 text-gray-700 border-gray-200";

  return (
    <div className="mt-5 rounded-xl border border-gray-100 bg-gray-50 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
            Request Status
          </p>

          <span
            className={`mt-1 inline-flex rounded-full border px-3 py-1 text-xs font-bold ${currentStatusClass}`}
          >
            {status}
          </span>
        </div>

        {loading && (
          <span className="text-xs font-medium text-gray-500">
            Updating...
          </span>
        )}
      </div>

      <div className="mt-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
          Change Status
        </p>

        <div className="flex flex-wrap gap-2">
          {statuses.map((item) => {
            const isActive = status === item.value;

            return (
              <button
                key={item.value}
                type="button"
                disabled={loading}
                onClick={() => updateStatus(item.value)}
                className={`rounded-lg border px-4 py-2 text-xs font-bold transition ${
                  isActive
                    ? item.activeClass
                    : `bg-white text-gray-700 border-gray-200 ${item.hoverClass}`
                } disabled:cursor-not-allowed disabled:opacity-50`}
              >
                {loading && isActive ? "Updating..." : item.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <a
          href={`tel:${customerPhone}`}
          className="inline-flex items-center rounded-lg bg-green-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-green-700"
        >
          Call Customer
        </a>

        <a
          href={`https://wa.me/${customerPhone.replace(/[^0-9]/g, "")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center rounded-lg bg-emerald-500 px-4 py-2 text-sm font-bold text-white transition hover:bg-emerald-600"
        >
          WhatsApp Customer
        </a>
      </div>
    </div>
  );
}

