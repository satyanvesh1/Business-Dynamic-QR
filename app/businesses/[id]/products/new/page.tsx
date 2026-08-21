"use client";

import { FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type BusinessInfo = {
  id: string;
  name: string;
  businessType: string;
};

export default function NewProductPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const businessId = params.id;

  const [business, setBusiness] =
    useState<BusinessInfo | null>(null);

  const [loadingBusiness, setLoadingBusiness] =
    useState(true);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const [serviceType, setServiceType] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [startingLocation, setStartingLocation] = useState("");
  const [destination, setDestination] = useState("");
  const [route, setRoute] = useState("");
  const [availability, setAvailability] = useState("");

  const [status, setStatus] = useState("ACTIVE");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /*
   * LOAD BUSINESS
   */
  useEffect(() => {
    async function loadBusiness() {
      try {
        const response = await fetch(
          `/api/businesses/${businessId}`
        );

        if (!response.ok) {
          throw new Error("Failed to load business");
        }

        const data = await response.json();

        setBusiness(data.business);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load business"
        );
      } finally {
        setLoadingBusiness(false);
      }
    }

    loadBusiness();
  }, [businessId]);

  const isTransport =
    business?.businessType === "TRANSPORT_SERVICES";

  /*
   * SUBMIT
   */
  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `/api/businesses/${businessId}/products`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            description,
            price,
            imageUrl,
            status,

            serviceType: isTransport
              ? serviceType
              : null,

            vehicleType: isTransport
              ? vehicleType
              : null,

            startingLocation: isTransport
              ? startingLocation
              : null,

            destination: isTransport
              ? destination
              : null,

            route: isTransport
              ? route
              : null,

            availability: isTransport
              ? availability
              : null,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to create service"
        );
      }

      router.push(
        `/businesses/${businessId}/products`
      );

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

  /*
   * LOADING
   */
  if (loadingBusiness) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="rounded-2xl bg-white px-8 py-6 text-center shadow-sm">
          <p className="text-sm font-medium text-gray-600">
            Loading business...
          </p>
        </div>
      </main>
    );
  }

  /*
   * PAGE
   */
  return (
    <main className="min-h-screen bg-gray-100">
      <div className="mx-auto max-w-3xl px-6 py-10">

        {/* BACK */}
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

        {/* CARD */}
        <div className="mt-6 rounded-2xl bg-white p-8 shadow-sm">

          {/* HEADER */}
          <div>
            <div className="flex flex-wrap items-center gap-3">

              <h1 className="text-3xl font-bold text-gray-900">
                {isTransport
                  ? "Add Transport Service"
                  : "Add Product"}
              </h1>

              {isTransport && (
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                  🚗 Transport Services
                </span>
              )}

            </div>

            <p className="mt-2 text-gray-500">
              {isTransport
                ? "Add a transport service that customers can view through your QR experience."
                : "Add a new product to your business."}
            </p>

            {business && (
              <p className="mt-2 text-sm font-medium text-gray-700">
                Business: {business.name}
              </p>
            )}
          </div>

          {/* FORM */}
          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-6"
          >

            {/* TRANSPORT DETAILS */}
            {isTransport && (
              <div className="rounded-2xl border border-blue-200 bg-blue-50 p-6">

                <h2 className="text-xl font-bold text-gray-900">
                  🚗 Transport Service Details
                </h2>

                <p className="mt-1 text-sm text-gray-600">
                  Add the information customers need to
                  understand and book this service.
                </p>

                <div className="mt-6 space-y-5">

                  {/* SERVICE TYPE */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900">
                      Service Type
                    </label>

                    <select
                      value={serviceType}
                      onChange={(event) =>
                        setServiceType(
                          event.target.value
                        )
                      }
                      className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-black outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    >
                      <option value="">
                        Select service type
                      </option>

                      <option value="Taxi">
                        Taxi
                      </option>

                      <option value="Cab">
                        Cab
                      </option>

                      <option value="Bus">
                        Bus
                      </option>

                      <option value="Rental">
                        Rental
                      </option>

                      <option value="Passenger Transport">
                        Passenger Transport
                      </option>

                      <option value="Logistics">
                        Logistics
                      </option>

                      <option value="Travel">
                        Travel
                      </option>

                      <option value="Other">
                        Other
                      </option>
                    </select>
                  </div>

                  {/* VEHICLE TYPE */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900">
                      Vehicle Type
                    </label>

                    <input
                      type="text"
                      value={vehicleType}
                      onChange={(event) =>
                        setVehicleType(
                          event.target.value
                        )
                      }
                      placeholder="Example: Sedan, SUV, Bus"
                      className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-black placeholder:text-gray-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  {/* STARTING LOCATION */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900">
                      Starting Location
                    </label>

                    <input
                      type="text"
                      value={startingLocation}
                      onChange={(event) =>
                        setStartingLocation(
                          event.target.value
                        )
                      }
                      placeholder="Example: Khammam"
                      className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-black placeholder:text-gray-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  {/* DESTINATION */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900">
                      Destination
                    </label>

                    <input
                      type="text"
                      value={destination}
                      onChange={(event) =>
                        setDestination(
                          event.target.value
                        )
                      }
                      placeholder="Example: Hyderabad"
                      className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-black placeholder:text-gray-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  {/* ROUTE */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900">
                      Route
                    </label>

                    <input
                      type="text"
                      value={route}
                      onChange={(event) =>
                        setRoute(
                          event.target.value
                        )
                      }
                      placeholder="Example: Khammam → Suryapet → Hyderabad"
                      className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-black placeholder:text-gray-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  {/* SERVICE AVAILABILITY */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900">
                      Service Availability
                    </label>

                    <input
                      type="text"
                      value={availability}
                      onChange={(event) =>
                        setAvailability(
                          event.target.value
                        )
                      }
                      placeholder="Example: Daily, 6 AM - 10 PM"
                      className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-black placeholder:text-gray-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                </div>
              </div>
            )}

            {/* SERVICE / PRODUCT NAME */}
            <div>
              <label className="block text-sm font-medium text-gray-900">
                {isTransport
                  ? "Service Name"
                  : "Product Name"}
              </label>

              <input
                type="text"
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                placeholder={
                  isTransport
                    ? "Example: Khammam to Hyderabad Cab Service"
                    : "Example: Chicken Biryani"
                }
                required
                className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-black placeholder:text-gray-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* DESCRIPTION */}
            <div>
              <label className="block text-sm font-medium text-gray-900">
                Description
              </label>

              <textarea
                value={description}
                onChange={(event) =>
                  setDescription(
                    event.target.value
                  )
                }
                placeholder={
                  isTransport
                    ? "Describe the transport service, route, vehicle, availability, and other important details..."
                    : "Describe your product..."
                }
                rows={5}
                className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-black placeholder:text-gray-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* PRICE */}
            <div>
              <label className="block text-sm font-medium text-gray-900">
                Price (₹)
              </label>

              <input
                type="number"
                min="0"
                step="0.01"
                value={price}
                onChange={(event) =>
                  setPrice(event.target.value)
                }
                placeholder={
                  isTransport ? "1800" : "299"
                }
                className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-black placeholder:text-gray-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

              {isTransport && (
                <p className="mt-2 text-xs text-gray-500">
                  Enter the starting or fixed price for
                  this transport service.
                </p>
              )}
            </div>

            {/* IMAGE */}
            <div>
              <label className="block text-sm font-medium text-gray-900">
                {isTransport
                  ? "Service Image URL"
                  : "Product Image URL"}
              </label>

              <input
                type="url"
                value={imageUrl}
                onChange={(event) =>
                  setImageUrl(
                    event.target.value
                  )
                }
                placeholder={
                  isTransport
                    ? "https://example.com/transport-service.jpg"
                    : "https://example.com/product.jpg"
                }
                className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-black placeholder:text-gray-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

              <p className="mt-2 text-xs text-gray-500">
                Optional. Leave blank if you don't have an
                image.
              </p>
            </div>

            {/* AVAILABILITY */}
            <div>
              <label className="block text-sm font-medium text-gray-900">
                Availability
              </label>

              <select
                value={status}
                onChange={(event) =>
                  setStatus(event.target.value)
                }
                className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-black outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option
                  value="ACTIVE"
                  className="text-black"
                >
                  Available
                </option>

                <option
                  value="INACTIVE"
                  className="text-black"
                >
                  Unavailable
                </option>
              </select>
            </div>

            {/* ERROR */}
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* BUTTONS */}
            <div className="flex flex-col gap-3 border-t pt-6 sm:flex-row">

              <button
                type="submit"
                disabled={loading}
                className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading
                  ? isTransport
                    ? "Creating Service..."
                    : "Creating Product..."
                  : isTransport
                    ? "Create Service"
                    : "Create Product"}
              </button>

              <button
                type="button"
                disabled={loading}
                onClick={() =>
                  router.push(
                    `/businesses/${businessId}`
                  )
                }
                className="rounded-lg border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
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