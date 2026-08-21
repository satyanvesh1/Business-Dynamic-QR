"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BUSINESS_TYPE_CONFIG,
  BusinessType,
} from "@/lib/business-types";

type Business = {
  id: string;
  name: string;
  businessType: string | null;
  description: string | null;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  website: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  postalCode: string | null;
  googleMapsUrl: string | null;
  isPublished: boolean;
};

const BUSINESS_TYPES = Object.entries(BUSINESS_TYPE_CONFIG) as [
  BusinessType,
  (typeof BUSINESS_TYPE_CONFIG)[BusinessType],
][];

export default function EditBusinessForm({
  business,
}: {
  business: Business;
}) {
  const router = useRouter();

  const initialBusinessType =
    business.businessType &&
    business.businessType in BUSINESS_TYPE_CONFIG
      ? (business.businessType as BusinessType)
      : "OTHER";

  const [form, setForm] = useState({
    name: business.name,
    businessType: initialBusinessType,
    description: business.description || "",
    phone: business.phone || "",
    whatsapp: business.whatsapp || "",
    email: business.email || "",
    website: business.website || "",
    address: business.address || "",
    city: business.city || "",
    state: business.state || "",
    country: business.country || "",
    postalCode: business.postalCode || "",
    googleMapsUrl: business.googleMapsUrl || "",
    isPublished: business.isPublished,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  function updateField(
    field: string,
    value: string | boolean
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        `/api/businesses/${business.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to update business"
        );
      }

      setMessage("Business updated successfully.");

      router.refresh();

      setTimeout(() => {
        router.push(`/businesses/${business.id}`);
      }, 700);
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  const selectedType =
    BUSINESS_TYPE_CONFIG[form.businessType];

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Information */}
      <section>
        <div>
          <p className="text-sm font-medium text-blue-600">
            Business Identity
          </p>

          <h2 className="mt-1 text-lg font-semibold text-gray-900">
            Basic Information
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Update your business name, type and description.
          </p>
        </div>

        <div className="mt-5 space-y-6">
          {/* Business Name */}
          <Input
            label="Business Name"
            value={form.name}
            onChange={(value) =>
              updateField("name", value)
            }
            required
          />

          {/* Business Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Business Type
            </label>

            <p className="mt-1 text-xs text-gray-500">
              Changing the business type changes the terminology
              and customer experience used in your workspace.
            </p>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {BUSINESS_TYPES.map(
                ([value, config]) => {
                  const selected =
                    form.businessType === value;

                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() =>
                        updateField(
                          "businessType",
                          value
                        )
                      }
                      className={`rounded-2xl border p-4 text-left transition ${
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
                          {config.icon}
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-bold text-gray-900">
                              {config.label}
                            </h3>

                            {selected && (
                              <span className="rounded-full bg-blue-600 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white">
                                Selected
                              </span>
                            )}
                          </div>

                          <p className="mt-1 text-xs leading-5 text-gray-500">
                            {config.experienceDescription}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                }
              )}
            </div>

            {/* Selected Type */}
            <div className="mt-4 rounded-xl bg-gray-50 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Selected Business Type
              </p>

              <div className="mt-2 flex items-center gap-3">
                <span className="text-xl">
                  {selectedType.icon}
                </span>

                <div>
                  <p className="text-sm font-bold text-gray-900">
                    {selectedType.label}
                  </p>

                  <p className="text-xs text-gray-500">
                    {selectedType.experienceLabel}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <TextArea
            label="Description"
            value={form.description}
            onChange={(value) =>
              updateField("description", value)
            }
          />
        </div>
      </section>

      {/* Contact */}
      <section>
        <h2 className="text-lg font-semibold text-gray-900">
          Contact Information
        </h2>

        <div className="mt-4 grid gap-5 md:grid-cols-2">
          <Input
            label="Phone"
            value={form.phone}
            onChange={(value) =>
              updateField("phone", value)
            }
          />

          <Input
            label="WhatsApp"
            value={form.whatsapp}
            onChange={(value) =>
              updateField("whatsapp", value)
            }
          />

          <Input
            label="Email"
            type="email"
            value={form.email}
            onChange={(value) =>
              updateField("email", value)
            }
          />

          <Input
            label="Website"
            value={form.website}
            onChange={(value) =>
              updateField("website", value)
            }
          />
        </div>
      </section>

      {/* Address */}
      <section>
        <h2 className="text-lg font-semibold text-gray-900">
          Address
        </h2>

        <div className="mt-4 grid gap-5">
          <Input
            label="Address"
            value={form.address}
            onChange={(value) =>
              updateField("address", value)
            }
          />

          <div className="grid gap-5 md:grid-cols-2">
            <Input
              label="City"
              value={form.city}
              onChange={(value) =>
                updateField("city", value)
              }
            />

            <Input
              label="State"
              value={form.state}
              onChange={(value) =>
                updateField("state", value)
              }
            />

            <Input
              label="Country"
              value={form.country}
              onChange={(value) =>
                updateField("country", value)
              }
            />

            <Input
              label="Postal Code"
              value={form.postalCode}
              onChange={(value) =>
                updateField("postalCode", value)
              }
            />
          </div>

          <Input
            label="Google Maps URL"
            value={form.googleMapsUrl}
            onChange={(value) =>
              updateField("googleMapsUrl", value)
            }
          />
        </div>
      </section>

      {/* Publishing */}
      <section>
        <h2 className="text-lg font-semibold text-gray-900">
          Publishing
        </h2>

        <label className="mt-4 flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            checked={form.isPublished}
            onChange={(event) =>
              updateField(
                "isPublished",
                event.target.checked
              )
            }
            className="h-4 w-4"
          />

          <span className="text-sm text-gray-700">
            Business is published
          </span>
        </label>
      </section>

      {/* Message */}
      {message && (
        <div className="rounded-lg bg-gray-100 px-4 py-3 text-sm text-gray-700">
          {message}
        </div>
      )}

      {/* Buttons */}
      <div className="flex gap-3 border-t pt-6">
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {loading
            ? "Saving..."
            : "Save Changes"}
        </button>

        <button
          type="button"
          onClick={() =>
            router.push(
              `/businesses/${business.id}`
            )
          }
          className="rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-medium hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

function Input({
  label,
  value,
  onChange,
  type = "text",
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>

      <input
        type={type}
        value={value}
        required={required}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />
    </div>
  );
}

function TextArea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>

      <textarea
        value={value}
        rows={4}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />
    </div>
  );
}