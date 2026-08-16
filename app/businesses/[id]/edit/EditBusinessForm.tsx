"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type Business = {
  id: string;
  name: string;
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

export default function EditBusinessForm({
  business,
}: {
  business: Business;
}) {
  const router = useRouter();

  const [form, setForm] = useState({
    name: business.name,
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

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Information */}
      <section>
        <h2 className="text-lg font-semibold text-gray-900">
          Basic Information
        </h2>

        <div className="mt-4 grid gap-5">
          <Input
            label="Business Name"
            value={form.name}
            onChange={(value) =>
              updateField("name", value)
            }
            required
          />

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
          {loading ? "Saving..." : "Save Changes"}
        </button>

        <button
          type="button"
          onClick={() =>
            router.push(`/businesses/${business.id}`)
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