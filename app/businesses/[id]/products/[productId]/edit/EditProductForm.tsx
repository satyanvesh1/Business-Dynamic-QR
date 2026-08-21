"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Product = {
  id: string;
  name: string;
  description: string | null;
  price: string | null;
  imageUrl: string | null;
  status: "ACTIVE" | "INACTIVE";

  serviceType: string | null;
  vehicleType: string | null;
  startingLocation: string | null;
  destination: string | null;
  route: string | null;
  availability: string | null;
};

type EditProductFormProps = {
  businessId: string;
  businessName: string;
  businessType: string | null;
  product: Product;
};

export default function EditProductForm({
  businessId,
  businessName,
  businessType,
  product,
}: EditProductFormProps) {
  const router = useRouter();

  const isTransport =
    businessType === "TRANSPORT_SERVICES";

  const [name, setName] = useState(product.name);
  const [description, setDescription] = useState(
    product.description ?? ""
  );
  const [price, setPrice] = useState(
    product.price ?? ""
  );
  const [imageUrl, setImageUrl] = useState(
    product.imageUrl ?? ""
  );

  const [status, setStatus] =
    useState<"ACTIVE" | "INACTIVE">(
      product.status
    );

  const [serviceType, setServiceType] =
    useState(product.serviceType ?? "");

  const [vehicleType, setVehicleType] =
    useState(product.vehicleType ?? "");

  const [startingLocation, setStartingLocation] =
    useState(product.startingLocation ?? "");

  const [destination, setDestination] =
    useState(product.destination ?? "");

  const [route, setRoute] =
    useState(product.route ?? "");

  const [availability, setAvailability] =
    useState(product.availability ?? "");

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");

    const trimmedName = name.trim();

    if (!trimmedName) {
      setError("Product name is required.");
      return;
    }

    if (price !== "") {
      const numericPrice = Number(price);

      if (
        !Number.isFinite(numericPrice) ||
        numericPrice < 0
      ) {
        setError("Please enter a valid price.");
        return;
      }
    }

    setSaving(true);

    try {
      const response = await fetch(
        `/api/businesses/${businessId}/products/${product.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: trimmedName,

            description:
              description.trim() === ""
                ? null
                : description.trim(),

            price:
              price === ""
                ? null
                : Number(price),

            imageUrl:
              imageUrl.trim() === ""
                ? null
                : imageUrl.trim(),

            status,

            serviceType:
              serviceType.trim() === ""
                ? null
                : serviceType.trim(),

            vehicleType:
              vehicleType.trim() === ""
                ? null
                : vehicleType.trim(),

            startingLocation:
              startingLocation.trim() === ""
                ? null
                : startingLocation.trim(),

            destination:
              destination.trim() === ""
                ? null
                : destination.trim(),

            route:
              route.trim() === ""
                ? null
                : route.trim(),

            availability:
              availability.trim() === ""
                ? null
                : availability.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Failed to update product."
        );
      }

      router.push(
        `/businesses/${businessId}/products`
      );

      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to update product."
      );

      setSaving(false);
    }
  }

  async function handleDelete() {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${product.name}"?\n\nThis action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    setError("");
    setDeleting(true);

    try {
      const response = await fetch(
        `/api/businesses/${businessId}/products/${product.id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Failed to delete product."
        );
      }

      router.push(
        `/businesses/${businessId}/products`
      );

      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to delete product."
      );

      setDeleting(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="mx-auto max-w-3xl px-6 py-8">

        <div className="mb-8">
          <Link
            href={`/businesses/${businessId}/products`}
            className="text-sm font-medium text-blue-600 hover:underline"
          >
            ← Back to Products
          </Link>

          <h1 className="mt-4 text-3xl font-bold text-gray-900">
            Edit {isTransport ? "Transport Service" : "Product"}
          </h1>

          <p className="mt-2 text-gray-600">
            Update {product.name} for {businessName}.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl bg-white p-8 shadow-sm"
        >
          <div className="space-y-6">

            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {error}
              </div>
            )}

            {/* NAME */}

            <div>
              <label
                htmlFor="name"
                className="block text-sm font-semibold text-gray-700"
              >
                {isTransport
                  ? "Service Name"
                  : "Product Name"}
              </label>

              <input
                id="name"
                type="text"
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                required
                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
              />
            </div>

            {/* DESCRIPTION */}

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-semibold text-gray-700"
              >
                Description
              </label>

              <textarea
                id="description"
                rows={4}
                value={description}
                onChange={(event) =>
                  setDescription(event.target.value)
                }
                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
              />
            </div>

            {/* PRICE */}

            <div>
              <label
                htmlFor="price"
                className="block text-sm font-semibold text-gray-700"
              >
                Price (₹)
              </label>

              <input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={price}
                onChange={(event) =>
                  setPrice(event.target.value)
                }
                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
              />

              <p className="mt-1 text-xs text-gray-500">
                Enter the exact selling or starting price.
              </p>
            </div>

            {/* TRANSPORT DETAILS */}

            {isTransport && (
              <div className="rounded-2xl border border-blue-200 bg-blue-50 p-6">
                <h2 className="text-lg font-bold text-gray-900">
                  Transport Details
                </h2>

                <p className="mt-1 text-sm text-gray-600">
                  These details are displayed to customers
                  on your Transport QR page.
                </p>

                <div className="mt-5 space-y-5">

                  <div>
                    <label
                      htmlFor="serviceType"
                      className="block text-sm font-semibold text-gray-700"
                    >
                      Service Type
                    </label>

                    <input
                      id="serviceType"
                      type="text"
                      value={serviceType}
                      onChange={(event) =>
                        setServiceType(event.target.value)
                      }
                      placeholder="Example: Airport Transfer"
                      className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="vehicleType"
                      className="block text-sm font-semibold text-gray-700"
                    >
                      Vehicle Type
                    </label>

                    <input
                      id="vehicleType"
                      type="text"
                      value={vehicleType}
                      onChange={(event) =>
                        setVehicleType(event.target.value)
                      }
                      placeholder="Example: Sedan / SUV / Auto"
                      className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-black"
                    />
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">

                    <div>
                      <label
                        htmlFor="startingLocation"
                        className="block text-sm font-semibold text-gray-700"
                      >
                        Starting Location
                      </label>

                      <input
                        id="startingLocation"
                        type="text"
                        value={startingLocation}
                        onChange={(event) =>
                          setStartingLocation(
                            event.target.value
                          )
                        }
                        placeholder="Example: Khammam"
                        className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-black"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="destination"
                        className="block text-sm font-semibold text-gray-700"
                      >
                        Destination
                      </label>

                      <input
                        id="destination"
                        type="text"
                        value={destination}
                        onChange={(event) =>
                          setDestination(
                            event.target.value
                          )
                        }
                        placeholder="Example: Hyderabad"
                        className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-black"
                      />
                    </div>

                  </div>

                  <div>
                    <label
                      htmlFor="route"
                      className="block text-sm font-semibold text-gray-700"
                    >
                      Route
                    </label>

                    <input
                      id="route"
                      type="text"
                      value={route}
                      onChange={(event) =>
                        setRoute(event.target.value)
                      }
                      placeholder="Example: Khammam → Hyderabad"
                      className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="availability"
                      className="block text-sm font-semibold text-gray-700"
                    >
                      Service Availability
                    </label>

                    <input
                      id="availability"
                      type="text"
                      value={availability}
                      onChange={(event) =>
                        setAvailability(
                          event.target.value
                        )
                      }
                      placeholder="Example: 24/7 or 7 AM - 10 PM"
                      className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-black"
                    />
                  </div>

                </div>
              </div>
            )}

            {/* IMAGE */}

            <div>
              <label
                htmlFor="imageUrl"
                className="block text-sm font-semibold text-gray-700"
              >
                Image URL
              </label>

              <input
                id="imageUrl"
                type="url"
                value={imageUrl}
                onChange={(event) =>
                  setImageUrl(event.target.value)
                }
                placeholder="https://example.com/image.jpg"
                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
              />
            </div>

            {/* AVAILABILITY */}

            <div>
              <label
                htmlFor="status"
                className="block text-sm font-semibold text-gray-700"
              >
                Availability
              </label>

              <select
                id="status"
                value={status}
                onChange={(event) =>
                  setStatus(
                    event.target.value as
                      | "ACTIVE"
                      | "INACTIVE"
                  )
                }
                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3"
              >
                <option value="ACTIVE">
                  Available
                </option>

                <option value="INACTIVE">
                  Unavailable
                </option>
              </select>
            </div>

            {/* BUTTONS */}

            <div className="flex flex-col gap-3 pt-4 sm:flex-row">

              <button
                type="submit"
                disabled={saving || deleting}
                className="rounded-lg bg-black px-6 py-3 text-sm font-semibold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving
                  ? "Saving..."
                  : "Save Changes"}
              </button>

              <Link
                href={`/businesses/${businessId}/products`}
                className="rounded-lg border border-gray-300 px-6 py-3 text-center text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </Link>

            </div>
          </div>
        </form>

        {/* DANGER ZONE */}

        <div className="mt-8 rounded-2xl border border-red-200 bg-white p-8 shadow-sm">

          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-red-500">
            Danger Zone
          </p>

          <h2 className="mt-2 text-xl font-bold text-gray-900">
            Delete {isTransport ? "Service" : "Product"}
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            Permanently delete this item from your
            business. This action cannot be undone.
          </p>

          <button
            type="button"
            onClick={handleDelete}
            disabled={saving || deleting}
            className="mt-5 rounded-lg border border-red-300 bg-red-50 px-6 py-3 text-sm font-semibold text-red-700 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {deleting
              ? "Deleting..."
              : `Delete ${isTransport ? "Service" : "Product"}`}
          </button>

        </div>

      </div>
    </main>
  );
}