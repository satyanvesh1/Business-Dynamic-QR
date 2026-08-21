
import Link from "next/link";
import { getServerSession } from "next-auth";

import StatusControl from "./StatusControl";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export default async function TransportRequestsPage({
  params,
}: PageProps) {
  const { id } = await params;

  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return null;
  }

  const business = await prisma.business.findFirst({
    where: {
      id,
      owner: {
        email: session.user.email,
      },
    },
    include: {
      transportRequests: {
        include: {
          product: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!business) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-100 px-6">
        <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-black">
            Business Not Found
          </h1>

          <p className="mt-2 text-sm text-gray-600">
            The business could not be found.
          </p>

          <Link
            href="/businesses"
            className="mt-6 inline-block rounded-lg bg-black px-5 py-3 text-sm font-semibold text-white"
          >
            Back to Businesses
          </Link>
        </div>
      </main>
    );
  }

  const requests = business.transportRequests;

  const requestedCount = requests.filter(
    (request) => request.status === "REQUESTED"
  ).length;

  const confirmedCount = requests.filter(
    (request) => request.status === "CONFIRMED"
  ).length;

  const completedCount = requests.filter(
    (request) => request.status === "COMPLETED"
  ).length;

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="mx-auto max-w-7xl px-6 py-8">

        {/* HEADER */}

        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <Link
              href={`/businesses/${business.id}`}
              className="text-sm font-medium text-blue-600 hover:underline"
            >
              ← Back to Business
            </Link>

            <h1 className="mt-4 text-3xl font-bold text-black">
              Transport Requests
            </h1>

            <p className="mt-2 text-gray-600">
              Manage customer transport service requests for{" "}
              {business.name}.
            </p>
          </div>

          <Link
            href={`/businesses/${business.id}/products`}
            className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-black hover:bg-gray-50"
          >
            View Transport Services
          </Link>

        </div>

        {/* SUMMARY */}

        <div className="mt-8 grid gap-4 sm:grid-cols-4">

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-gray-600">
              Total Requests
            </p>

            <p className="mt-2 text-3xl font-bold text-black">
              {requests.length}
            </p>
          </div>

          <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-5 shadow-sm">
            <p className="text-sm font-medium text-yellow-700">
              Requested
            </p>

            <p className="mt-2 text-3xl font-bold text-yellow-800">
              {requestedCount}
            </p>
          </div>

          <div className="rounded-2xl border border-green-200 bg-green-50 p-5 shadow-sm">
            <p className="text-sm font-medium text-green-700">
              Confirmed
            </p>

            <p className="mt-2 text-3xl font-bold text-green-800">
              {confirmedCount}
            </p>
          </div>

          <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5 shadow-sm">
            <p className="text-sm font-medium text-blue-700">
              Completed
            </p>

            <p className="mt-2 text-3xl font-bold text-blue-800">
              {completedCount}
            </p>
          </div>

        </div>

        {/* REQUESTS */}

        {requests.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-sm">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-3xl">
              🚕
            </div>

            <h2 className="mt-5 text-xl font-bold text-black">
              No transport requests yet
            </h2>

            <p className="mt-2 text-sm text-gray-600">
              Customer requests will appear here when they
              submit a transport booking through your QR
              experience.
            </p>

          </div>
        ) : (
          <div className="mt-8 space-y-5">

            {requests.map((request) => (
              <article
                key={request.id}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
              >

                {/* CUSTOMER */}

                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                  <div>
                    <h2 className="text-xl font-bold text-black">
                      {request.customerName}
                    </h2>

                    <a
                      href={`tel:${request.customerPhone}`}
                      className="mt-1 inline-block text-sm font-medium text-blue-600 hover:underline"
                    >
                      📞 {request.customerPhone}
                    </a>
                  </div>

                  {/* STATUS CONTROL */}

                  <StatusControl
                    requestId={request.id}
                    initialStatus={request.status}
                  />

                </div>

                {/* REQUEST DETAILS */}

                <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                  <div className="rounded-xl bg-gray-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Service
                    </p>

                    <p className="mt-1 font-bold text-black">
                      {request.product.name}
                    </p>
                  </div>

                  <div className="rounded-xl bg-gray-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Pickup
                    </p>

                    <p className="mt-1 font-bold text-black">
                      {request.pickupLocation || "Not provided"}
                    </p>
                  </div>

                  <div className="rounded-xl bg-gray-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Destination
                    </p>

                    <p className="mt-1 font-bold text-black">
                      {request.destination || "Not provided"}
                    </p>
                  </div>

                  <div className="rounded-xl bg-gray-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Passengers
                    </p>

                    <p className="mt-1 font-bold text-black">
                      {request.passengerCount || 1}
                    </p>
                  </div>

                </div>

                {/* DATE AND TIME */}

                <div className="mt-4 grid gap-4 sm:grid-cols-2">

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Travel Date
                    </p>

                    <p className="mt-1 text-sm font-medium text-black">
                      {request.travelDate || "Not provided"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Travel Time
                    </p>

                    <p className="mt-1 text-sm font-medium text-black">
                      {request.travelTime || "Not provided"}
                    </p>
                  </div>

                </div>

                {/* NOTES */}

                {request.notes ? (
                  <div className="mt-4 rounded-xl border border-gray-200 bg-white p-4">

                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Customer Requirements
                    </p>

                    <p className="mt-2 text-sm leading-6 text-black">
                      {request.notes}
                    </p>

                  </div>
                ) : null}

                {/* FOOTER */}

                <div className="mt-5 flex flex-col gap-3 border-t border-gray-200 pt-5 sm:flex-row sm:items-center sm:justify-between">

                  <div>

                    <p className="text-xs text-gray-500">
                      Request ID
                    </p>

                    <p className="mt-1 break-all text-xs font-medium text-black">
                      {request.id}
                    </p>

                    <p className="mt-2 text-xs text-gray-500">
                      Submitted {formatDate(request.createdAt)}
                    </p>

                  </div>

                  <div className="flex flex-col gap-2 sm:flex-row">

                    <a
                      href={`tel:${request.customerPhone}`}
                      className="rounded-lg bg-gray-900 px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-gray-800"
                    >
                      📞 Call Customer
                    </a>

                    <a
                      href={`https://wa.me/${request.customerPhone.replace(
                        /[^0-9]/g,
                        ""
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg bg-green-600 px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-green-700"
                    >
                      💬 WhatsApp Customer
                    </a>

                  </div>

                </div>

              </article>
            ))}

          </div>
        )}

        {/* FOOTER */}

        <footer className="py-8 text-center">
          <p className="text-xs text-gray-500">
            Powered by Dynamic QR
          </p>
        </footer>

      </div>
    </main>
  );
}