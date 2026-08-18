"use client";

import {
  FormEvent,
  useState,
} from "react";
import {
  useParams,
  useRouter,
} from "next/navigation";

export default function NewQRCodePage() {
  const params =
    useParams<{ id: string }>();

  const router = useRouter();

  const businessId = params.id;

  const [name, setName] =
    useState("");

  const [status, setStatus] =
    useState("ACTIVE");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `/api/businesses/${businessId}/qr-codes`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            name,
            status,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Failed to create QR code"
        );
      }

      router.push(
        `/businesses/${businessId}/qr-codes`
      );

      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
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
            router.push(
              `/businesses/${businessId}`
            )
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
            Create a permanent dynamic QR
            code for your business.
          </p>

          <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50 p-4">

            <p className="text-sm font-semibold text-blue-900">
              Dynamic QR
            </p>

            <p className="mt-1 text-sm leading-6 text-blue-800">
              You can print this QR code once.
              Future product or price changes
              will automatically appear when
              customers scan it.
            </p>

          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-6"
          >

            <div>

              <label
                htmlFor="qr-name"
                className="block text-sm font-medium text-gray-700"
              >
                QR Code Name
              </label>

              <input
                id="qr-name"
                type="text"
                value={name}
                onChange={(event) =>
                  setName(
                    event.target.value
                  )
                }
                placeholder="Example: RIYA HOTELS Menu"
                required
                disabled={loading}
                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
              />

            </div>

            <div>

              <label
                htmlFor="qr-status"
                className="block text-sm font-medium text-gray-700"
              >
                Status
              </label>

              <select
                id="qr-status"
                value={status}
                onChange={(event) =>
                  setStatus(
                    event.target.value
                  )
                }
                disabled={loading}
                className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
              >

                <option value="ACTIVE">
                  Active
                </option>

                <option value="INACTIVE">
                  Inactive
                </option>

              </select>

            </div>

            {error ? (
              <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            ) : null}

            <div className="flex gap-3 border-t pt-6">

              <button
                type="submit"
                disabled={
                  loading ||
                  !name.trim()
                }
                className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading
                  ? "Generating..."
                  : "Generate QR Code"}
              </button>

              <button
                type="button"
                disabled={loading}
                onClick={() =>
                  router.push(
                    `/businesses/${businessId}`
                  )
                }
                className="rounded-lg border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
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