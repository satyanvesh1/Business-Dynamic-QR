import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function BusinessesPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login");
  }

  const businesses = await prisma.business.findMany({
    where: {
      owner: {
        email: session.user.email,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      _count: {
        select: {
          products: true,
          qrCodes: true,
        },
      },
    },
  });

  const totalProducts = businesses.reduce(
    (total, business) => total + business._count.products,
    0
  );

  const totalQrCodes = businesses.reduce(
    (total, business) => total + business._count.qrCodes,
    0
  );

  const publishedBusinesses = businesses.filter(
    (business) => business.isPublished
  ).length;

  return (
    <main className="min-h-screen bg-[#F5F7FB]">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between px-6 py-5 lg:px-10">
          <div>
            <p className="text-sm font-medium text-blue-600">
              Workspace
            </p>

            <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-900">
              Businesses
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Manage your businesses, menus and dynamic QR systems.
            </p>
          </div>

          <Link
            href="/businesses/new"
            className="hidden rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:-translate-y-0.5 hover:shadow-xl sm:inline-flex"
          >
            <span className="mr-2 text-lg">+</span>
            Create Business
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-[1500px] px-6 py-8 lg:px-10">
        {/* Mobile Create Button */}
        <div className="mb-6 sm:hidden">
          <Link
            href="/businesses/new"
            className="flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-lg"
          >
            <span className="mr-2 text-lg">+</span>
            Create Business
          </Link>
        </div>

        {/* Overview */}
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <OverviewCard
            label="Total Businesses"
            value={businesses.length}
            description="Business accounts"
            icon="▣"
          />

          <OverviewCard
            label="Published"
            value={publishedBusinesses}
            description="Currently visible"
            icon="✓"
          />

          <OverviewCard
            label="Products"
            value={totalProducts}
            description="Across all businesses"
            icon="◈"
          />

          <OverviewCard
            label="QR Codes"
            value={totalQrCodes}
            description="Dynamic QR codes"
            icon="⌗"
          />
        </div>

        {/* Section Header */}
        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-blue-600">
              Your Workspace
            </p>

            <h2 className="mt-1 text-2xl font-bold tracking-tight text-gray-900">
              Business Accounts
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Select a business to manage its products, QR codes and analytics.
            </p>
          </div>

          <p className="text-sm font-medium text-gray-500">
            {businesses.length}{" "}
            {businesses.length === 1 ? "business" : "businesses"}
          </p>
        </div>

        {/* Empty State */}
        {businesses.length === 0 ? (
          <div className="mt-6 rounded-3xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-3xl text-blue-600">
              +
            </div>

            <h3 className="mt-5 text-xl font-bold text-gray-900">
              Create your first business
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
              Add your business information, products and dynamic QR codes to
              start building your digital customer experience.
            </p>

            <Link
              href="/businesses/new"
              className="mt-6 inline-flex rounded-xl bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
            >
              Create Business
            </Link>
          </div>
        ) : (
          <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {businesses.map((business) => (
              <BusinessCard
                key={business.id}
                business={business}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function OverviewCard({
  label,
  value,
  description,
  icon,
}: {
  label: string;
  value: number;
  description: string;
  icon: string;
}) {
  return (
    <div className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-lg">
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

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-lg font-semibold text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
          {icon}
        </div>
      </div>
    </div>
  );
}

function BusinessCard({
  business,
}: {
  business: {
    id: string;
    name: string;
    description: string | null;
    city: string | null;
    state: string | null;
    country: string | null;
    isPublished: boolean;
    _count: {
      products: number;
      qrCodes: number;
    };
  };
}) {
  const location =
    [business.city, business.state]
      .filter(Boolean)
      .join(", ") ||
    business.country ||
    "Location not specified";

  const initial = business.name.charAt(0).toUpperCase();

  return (
    <div className="group overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-xl">
      {/* Card Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#111827] via-[#172554] to-[#312E81] px-6 py-7 text-white">
        <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-blue-500/20 blur-2xl" />

        <div className="relative flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-xl font-bold shadow-lg backdrop-blur">
              {initial}
            </div>

            <div className="min-w-0">
              <h3 className="truncate text-lg font-bold">
                {business.name}
              </h3>

              <p className="mt-1 truncate text-sm text-slate-300">
                {location}
              </p>
            </div>
          </div>

          <span
            className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-semibold ${
              business.isPublished
                ? "bg-emerald-400/15 text-emerald-300"
                : "bg-white/10 text-slate-300"
            }`}
          >
            {business.isPublished ? "Published" : "Draft"}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-6">
        {business.description ? (
          <p className="line-clamp-2 min-h-[40px] text-sm leading-5 text-gray-500">
            {business.description}
          </p>
        ) : (
          <p className="min-h-[40px] text-sm italic text-gray-400">
            No business description added.
          </p>
        )}

        {/* Metrics */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          <MetricBox
            label="Products"
            value={business._count.products}
          />

          <MetricBox
            label="QR Codes"
            value={business._count.qrCodes}
          />
        </div>

        {/* Actions */}
        <div className="mt-6 flex gap-3">
          <Link
            href={`/businesses/${business.id}`}
            className="flex-1 rounded-xl bg-gray-900 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-gray-800"
          >
            Manage Business
          </Link>

          <Link
            href={`/businesses/${business.id}/edit`}
            className="rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            Edit
          </Link>
        </div>

        {/* Secondary Links */}
        <div className="mt-4 grid grid-cols-3 divide-x divide-gray-200 rounded-xl bg-gray-50 py-2">
          <Link
            href={`/businesses/${business.id}/products`}
            className="text-center text-xs font-medium text-gray-600 hover:text-blue-600"
          >
            Products
          </Link>

          <Link
            href={`/businesses/${business.id}/qr-codes`}
            className="text-center text-xs font-medium text-gray-600 hover:text-blue-600"
          >
            QR Codes
          </Link>

          <Link
            href={`/businesses/${business.id}/analytics`}
            className="text-center text-xs font-medium text-gray-600 hover:text-blue-600"
          >
            Analytics
          </Link>
        </div>
      </div>
    </div>
  );
}

function MetricBox({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-xl bg-gray-50 p-4">
      <p className="text-xs font-medium text-gray-500">
        {label}
      </p>

      <p className="mt-1 text-xl font-bold text-gray-900">
        {value.toLocaleString()}
      </p>
    </div>
  );
}