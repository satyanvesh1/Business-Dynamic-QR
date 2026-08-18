"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type QRStatusButtonProps = {
  businessId: string;
  qrId: string;
  status: "ACTIVE" | "INACTIVE";
};

export default function QRStatusButton({
  businessId,
  qrId,
  status,
}: QRStatusButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const nextStatus =
    status === "ACTIVE" ? "INACTIVE" : "ACTIVE";

  async function handleStatusChange() {
    setLoading(true);

    try {
      const response = await fetch(
        `/api/businesses/${businessId}/qr-codes/${qrId}`,
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
        alert(data.error || "Failed to update QR code status");
        return;
      }

      router.refresh();
    } catch (error) {
      console.error("QR STATUS UPDATE ERROR:", error);
      alert("Failed to update QR code status");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleStatusChange}
      disabled={loading}
      className={`block w-full rounded-lg px-5 py-3 text-center text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60 ${
        status === "ACTIVE"
          ? "bg-red-600 hover:bg-red-700"
          : "bg-green-600 hover:bg-green-700"
      }`}
    >
      {loading
        ? "Updating..."
        : status === "ACTIVE"
          ? "Deactivate QR Code"
          : "Activate QR Code"}
    </button>
  );
}