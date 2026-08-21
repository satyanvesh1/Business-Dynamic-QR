"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type DeleteBusinessButtonProps = {
  businessId: string;
  businessName: string;
};

export default function DeleteBusinessButton({
  businessId,
  businessName,
}: DeleteBusinessButtonProps) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm(
      `Are you sure you want to permanently delete "${businessName}"?\n\n` +
        `This will also delete all products, QR codes, and scan records belonging to this business.\n\n` +
        `This action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    setDeleting(true);

    try {
      const response = await fetch(`/api/businesses/${businessId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || "Failed to delete business"
        );
      }

      alert("Business deleted successfully.");

      router.push("/businesses");
      router.refresh();
    } catch (error) {
      console.error("Delete business error:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to delete business"
      );

      setDeleting(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={deleting}
      className="w-full rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {deleting ? "Deleting..." : "Delete Business"}
    </button>
  );
}