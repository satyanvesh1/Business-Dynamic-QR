import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import DeleteBusinessButton from "@/app/components/DeleteBusinessButton";
import TransportRequestStatus from "@/app/components/TransportRequestStatus";
import { getBusinessTypeConfig } from "@/lib/business-types";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

const businessTypeLabels: Record<string, string> = {
  RESTAURANT: "Restaurant",
  HOTEL: "Hotel",
  EVENT_ORGANIZER: "Event Organizer",
  EVENT: "Event",
  PROMOTION: "Promotion",
  MARKETING: "Marketing",
  SHOPPING_MALL: "Shopping Mall",
  THEATER: "Theater",
  SHOWROOM: "Showroom",
  REAL_ESTATE: "Real Estate",
  CONVENTION: "Convention Center",
  CONVENTION_CENTER: "Convention Center",
  RETAIL: "Retail",
  EDUCATION: "Education",
  HEALTHCARE: "Healthcare",
  SALON: "Salon",
  GYM: "Gym",
  OTHER: "Other",
};

const businessTypeIcons: Record<string, string> = {
  RESTAURANT: "ðŸ½ï¸",
  HOTEL: "ðŸ¨",
  EVENT_ORGANIZER: "ðŸŽª",
  EVENT: "ðŸŽŸï¸",
  PROMOTION: "ðŸŽ",
  MARKETING: "ðŸ“£",
  SHOPPING_MALL: "ðŸ›ï¸",
  THEATER: "ðŸŽ¬",
  SHOWROOM: "ðŸš—",
  REAL_ESTATE: "ðŸ ",
  CONVENTION: "ðŸ¢",
  CONVENTION_CENTER: "ðŸ¢",
  RETAIL: "ðŸ›’",
  EDUCATION: "ðŸŽ“",
  HEALTHCARE: "ðŸ¥",
  SALON: "ðŸ’‡",
  GYM: "ðŸ‹ï¸",
  OTHER: "",
};

function getBusinessTypeLabel(type: string) {
  return businessTypeLabels[type] || "Other";
}

function getBusinessTypeIcon(type: string) {
  return businessTypeIcons[type] || "";
}

export default async function BusinessDetailsPage({
  params,
}: PageProps) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login");
  }

  const { id } = await params;

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
          product: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },

      products: {
        orderBy: {
          createdAt: "desc",
        },
        take: 6,
      },

      qrCodes: {
        include: {
          _count: {
            select: {
              scans: true,
            },
          },
        },

        orderBy: {
          createdAt: "desc",
        },
      },

      _count: {
        select: {
          products: true,
          qrCodes: true,
        },
      },
    },
  });

  if (!business) {
    notFound();
  }

  const totalScans = business.qrCodes.reduce(
    (total, qrCode) => total + qrCode._count.scans,
    0
  );

  const activeQrCodes = business.qrCodes.filter(
    (qrCode) => qrCode.status === "ACTIVE"
  ).length;

  const activeProducts = business.products.filter(
    (product) => product.status === "ACTIVE"
  ).length;

  const location =
    [business.city, business.state, business.country]
      .filter(Boolean)
      .join(", ") || "Location not specified";

  const businessType = String(business.businessType || "OTHER");

  const initial = business.name.charAt(0).toUpperCase();

  const typeConfig = getBusinessTypeConfig(business.businessType);

  const businessTypeLabel = typeConfig.label;
  const businessTypeIcon = typeConfig.icon;

  return (
    <main className="min-h-screen bg-[#F5F7FB]">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-[1500px] px-6 py-5 lg:px-10">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <Link
                href="/businesses"
                className="inline-flex items-center text-sm font-semibold text-blue-600 transition hover:text-blue-800"
              >
                Back to All Businesses
              </Link>

              <div className="mt-3 flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                  {business.name}
                </h1>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    business.isPublished
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {business.isPublished ? "Published" : "Draft"}
                </span>

                <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                  <span>{typeConfig.icon}</span>
                  {typeConfig.label}
                </span>
              </div>

              <p className="mt-1 text-sm text-gray-500">
                {location}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href={`/businesses/${business.id}/edit`}
                className="rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50"
              >
                Edit Business
              </Link>

              <Link
                href={`/businesses/${business.id}/qr-codes/new`}
                className="rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:-translate-y-0.5 hover:shadow-xl"
              >
                + Create {typeConfig.qrLabel}
              </Link>
            </div>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-[1500px] px-6 py-8 lg:px-10">
        {/* Business Hero */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#111827] via-[#172554] to-[#312E81] p-8 text-white shadow-xl">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl" />

          <div className="absolute -bottom-24 right-32 h-64 w-64 rounded-full bg-violet-500/20 blur-3xl" />

          <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-5">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-white/10 text-3xl font-bold shadow-lg backdrop-blur">
                {initial}
              </div>

              <div>
                <p className="text-sm font-medium text-blue-300">
                  {typeConfig.experienceLabel}
                </p>

                <h2 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">
                  {business.name}
                </h2>

                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-sm font-semibold text-white backdrop-blur">
                    <span>{typeConfig.icon}</span>
                    {typeConfig.label}
                  </span>

                  <span className="text-sm text-slate-300">
                    {location}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <HeroMetric
                label={typeConfig.contentPlural}
                value={business._count.products}
              />

              <HeroMetric
                label="QR Codes"
                value={business._count.qrCodes}
              />

              <HeroMetric
                label="Active QR"
                value={activeQrCodes}
              />

              <HeroMetric
                label="Scans"
                value={totalScans}
              />
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Total Scans"
            value={totalScans}
            description="Customer interactions"
            icon="📈"
            href={`/businesses/${business.id}/analytics`}
          />

          <StatCard
            label={typeConfig.contentPlural}
            value={business._count.products}
            description={`${activeProducts} currently active`}
            icon="🛠️"
            href={`/businesses/${business.id}/products`}
          />

          <StatCard
            label="QR Codes"
            value={business._count.qrCodes}
            description={`${activeQrCodes} currently active`}
            icon="📱"
            href={`/businesses/${business.id}/qr-codes`}
          />

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Business Status
                </p>

                <p className="mt-2 text-2xl font-bold text-gray-900">
                  {business.isPublished ? "Published" : "Draft"}
                </p>

                <p className="mt-2 text-xs text-gray-500">
                  {business.isPublished
                    ? `${typeConfig.experienceLabel} is available`
                    : "Business is not published"}
                </p>
              </div>

              <div
                className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                  business.isPublished
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {business.isPublished ? "" : ""}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="mt-8 grid gap-8 xl:grid-cols-[1fr_360px]">
          {/* Left */}
          <div className="space-y-8">
            {/* Quick Actions */}
            <section>
              <div className="mb-5">
                <p className="text-sm font-medium text-blue-600">
                  Workspace
                </p>

                <h2 className="mt-1 text-2xl font-bold text-gray-900">
                  Quick Actions
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Manage the most important parts of your business.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <ActionCard
                  href={`/businesses/${business.id}/products`}
                  icon="🛠️"
                  title={typeConfig.contentPlural}
                  description={`Manage your ${typeConfig.contentPlural.toLowerCase()}`}
                />

                <ActionCard
                  href={`/businesses/${business.id}/qr-codes`}
                  icon="📱"
                  title={typeConfig.qrLabel}
                  description={typeConfig.qrDescription}
                />

                <ActionCard
                  href={`/businesses/${business.id}/analytics`}
                  icon="📊"
                  title="Analytics"
                  description="View scan activity"
                />

                <ActionCard
                  href={`/businesses/${business.id}/edit`}
                  icon="⚙️"
                  title="Settings"
                  description="Business settings"
                />
              </div>
            </section>

            {/* QR Performance */}
            <section>
              <div className="mb-5 flex items-end justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">
                    {typeConfig.experienceLabel}
                  </p>

                  <h2 className="mt-1 text-2xl font-bold text-gray-900">
                    QR Code Performance
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Monitor your dynamic QR codes and their scans.
                  </p>
                </div>

                <Link
                  href={`/businesses/${business.id}/qr-codes`}
                  className="text-sm font-semibold text-blue-600 hover:text-blue-800"
                >
                  View All
                </Link>
              </div>

              {business.qrCodes.length === 0 ? (
                <EmptyCard
                  title={`No ${typeConfig.qrLabel} yet`}
                  description={`Create your first ${typeConfig.qrLabel} to start tracking customer interactions.`}
                  actionText={`Create ${typeConfig.qrLabel}`}
                  href={`/businesses/${business.id}/qr-codes/new`}
                />
              ) : (
                <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                  <div className="divide-y divide-gray-100">
                    {business.qrCodes.slice(0, 5).map((qrCode) => (
                      <div
                        key={qrCode.id}
                        className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="flex min-w-0 items-center gap-4">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-lg font-bold text-gray-700">
                            
                          </div>

                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="font-semibold text-gray-900">
                                {qrCode.name}
                              </h3>

                              <span
                                className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                                  qrCode.status === "ACTIVE"
                                    ? "bg-emerald-50 text-emerald-700"
                                    : "bg-gray-100 text-gray-500"
                                }`}
                              >
                                {qrCode.status}
                              </span>
                            </div>

                            <p className="mt-1 truncate text-xs text-gray-500">
                              {qrCode.code}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-xl font-bold text-gray-900">
                              {qrCode._count.scans.toLocaleString()}
                            </p>

                            <p className="text-[10px] font-medium uppercase tracking-wide text-gray-400">
                              Scans
                            </p>
                          </div>

                          <Link
                            href={`/businesses/${business.id}/qr-codes/${qrCode.id}`}
                            className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                          >
                            View
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* Content */}
            <section>
              <div className="mb-5 flex items-end justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">
                    {typeConfig.experienceLabel}
                  </p>

                  <h2 className="mt-1 text-2xl font-bold text-gray-900">
                    {typeConfig.contentPlural}
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    {typeConfig.contentPlural} available to customers.
                  </p>
                </div>

                <Link
                  href={`/businesses/${business.id}/products`}
                  className="text-sm font-semibold text-blue-600 hover:text-blue-800"
                >
                  View All
                </Link>
              </div>

              {business.products.length === 0 ? (
                <EmptyCard
                  title={`No ${typeConfig.contentPlural.toLowerCase()} yet`}
                  description={`Add ${typeConfig.contentPlural.toLowerCase()} to build your customer-facing experience.`}
                  actionText={`Add ${typeConfig.contentLabel}`}
                  href={`/businesses/${business.id}/products/new`}
                />
              ) : (
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {business.products.map((product) => (
                    <div
                      key={product.id}
                      className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="font-bold text-gray-900">
                          {product.name}
                        </h3>

                        <span
                          className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                            product.status === "ACTIVE"
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {product.status}
                        </span>
                      </div>

                      <p className="mt-3 text-xl font-bold text-gray-900">
                        {product.price !== null
                          ? `INR ${Number(product.price).toFixed(2)}`
                          : "Price not set"}
                      </p>

                      {product.description && (
                        <p className="mt-2 line-clamp-2 text-sm leading-5 text-gray-500">
                          {product.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Right Sidebar */}
          <aside className="space-y-5">
            {/* Business Information */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">
                    Profile
                  </p>

                  <h2 className="mt-1 text-lg font-bold text-gray-900">
                    Business Information
                  </h2>
                </div>

                <Link
                  href={`/businesses/${business.id}/edit`}
                  className="text-sm font-semibold text-blue-600 hover:text-blue-800"
                >
                  Edit
                </Link>
              </div>

              <div className="mt-6 space-y-5">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                    Business Type
                  </p>

                  <div className="mt-2 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-lg">
                      {typeConfig.icon}
                    </div>

                    <div>
                      <p className="text-sm font-bold text-gray-900">
                        {typeConfig.label}
                      </p>

                      <p className="text-xs text-gray-500">
                        {typeConfig.experienceLabel}
                      </p>
                    </div>
                  </div>
                </div>

                <InfoRow
                  label="Location"
                  value={location}
                />

                <InfoRow
                  label="Phone"
                  value={business.phone || "Not provided"}
                />

                <InfoRow
                  label="WhatsApp"
                  value={business.whatsapp || "Not provided"}
                />

                <InfoRow
                  label="Email"
                  value={business.email || "Not provided"}
                />

                <InfoRow
                  label="Website"
                  value={business.website || "Not provided"}
                />

                {business.address && (
                  <InfoRow
                    label="Address"
                    value={business.address}
                  />
                )}

                {business.postalCode && (
                  <InfoRow
                    label="Postal Code"
                    value={business.postalCode}
                  />
                )}

                {business.googleMapsUrl && (
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                      Google Maps
                    </p>

                    <a
                      href={business.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-flex text-sm font-semibold text-blue-600 hover:text-blue-800"
                    >
                      Open
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            {business.description && (
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <p className="text-sm font-medium text-blue-600">
                  About
                </p>

                <h2 className="mt-1 text-lg font-bold text-gray-900">
                  Business Description
                </h2>

                <p className="mt-4 text-sm leading-6 text-gray-600">
                  {business.description}
                </p>
              </div>
            )}

            {/* Customer Experience */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-violet-700 p-6 text-white shadow-xl">
              <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />

              <div className="relative">
                <p className="text-sm font-medium text-blue-100">
                  Customer Experience
                </p>

                <h2 className="mt-1 text-xl font-bold">
                  {typeConfig.experienceLabel}
                </h2>

                <p className="mt-2 text-sm leading-5 text-blue-100">
                  {typeConfig.experienceDescription}
                </p>

                <div className="mt-5">
                  <Link
                    href={`/businesses/${business.id}/qr-codes`}
                    className="inline-flex rounded-xl bg-white px-4 py-3 text-sm font-semibold text-gray-900 transition hover:bg-gray-100"
                  >
                    Manage {typeConfig.qrLabel} 
                  </Link>
                </div>
              </div>
            </div>

            {/* Business ID */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-400">
                Business ID
              </p>

              <p className="mt-3 break-all rounded-xl bg-gray-50 p-3 font-mono text-xs text-gray-600">
                {business.id}
              </p>
            </div>

            {/* TRANSPORT REQUESTS */}
            {business.businessType === "OTHER" || business.businessType === "RETAIL" || business.businessType === "SHOWROOM" || business.businessType === "REAL_ESTATE" || business.businessType === "CONVENTION" ? null : (
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.15em] text-blue-600">
                      Customer Requests
                    </p>
                    <h2 className="mt-1 text-xl font-bold text-gray-900">
                      Transport Requests
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                      Requests submitted by customers through your transport QR.
                    </p>
                  </div>
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
                    {business.transportRequests.length}
                  </span>
                </div>

                {business.transportRequests.length === 0 ? (
                  <div className="mt-5 rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center">
                    <p className="font-semibold text-gray-700">
                      No transport requests yet
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      Customer requests will appear here after they submit the transport form.
                    </p>
                  </div>
                ) : (
                  <div className="mt-5 space-y-4">
                    {business.transportRequests.map((request) => (
                      <div key={request.id} className="rounded-xl border border-gray-200 p-5">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">
                              {request.customerName}
                            </h3>
                            <p className="mt-1 text-sm font-medium text-blue-600">
                              {request.product.name}
                            </p>
                            <p className="mt-2 text-sm text-gray-600">
                              Phone: {request.customerPhone}
                            </p>
                          </div>
                          <span className="inline-flex w-fit rounded-full bg-yellow-50 px-3 py-1 text-xs font-bold text-yellow-700">
                            {request.status}
                          </span>
                        </div>

                        <div className="mt-4 grid gap-3 sm:grid-cols-2">
                          <div className="rounded-lg bg-gray-50 p-3">
                            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                              Pickup
                            </p>
                            <p className="mt-1 text-sm font-semibold text-gray-800">
                              {request.pickupLocation || "Not provided"}
                            </p>
                          </div>

                          <div className="rounded-lg bg-gray-50 p-3">
                            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                              Destination
                            </p>
                            <p className="mt-1 text-sm font-semibold text-gray-800">
                              {request.destination || "Not provided"}
                            </p>
                          </div>

                          <div className="rounded-lg bg-gray-50 p-3">
                            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                              Travel Date
                            </p>
                            <p className="mt-1 text-sm font-semibold text-gray-800">
                              {request.travelDate || "Not provided"}
                            </p>
                          </div>

                          <div className="rounded-lg bg-gray-50 p-3">
                            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                              Passengers
                            </p>
                            <p className="mt-1 text-sm font-semibold text-gray-800">
                              {request.passengerCount ?? "Not provided"}
                            </p>
                          </div>
                        </div>

                        {request.travelTime || request.notes ? (
                          <div className="mt-3 rounded-lg bg-gray-50 p-3 text-sm text-gray-700">
                            {request.travelTime ? <p><strong>Time:</strong> {request.travelTime}</p> : null}
                            {request.notes ? <p className="mt-1"><strong>Notes:</strong> {request.notes}</p> : null}
                          </div>
                        ) : null}

                        <p className="mt-4 text-xs text-gray-400">
                          Request ID: {request.id}
                        </p>

                        <TransportRequestStatus
                          requestId={request.id}
                          currentStatus={request.status}
                        customerPhone={request.customerPhone}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Danger Zone */}
            <div className="rounded-2xl border border-red-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-red-500">
                Danger Zone
              </p>

              <h2 className="mt-1 text-lg font-bold text-gray-900">
                Delete Business
              </h2>

              <p className="mt-2 text-sm leading-5 text-gray-500">
                Permanently delete this business and all of its products, QR
                codes, and scan records.
              </p>

              <div className="mt-5">
                <DeleteBusinessButton
                  businessId={business.id}
                  businessName={business.name}
                />
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

function HeroMetric({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur">
      <p className="text-[10px] font-medium uppercase tracking-wide text-slate-300">
        {label}
      </p>

      <p className="mt-1 text-xl font-bold">
        {value.toLocaleString()}
      </p>
    </div>
  );
}

function StatCard({
  label,
  value,
  description,
  icon,
  href,
}: {
  label: string;
  value: number;
  description: string;
  icon: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">
            {label}
          </p>

          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
            {value.toLocaleString()}
          </p>

          <p className="mt-2 text-xs text-gray-500">
            {description}
          </p>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-lg text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
          {icon}
        </div>
      </div>
    </Link>
  );
}

function ActionCard({
  href,
  icon,
  title,
  description,
}: {
  href: string;
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 text-lg font-bold text-gray-700 transition group-hover:bg-blue-600 group-hover:text-white">
        {icon}
      </div>

      <h3 className="mt-4 font-bold text-gray-900">
        {title}
      </h3>

      <p className="mt-1 text-sm text-gray-500">
        {description}
      </p>

      <p className="mt-4 text-sm font-semibold text-blue-600">
        Open
      </p>
    </Link>
  );
}

function EmptyCard({
  title,
  description,
  actionText,
  href,
}: {
  title: string;
  description: string;
  actionText: string;
  href: string;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center shadow-sm">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-xl font-bold text-blue-600">
        +
      </div>

      <h3 className="mt-4 font-bold text-gray-900">
        {title}
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
        {description}
      </p>

      <Link
        href={href}
        className="mt-5 inline-flex rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
      >
        {actionText}
      </Link>
    </div>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
        {label}
      </p>

      <p className="mt-1 break-words text-sm font-medium text-gray-800">
        {value}
      </p>
    </div>
  );
}





