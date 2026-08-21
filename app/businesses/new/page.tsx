"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const BUSINESS_TYPES = [
  {
    value: "RESTAURANT",
    label: "Restaurant",
    description: "Restaurants, cafes, food outlets and dining businesses",
    icon: "🍽️",
  },
  {
    value: "HOTEL",
    label: "Hotel",
    description: "Hotels, resorts, lodges and accommodation businesses",
    icon: "🏨",
  },
  {
    value: "EVENT_ORGANIZER",
    label: "Event Organizer",
    description: "Event management and event organizing companies",
    icon: "🎪",
  },
  {
    value: "EVENT",
    label: "Event",
    description: "Concerts, exhibitions, conferences and individual events",
    icon: "🎟️",
  },
  {
    value: "PROMOTION",
    label: "Promotion",
    description: "Promotional campaigns, offers and special promotions",
    icon: "🎁",
  },
  {
    value: "MARKETING",
    label: "Marketing",
    description: "Marketing campaigns, brand activations and campaigns",
    icon: "📣",
  },
  {
    value: "SHOPPING_MALL",
    label: "Shopping Mall",
    description: "Shopping malls, commercial centers and retail complexes",
    icon: "🛍️",
  },
  {
    value: "THEATER",
    label: "Theater",
    description: "Cinemas, theaters, shows and entertainment venues",
    icon: "🎬",
  },
  {
    value: "SHOWROOM",
    label: "Showroom",
    description: "Automobile, electronics, furniture and product showrooms",
    icon: "🚗",
  },
  {
    value: "REAL_ESTATE",
    label: "Real Estate",
    description: "Properties, projects, apartments and real estate businesses",
    icon: "🏠",
  },
  {
    value: "CONVENTION",
    label: "Convention Center",
    description: "Convention halls, meeting venues and conference centers",
    icon: "🏢",
  },
  {
    value: "RETAIL",
    label: "Retail",
    description: "Retail stores, shops and consumer businesses",
    icon: "🛒",
  },
  {
    value: "EDUCATION",
    label: "Education",
    description: "Schools, colleges, institutes and training centers",
    icon: "🎓",
  },
  {
    value: "HEALTHCARE",
    label: "Healthcare",
    description: "Hospitals, clinics, healthcare centers and services",
    icon: "🏥",
  },
  {
    value: "TRANSPORT_SERVICES",
    label: "Transport Services",
    description:
      "Bus, taxi, cab, travel, rental, logistics, passenger and transport service businesses",
    icon: "🚌",
  },
  {
    value: "OTHER",
    label: "Other",
    description: "Any other business or organization",
    icon: "⚙️",
  },
] as const;

type BusinessType =
  (typeof BUSINESS_TYPES)[number]["value"];

export default function NewBusinessPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    businessType: "OTHER" as BusinessType,
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
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
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
        throw new Error(
          data.error || "Failed to create business"
        );
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

  const selectedBusinessType = BUSINESS_TYPES.find(
    (type) => type.value === form.businessType
  );

  return (
    <main className="min-h-screen bg-[#F5F7FB]">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-5xl px-6 py-5 lg:px-10">
          <a
            href="/businesses"
            className="inline-flex items-center text-sm font-semibold text-blue-600 transition hover:text-blue-800"
          >
            ← Back to Businesses
          </a>

          <div className="mt-4">
            <p className="text-sm font-medium text-blue-600">
              Business Workspace
            </p>

            <h1 className="mt-1 text-3xl font-bold tracking-tight text-gray-900">
              Create Business
            </h1>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Create a business profile and choose the type of
              customer experience you want to build with Dynamic QR.
            </p>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-6 py-8 lg:px-10">
        <form
          onSubmit={handleSubmit}
          className="space-y-8"
        >
          {/* Error */}
          {error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
              <p className="font-semibold">
                Unable to create business
              </p>

              <p className="mt-1">
                {error}
              </p>
            </div>
          )}

          {/* Business Identity */}
          <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-6">
              <p className="text-sm font-medium text-blue-600">
                Step 1
              </p>

              <h2 className="mt-1 text-xl font-bold text-gray-900">
                Business Identity
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Tell us what business you are creating.
              </p>
            </div>

            <div className="space-y-6">
              {/* Business Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-semibold text-gray-700"
                >
                  Business Name *
                </label>

                <input
                  id="name"
                  required
                  name="name"
                  value={form.name}
                  onChange={updateField}
                  placeholder="Example: Riya Foods"
                  className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />
              </div>

              {/* Business Type */}
              <div>
                <label
                  htmlFor="businessType"
                  className="block text-sm font-semibold text-gray-700"
                >
                  Business Type *
                </label>

                <p className="mt-1 text-xs text-gray-500">
                  This determines the type of QR experience we can
                  build for your customers.
                </p>

                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {BUSINESS_TYPES.map((type) => {
                    const selected =
                      form.businessType === type.value;

                    return (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() =>
                          setForm((previous) => ({
                            ...previous,
                            businessType: type.value,
                          }))
                        }
                        className={`group rounded-2xl border p-4 text-left transition ${
                          selected
                            ? "border-blue-500 bg-blue-50 ring-2 ring-blue-500/20"
                            : "border-gray-200 bg-white hover:border-blue-300 hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xl ${
                              selected
                                ? "bg-blue-600 text-white"
                                : "bg-gray-100"
                            }`}
                          >
                            {type.icon}
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <h3 className="text-sm font-bold text-gray-900">
                                {type.label}
                              </h3>

                              {selected && (
                                <span className="rounded-full bg-blue-600 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white">
                                  Selected
                                </span>
                              )}
                            </div>

                            <p className="mt-1 text-xs leading-5 text-gray-500">
                              {type.description}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Selected Type */}
                {selectedBusinessType && (
                  <div className="mt-4 rounded-xl bg-gray-50 p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                      Selected Business Type
                    </p>

                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-lg">
                        {selectedBusinessType.icon}
                      </span>

                      <span className="text-sm font-bold text-gray-900">
                        {selectedBusinessType.label}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-semibold text-gray-700"
                >
                  Description
                </label>

                <textarea
                  id="description"
                  name="description"
                  value={form.description}
                  onChange={updateField}
                  rows={4}
                  placeholder="Tell customers about your business..."
                  className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />
              </div>
            </div>
          </section>

          {/* Contact Information */}
          <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-6">
              <p className="text-sm font-medium text-blue-600">
                Step 2
              </p>

              <h2 className="mt-1 text-xl font-bold text-gray-900">
                Contact Information
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Add the contact information customers can use.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Phone */}
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-semibold text-gray-700"
                >
                  Phone
                </label>

                <input
                  id="phone"
                  name="phone"
                  value={form.phone}
                  onChange={updateField}
                  placeholder="+91 9876543210"
                  className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3.5 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />
              </div>

              {/* WhatsApp */}
              <div>
                <label
                  htmlFor="whatsapp"
                  className="block text-sm font-semibold text-gray-700"
                >
                  WhatsApp
                </label>

                <input
                  id="whatsapp"
                  name="whatsapp"
                  value={form.whatsapp}
                  onChange={updateField}
                  placeholder="+91 9876543210"
                  className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3.5 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-gray-700"
                >
                  Business Email
                </label>

                <input
                  id="email"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={updateField}
                  placeholder="business@example.com"
                  className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3.5 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />
              </div>

              {/* Website */}
              <div>
                <label
                  htmlFor="website"
                  className="block text-sm font-semibold text-gray-700"
                >
                  Website
                </label>

                <input
                  id="website"
                  name="website"
                  value={form.website}
                  onChange={updateField}
                  placeholder="https://example.com"
                  className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3.5 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />
              </div>
            </div>
          </section>

          {/* Location */}
          <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-6">
              <p className="text-sm font-medium text-blue-600">
                Step 3
              </p>

              <h2 className="mt-1 text-xl font-bold text-gray-900">
                Location
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Add your business location and map information.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Address */}
              <div className="md:col-span-2">
                <label
                  htmlFor="address"
                  className="block text-sm font-semibold text-gray-700"
                >
                  Address
                </label>

                <input
                  id="address"
                  name="address"
                  value={form.address}
                  onChange={updateField}
                  placeholder="Street / Building / Area"
                  className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3.5 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />
              </div>

              {/* City */}
              <div>
                <label
                  htmlFor="city"
                  className="block text-sm font-semibold text-gray-700"
                >
                  City
                </label>

                <input
                  id="city"
                  name="city"
                  value={form.city}
                  onChange={updateField}
                  placeholder="Hyderabad"
                  className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3.5 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />
              </div>

              {/* State */}
              <div>
                <label
                  htmlFor="state"
                  className="block text-sm font-semibold text-gray-700"
                >
                  State
                </label>

                <input
                  id="state"
                  name="state"
                  value={form.state}
                  onChange={updateField}
                  placeholder="Telangana"
                  className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3.5 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />
              </div>

              {/* Country */}
              <div>
                <label
                  htmlFor="country"
                  className="block text-sm font-semibold text-gray-700"
                >
                  Country
                </label>

                <input
                  id="country"
                  name="country"
                  value={form.country}
                  onChange={updateField}
                  className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3.5 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />
              </div>

              {/* Postal Code */}
              <div>
                <label
                  htmlFor="postalCode"
                  className="block text-sm font-semibold text-gray-700"
                >
                  Postal Code
                </label>

                <input
                  id="postalCode"
                  name="postalCode"
                  value={form.postalCode}
                  onChange={updateField}
                  placeholder="500001"
                  className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3.5 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />
              </div>

              {/* Google Maps */}
              <div className="md:col-span-2">
                <label
                  htmlFor="googleMapsUrl"
                  className="block text-sm font-semibold text-gray-700"
                >
                  Google Maps URL
                </label>

                <input
                  id="googleMapsUrl"
                  name="googleMapsUrl"
                  value={form.googleMapsUrl}
                  onChange={updateField}
                  placeholder="https://maps.google.com/..."
                  className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3.5 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />
              </div>
            </div>
          </section>

          {/* Preview */}
          <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#111827] via-[#172554] to-[#312E81] p-6 text-white shadow-xl sm:p-8">
            <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-blue-500/20 blur-3xl" />

            <div className="relative">
              <p className="text-sm font-medium text-blue-300">
                Preview
              </p>

              <h2 className="mt-1 text-xl font-bold">
                Your Business Profile
              </h2>

              <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-center">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-2xl font-bold backdrop-blur">
                  {form.name
                    ? form.name.charAt(0).toUpperCase()
                    : "B"}
                </div>

                <div className="min-w-0">
                  <h3 className="truncate text-2xl font-bold">
                    {form.name || "Your Business Name"}
                  </h3>

                  <p className="mt-1 text-sm text-slate-300">
                    {selectedBusinessType?.icon}{" "}
                    {selectedBusinessType?.label}
                  </p>

                  <p className="mt-1 text-sm text-slate-400">
                    {form.city || "City"}
                    {form.state
                      ? `, ${form.state}`
                      : ""}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Actions */}
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <a
              href="/businesses"
              className="rounded-xl border border-gray-300 bg-white px-6 py-3.5 text-center text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              Cancel
            </a>

            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "Creating Business..."
                : "Create Business"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}