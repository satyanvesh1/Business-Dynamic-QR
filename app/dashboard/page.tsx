import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Navigation from "@/app/components/Navigation";

export default async function DashboardPage() {
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
    take: 5,
  });

  const businessCount = await prisma.business.count({
    where: {
      owner: {
        email: session.user.email,
      },
    },
  });

  const productCount = await prisma.product.count({
    where: {
      business: {
        owner: {
          email: session.user.email,
        },
      },
    },
  });

  const qrCodeCount = await prisma.qRCode.count({
    where: {
      business: {
        owner: {
          email: session.user.email,
        },
      },
    },
  });

  const scanCount = await prisma.scan.count({
    where: {
      qrCode: {
        business: {
          owner: {
            email: session.user.email,
          },
        },
      },
    },
  });

  return (
    <div className="flex min-h-screen bg-[#F5F7FB]">

      <Navigation />

      <main className="min-w-0 flex-1">

        {/* Header */}
        <header className="border-b border-gray-200 bg-white">
          <div className="mx-auto flex max-w-[1500px] items-center justify-between px-6 py-5 lg:px-10">

            <div>
              <p className="text-sm font-medium text-blue-600">
                Business Management
              </p>

              <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-900">
                Dashboard
              </h1>
            </div>

            <div className="hidden items-center gap-3 sm:flex">

              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900">
                  {session.user.name || "Administrator"}
                </p>

                <p className="text-xs text-gray-500">
                  {session.user.email}
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-600 text-sm font-bold text-white">
                {(session.user.name || "A").charAt(0).toUpperCase()}
              </div>

            </div>

          </div>
        </header>

        <section className="mx-auto max-w-[1500px] px-6 py-8 lg:px-10">

          {/* Welcome */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#111827] via-[#172554] to-[#312E81] p-8 text-white shadow-xl">

            <div className="relative z-10 max-w-2xl">

              <p className="text-sm font-medium text-blue-300">
                Welcome back
              </p>

              <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                Manage your QR business
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
                Manage businesses, products, dynamic QR codes and customer
                scan analytics from one place.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">

                <Link
                  href="/businesses/new"
                  className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-gray-900 transition hover:bg-gray-100"
                >
                  + Create Business
                </Link>

                <Link
                  href="/businesses"
                  className="rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
                >
                  View Businesses
                </Link>

              </div>

            </div>

            {/* Decorative shapes */}
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl" />
            <div className="absolute -bottom-24 right-24 h-64 w-64 rounded-full bg-violet-500/20 blur-3xl" />

          </div>

          {/* Statistics */}
          <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">

            <StatCard
              label="Businesses"
              value={businessCount}
              description="Active business accounts"
              icon="▣"
              href="/businesses"
            />

            <StatCard
              label="Products"
              value={productCount}
              description="Products in your menus"
              icon="◈"
              href="/businesses"
            />

            <StatCard
              label="QR Codes"
              value={qrCodeCount}
              description="Dynamic QR codes"
              icon="⌗"
              href="/businesses"
            />

            <StatCard
              label="Total Scans"
              value={scanCount}
              description="Customer interactions"
              icon="↗"
              href="/businesses"
            />

          </div>

          {/* Content */}
          <div className="mt-8 grid gap-8 xl:grid-cols-[1fr_360px]">

            {/* Businesses */}
            <section>

              <div className="mb-5 flex items-end justify-between">

                <div>
                  <p className="text-sm font-medium text-blue-600">
                    Workspace
                  </p>

                  <h2 className="mt-1 text-2xl font-bold text-gray-900">
                    Your Businesses
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Manage your businesses and their QR systems.
                  </p>
                </div>

                <Link
                  href="/businesses"
                  className="text-sm font-semibold text-blue-600 hover:text-blue-800"
                >
                  View All →
                </Link>

              </div>

              {businesses.length === 0 ? (

                <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center">

                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-2xl text-blue-600">
                    +
                  </div>

                  <h3 className="mt-4 font-bold text-gray-900">
                    Create your first business
                  </h3>

                  <p className="mt-2 text-sm text-gray-500">
                    Start managing your products and dynamic QR codes.
                  </p>

                  <Link
                    href="/businesses/new"
                    className="mt-5 inline-flex rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white hover:bg-gray-800"
                  >
                    Create Business
                  </Link>

                </div>

              ) : (

                <div className="grid gap-5 md:grid-cols-2">

                  {businesses.map((business) => (

                    <div
                      key={business.id}
                      className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-xl"
                    >

                      <div className="flex items-start justify-between">

                        <div className="flex min-w-0 items-center gap-3">

                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 text-lg font-bold text-white">
                            {business.name.charAt(0).toUpperCase()}
                          </div>

                          <div className="min-w-0">

                            <h3 className="truncate font-bold text-gray-900">
                              {business.name}
                            </h3>

                            <p className="mt-1 truncate text-sm text-gray-500">
                              {business.city || "Location not specified"}
                            </p>

                          </div>

                        </div>

                        <span
                          className={`rounded-full px-3 py-1 text-[11px] font-semibold ${
                            business.isPublished
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {business.isPublished
                            ? "Published"
                            : "Draft"}
                        </span>

                      </div>

                      <div className="mt-6 grid grid-cols-2 gap-3">

                        <div className="rounded-xl bg-gray-50 p-4">
                          <p className="text-xs text-gray-500">
                            Products
                          </p>

                          <p className="mt-1 text-xl font-bold text-gray-900">
                            {business._count.products}
                          </p>
                        </div>

                        <div className="rounded-xl bg-gray-50 p-4">
                          <p className="text-xs text-gray-500">
                            QR Codes
                          </p>

                          <p className="mt-1 text-xl font-bold text-gray-900">
                            {business._count.qrCodes}
                          </p>
                        </div>

                      </div>

                      <Link
                        href={`/businesses/${business.id}`}
                        className="mt-5 flex items-center justify-center rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:border-gray-300 hover:bg-gray-50"
                      >
                        Manage Business →
                      </Link>

                    </div>

                  ))}

                </div>

              )}

            </section>

            {/* Quick Actions */}
            <section>

              <div className="mb-5">

                <p className="text-sm font-medium text-blue-600">
                  Shortcuts
                </p>

                <h2 className="mt-1 text-2xl font-bold text-gray-900">
                  Quick Actions
                </h2>

              </div>

              <div className="space-y-3">

                <QuickAction
                  href="/businesses/new"
                  icon="+"
                  title="Create Business"
                  description="Add a new business"
                />

                <QuickAction
                  href="/businesses"
                  icon="◈"
                  title="Manage Products"
                  description="Update your product menu"
                />

                <QuickAction
                  href="/businesses"
                  icon="⌗"
                  title="Manage QR Codes"
                  description="Create dynamic QR codes"
                />

                <QuickAction
                  href="/businesses"
                  icon="↗"
                  title="View Analytics"
                  description="Monitor customer scans"
                />

              </div>

              <div className="mt-5 rounded-2xl bg-white p-6 shadow-sm">

                <p className="text-sm font-semibold text-gray-900">
                  Platform Overview
                </p>

                <div className="mt-5 space-y-4">

                  <ProgressRow
                    label="Businesses"
                    value={businessCount}
                    max={Math.max(businessCount, 5)}
                  />

                  <ProgressRow
                    label="Products"
                    value={productCount}
                    max={Math.max(productCount, 10)}
                  />

                  <ProgressRow
                    label="QR Codes"
                    value={qrCodeCount}
                    max={Math.max(qrCodeCount, 5)}
                  />

                </div>

              </div>

            </section>

          </div>

        </section>

      </main>
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

function QuickAction({
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
      className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-lg font-bold text-gray-700">
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <p className="font-semibold text-gray-900">
          {title}
        </p>

        <p className="mt-0.5 text-xs text-gray-500">
          {description}
        </p>
      </div>

      <span className="text-gray-400">
        →
      </span>
    </Link>
  );
}

function ProgressRow({
  label,
  value,
  max,
}: {
  label: string;
  value: number;
  max: number;
}) {
  const percentage = Math.min(
    100,
    Math.round((value / max) * 100)
  );

  return (
    <div>

      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-gray-600">
          {label}
        </span>

        <span className="font-semibold text-gray-900">
          {value}
        </span>
      </div>

      <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100">
        <div
          className="h-full rounded-full bg-gradient-to-r from-blue-500 to-violet-600"
          style={{ width: `${percentage}%` }}
        />
      </div>

    </div>
  );
}