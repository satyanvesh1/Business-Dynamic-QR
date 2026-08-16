import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

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
      products: {
        orderBy: {
          createdAt: "desc",
        },
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

  return (
    <main className="min-h-screen bg-gray-100">

      {/* Top Navigation */}
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          <div>
            <Link
              href="/businesses"
              className="text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              ← All Businesses
            </Link>

            <h1 className="mt-2 text-2xl font-bold text-gray-900">
              {business.name}
            </h1>
          </div>

          <div className="flex flex-wrap gap-3">

            <Link
              href={`/businesses/${business.id}/edit`}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              Edit Business
            </Link>

            <Link
              href={`/businesses/${business.id}/qr-codes`}
              className="rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800"
            >
              Manage QR Codes
            </Link>

          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-8">

        {/* Business Overview */}
        <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

            <div>
              <div className="flex flex-wrap items-center gap-3">

                <h2 className="text-2xl font-bold text-gray-900">
                  {business.name}
                </h2>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    business.isPublished
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {business.isPublished
                    ? "PUBLISHED"
                    : "UNPUBLISHED"}
                </span>

              </div>

              <p className="mt-2 text-gray-600">
                {business.address}
              </p>

              <p className="mt-1 text-sm text-gray-500">
                {business.city}
                {business.state
                  ? `, ${business.state}`
                  : ""}
                {business.country
                  ? `, ${business.country}`
                  : ""}
              </p>
            </div>

            <div className="text-left lg:text-right">

              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Business ID
              </p>

              <p className="mt-1 break-all text-sm text-gray-600">
                {business.id}
              </p>

            </div>

          </div>

        </div>

        {/* Summary Cards */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Total Scans
            </p>

            <p className="mt-2 text-4xl font-bold text-gray-900">
              {totalScans}
            </p>

            <Link
              href={`/businesses/${business.id}/analytics`}
              className="mt-3 inline-block text-sm font-semibold text-blue-600 hover:text-blue-800"
            >
              View Analytics →
            </Link>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              QR Codes
            </p>

            <p className="mt-2 text-4xl font-bold text-gray-900">
              {business._count.qrCodes}
            </p>

            <p className="mt-3 text-sm text-gray-500">
              {activeQrCodes} active
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Products
            </p>

            <p className="mt-2 text-4xl font-bold text-gray-900">
              {business._count.products}
            </p>

            <Link
              href={`/businesses/${business.id}/products/new`}
              className="mt-3 inline-block text-sm font-semibold text-blue-600 hover:text-blue-800"
            >
              Add Product →
            </Link>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Status
            </p>

            <p className="mt-2 text-2xl font-bold text-gray-900">
              {business.isPublished
                ? "Published"
                : "Unpublished"}
            </p>

            <p className="mt-3 text-sm text-gray-500">
              Customer menu availability
            </p>
          </div>

        </div>

        {/* Quick Actions */}
        <section className="mt-8">

          <h2 className="mb-4 text-xl font-bold text-gray-900">
            Quick Actions
          </h2>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            <Link
              href={`/businesses/${business.id}/qr-codes`}
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="text-3xl">
                ▦
              </div>

              <h3 className="mt-4 font-bold text-gray-900">
                QR Codes
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Create and manage dynamic QR codes.
              </p>
            </Link>

            <Link
              href={`/businesses/${business.id}/analytics`}
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="text-3xl">
                ↗
              </div>

              <h3 className="mt-4 font-bold text-gray-900">
                Analytics
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Monitor scans and customer activity.
              </p>
            </Link>

            <Link
              href={`/businesses/${business.id}/products/new`}
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="text-3xl">
                +
              </div>

              <h3 className="mt-4 font-bold text-gray-900">
                Add Product
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Add products to the customer menu.
              </p>
            </Link>

            <Link
              href={`/businesses/${business.id}/edit`}
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="text-3xl">
                ⚙
              </div>

              <h3 className="mt-4 font-bold text-gray-900">
                Business Settings
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Update business information.
              </p>
            </Link>

          </div>

        </section>

        {/* QR Code Performance */}
        <section className="mt-8">

          <div className="mb-4 flex items-center justify-between">

            <div>
              <h2 className="text-xl font-bold text-gray-900">
                QR Code Performance
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Your latest dynamic QR codes.
              </p>
            </div>

            <Link
              href={`/businesses/${business.id}/qr-codes`}
              className="text-sm font-semibold text-blue-600 hover:text-blue-800"
            >
              View All →
            </Link>

          </div>

          {business.qrCodes.length === 0 ? (

            <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center">

              <h3 className="font-semibold text-gray-900">
                No QR codes yet
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Generate your first dynamic QR code.
              </p>

              <Link
                href={`/businesses/${business.id}/qr-codes/new`}
                className="mt-5 inline-flex rounded-lg bg-black px-5 py-3 text-sm font-semibold text-white hover:bg-gray-800"
              >
                Generate QR Code
              </Link>

            </div>

          ) : (

            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

              <div className="divide-y divide-gray-200">

                {business.qrCodes.map((qrCode) => (

                  <div
                    key={qrCode.id}
                    className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between"
                  >

                    <div className="min-w-0">

                      <div className="flex flex-wrap items-center gap-3">

                        <h3 className="font-bold text-gray-900">
                          {qrCode.name}
                        </h3>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            qrCode.status === "ACTIVE"
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {qrCode.status}
                        </span>

                      </div>

                      <p className="mt-2 break-all text-sm text-gray-500">
                        {qrCode.code}
                      </p>

                    </div>

                    <div className="flex items-center gap-6">

                      <div className="text-center">

                        <p className="text-2xl font-bold text-gray-900">
                          {qrCode._count.scans}
                        </p>

                        <p className="text-xs text-gray-500">
                          SCANS
                        </p>

                      </div>

                      <Link
                        href={`/businesses/${business.id}/qr-codes/${qrCode.id}`}
                        className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                      >
                        View QR
                      </Link>

                    </div>

                  </div>

                ))}

              </div>

            </div>

          )}

        </section>

        {/* Products */}
        <section className="mt-8">

          <div className="mb-4 flex items-center justify-between">

            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Products
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Products available in the customer menu.
              </p>
            </div>

            <Link
              href={`/businesses/${business.id}/products/new`}
              className="rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800"
            >
              + Add Product
            </Link>

          </div>

          {business.products.length === 0 ? (

            <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center">

              <h3 className="font-semibold text-gray-900">
                No products yet
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Add products so customers can view your menu.
              </p>

            </div>

          ) : (

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

              {business.products.slice(0, 6).map((product) => (

                <div
                  key={product.id}
                  className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
                >

                  <h3 className="font-bold text-gray-900">
                    {product.name}
                  </h3>

                  <p className="mt-2 text-lg font-bold text-gray-900">
                    ₹{Number(product.price).toFixed(2)}
                  </p>

                  {product.description && (
                    <p className="mt-2 line-clamp-2 text-sm text-gray-500">
                      {product.description}
                    </p>
                  )}

                </div>

              ))}

            </div>

          )}

        </section>

      </div>
    </main>
  );
}