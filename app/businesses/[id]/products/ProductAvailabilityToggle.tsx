"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type ProductAvailabilityToggleProps = {
  businessId: string;
  productId: string;
  available: boolean;
};

export default function ProductAvailabilityToggle({
  businessId,
  productId,
  available,
}: ProductAvailabilityToggleProps) {
  const router = useRouter();

  const [isAvailable, setIsAvailable] = useState(available);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function toggleAvailability() {
    if (loading) {
      return;
    }

    setLoading(true);
    setError("");

    const nextStatus = isAvailable
      ? "INACTIVE"
      : "ACTIVE";

    try {
      const response = await fetch(
        `/api/businesses/${businessId}/products/${productId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: nextStatus,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to change availability."
        );
      }

      setIsAvailable(nextStatus === "ACTIVE");

      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to change availability."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={toggleAvailability}
        disabled={loading}
        className={`rounded-lg px-3 py-2 text-xs font-bold transition disabled:cursor-not-allowed disabled:opacity-50 ${
          isAvailable
            ? "border border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
            : "border border-green-200 bg-green-50 text-green-700 hover:bg-green-100"
        }`}
      >
        {loading
          ? "Updating..."
          : isAvailable
            ? "Mark Unavailable"
            : "Mark Available"}
      </button>

      {error ? (
        <p className="max-w-[140px] text-right text-[10px] text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}