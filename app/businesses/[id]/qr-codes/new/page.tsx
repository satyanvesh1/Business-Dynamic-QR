"use client";

import { FormEvent, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function NewQRCodePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const businessId = params.id;

  const [name, setName] = useState("");
  const [status, setStatus] = useState("ACTIVE");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `/api/businesses/${businessId}/qr-codes`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            status,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to create QR code"
        );
      }

      router.push(`/businesses/${businessId}`);
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="mx-auto max-w-3xl px-6 py-10">
        <button
          type="button"
          onClick={() =>
            router.push(`/businesses/${businessId}`)
          }
          className="text-sm font-medium text-blue-600 hover:underline"
        >
          ← Back to Business
        </button>

        <div className="mt-6 rounded-2xl bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-bold text-gray-900">
            Generate QR Code
          </h1>

          <p className="mt-2 text-gray-500">
            Create a dynamic QR code for your business.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-6"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700">
                QR Code Name
              </label>

              <input
                type="text"
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                placeholder="Example: RIYA HOTELS Menu"
                required
                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Status
              </label>

              <select
                value={status}
                onChange={(event) =>
                  setStatus(event.target.value)
                }
                className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-3"
              >
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="flex gap-3 border-t pt-6">
              <button
                type="submit"
                disabled={loading}
                className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white disabled:opacity-50"
              >
                {loading ? "Generating..." : "Generate QR Code"}
              </button>

              <button
                type="button"
                disabled={loading}
                onClick={() =>
                  router.push(`/businesses/${businessId}`)
                }
                className="rounded-lg border border-gray-300 bg-white px-6 py-3"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}