"use client";

import { FormEvent, Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

function TransportRequestForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const businessId = searchParams.get("businessId") ?? "";
  const productId = searchParams.get("productId") ?? "";
  const serviceName =
    searchParams.get("service") ?? "Transport Service";

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [pickupLocation, setPickupLocation] = useState("");
  const [destination, setDestination] = useState("");
  const [travelDate, setTravelDate] = useState("");
  const [travelTime, setTravelTime] = useState("");
  const [passengerCount, setPassengerCount] = useState("1");
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [requestId, setRequestId] = useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setLoading(true);
    setError("");

    if (!businessId || !productId) {
      setError("Transport service information is missing.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        "/api/transport-requests",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            businessId,
            productId,
            customerName,
            customerPhone,
            pickupLocation,
            destination,
            travelDate,
            travelTime,
            passengers: passengerCount,
            notes,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to submit request."
        );
      }

      setRequestId(data.request.id);
      setSuccess(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <main className="min-h-screen bg-gray-100 px-5 py-10">
        <div className="mx-auto max-w-xl">
          <div className="rounded-2xl bg-white p-8 text-center shadow-sm">

            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-4xl text-green-700">
              
            </div>

            <h1 className="mt-6 text-3xl font-bold text-black">
              Request Submitted
            </h1>

            <p className="mt-3 text-gray-700">
              Your transport service request has been
              successfully submitted.
            </p>

            <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50 p-5 text-left">

              <p className="text-xs font-semibold uppercase tracking-wider text-gray-600">
                Service
              </p>

              <p className="mt-1 text-lg font-bold text-black">
                {serviceName}
              </p>

              <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-gray-600">
                Request ID
              </p>

              <p className="mt-1 break-all text-sm font-medium text-black">
                {requestId}
              </p>

            </div>

            <p className="mt-6 text-sm text-gray-600">
              BMH Auto Services will contact you to confirm
              availability, pricing and booking details.
            </p>

            <button
              type="button"
              onClick={() => router.back()}
              className="mt-7 w-full rounded-xl bg-gray-900 px-5 py-3 font-semibold text-white transition hover:bg-gray-800"
            >
              
            </button>

          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 px-5 py-8">
      <div className="mx-auto max-w-2xl">

        <button
          type="button"
          onClick={() => router.back()}
          className="text-sm font-semibold text-blue-600 hover:underline"
        >
          
        </button>

        <div className="mt-5 rounded-2xl bg-white p-6 shadow-sm sm:p-8">

          <div className="text-center">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-3xl">
              
            </div>

            <h1 className="mt-5 text-3xl font-bold text-black">
              Request Transport Service
            </h1>

            <p className="mt-2 text-gray-700">
              Send your travel requirements to the business.
            </p>

            <div className="mt-5 rounded-xl bg-gray-50 p-4">

              <p className="text-xs font-semibold uppercase tracking-wider text-gray-600">
                Selected Service
              </p>

              <p className="mt-1 text-lg font-bold text-black">
                {serviceName}
              </p>

            </div>

          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-5"
          >

            {/* CUSTOMER NAME */}
            <div>
              <label className="block text-sm font-semibold text-black">
                Your Name
              </label>

              <input
                type="text"
                value={customerName}
                onChange={(event) =>
                  setCustomerName(event.target.value)
                }
                placeholder="Enter your name"
                required
                className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-black placeholder:text-gray-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* PHONE */}
            <div>
              <label className="block text-sm font-semibold text-black">
                Phone Number
              </label>

              <input
                type="tel"
                value={customerPhone}
                onChange={(event) =>
                  setCustomerPhone(event.target.value)
                }
                placeholder="Enter your phone number"
                required
                className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-black placeholder:text-gray-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* PICKUP */}
            <div>
              <label className="block text-sm font-semibold text-black">
                Pickup Location
              </label>

              <input
                type="text"
                value={pickupLocation}
                onChange={(event) =>
                  setPickupLocation(event.target.value)
                }
                placeholder="Where should we pick you up?"
                className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-black placeholder:text-gray-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* DESTINATION */}
            <div>
              <label className="block text-sm font-semibold text-black">
                Destination
              </label>

              <input
                type="text"
                value={destination}
                onChange={(event) =>
                  setDestination(event.target.value)
                }
                placeholder="Where are you going?"
                className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-black placeholder:text-gray-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* DATE + TIME */}
            <div className="grid gap-5 sm:grid-cols-2">

              <div>
                <label className="block text-sm font-semibold text-black">
                  Travel Date
                </label>

                <input
                  type="date"
                  value={travelDate}
                  onChange={(event) =>
                    setTravelDate(event.target.value)
                  }
                  className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-black outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-black">
                  Travel Time
                </label>

                <input
                  type="time"
                  value={travelTime}
                  onChange={(event) =>
                    setTravelTime(event.target.value)
                  }
                  className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-black outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

            </div>

            {/* PASSENGERS */}
            <div>
              <label className="block text-sm font-semibold text-black">
                Number of Passengers
              </label>

              <input
                type="number"
                min="1"
                max="100"
                value={passengerCount}
                onChange={(event) =>
                  setPassengerCount(event.target.value)
                }
                className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-black outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* NOTES */}
            <div>
              <label className="block text-sm font-semibold text-black">
                Additional Requirements
              </label>

              <textarea
                value={notes}
                onChange={(event) =>
                  setNotes(event.target.value)
                }
                placeholder="Any special requirements or instructions?"
                rows={4}
                className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-black placeholder:text-gray-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* ERROR */}
            {error ? (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {error}
              </div>
            ) : null}

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gray-900 px-5 py-4 text-base font-bold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "Submitting Request..."
                : "Request This Service"}
            </button>
            <p className="text-center text-xs text-gray-600">
              Your request will be sent to the transport
              service provider for confirmation.
            </p>

          </form>
        </div>

        <p className="py-6 text-center text-xs text-gray-500">
          Powered by Dynamic QR
        </p>

      </div>
    </main>
  );
}

export default function TransportRequestPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-gray-100 px-5">
          <div className="rounded-2xl bg-white px-8 py-10 text-center shadow-sm">
            <div className="text-3xl"></div>
            <p className="mt-4 font-semibold text-black">
              Loading transport service...
            </p>
          </div>
        </main>
      }
    >
      <TransportRequestForm />
    </Suspense>
  );
}

