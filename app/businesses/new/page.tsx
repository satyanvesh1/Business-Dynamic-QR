"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewBusinessPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    description: "",
    phone: "",
    whatsapp: "",
    email: "",
    website: "",
    address: "",
    city: "",
    state: "",
    country: "India",
    postalCode: "",
    googleMapsUrl: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function updateField(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/businesses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create business");
      }

      router.push("/businesses");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong"
      );

      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="mx-auto max-w-4xl px-6 py-10">
        <div className="mb-8">
          <a
            href="/businesses"
            className="text-sm font-medium text-blue-600 hover:underline"
          >
            ← Back to Businesses
          </a>

          <h1 className="mt-4 text-3xl font-bold text-gray-900">
            Create Business
          </h1>

          <p className="mt-2 text-gray-500">
            Add a new business to your Dynamic QR account.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl bg-white p-8 shadow-sm"
        >
          {error && (
            <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="grid gap-6 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Business Name *
              </label>

              <input
                required
                name="name"
                value={form.name}
                onChange={updateField}
                placeholder="Example: Riya Foods"
                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>

              <textarea
                name="description"
                value={form.description}
                onChange={updateField}
                rows={4}
                placeholder="Tell customers about your business..."
                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone
              </label>

              <input
                name="phone"
                value={form.phone}
                onChange={updateField}
                placeholder="+91 9876543210"
                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                WhatsApp
              </label>

              <input
                name="whatsapp"
                value={form.whatsapp}
                onChange={updateField}
                placeholder="+91 9876543210"
                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Business Email
              </label>

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={updateField}
                placeholder="business@example.com"
                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Website
              </label>

              <input
                name="website"
                value={form.website}
                onChange={updateField}
                placeholder="https://example.com"
                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Address
              </label>

              <input
                name="address"
                value={form.address}
                onChange={updateField}
                placeholder="Street / Building / Area"
                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                City
              </label>

              <input
                name="city"
                value={form.city}
                onChange={updateField}
                placeholder="Hyderabad"
                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                State
              </label>

              <input
                name="state"
                value={form.state}
                onChange={updateField}
                placeholder="Telangana"
                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Country
              </label>

              <input
                name="country"
                value={form.country}
                onChange={updateField}
                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Postal Code
              </label>

              <input
                name="postalCode"
                value={form.postalCode}
                onChange={updateField}
                placeholder="500001"
                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Google Maps URL
              </label>

              <input
                name="googleMapsUrl"
                value={form.googleMapsUrl}
                onChange={updateField}
                placeholder="https://maps.google.com/..."
                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3"
              />
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-4">
            <a
              href="/businesses"
              className="rounded-lg border border-gray-300 px-6 py-3 font-medium hover:bg-gray-50"
            >
              Cancel
            </a>

            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Business"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}