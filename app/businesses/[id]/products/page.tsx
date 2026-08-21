import Link from "next/link";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getBusinessTypeConfig } from "@/lib/business-types";
import ProductAvailabilityToggle from "./ProductAvailabilityToggle";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ProductsPage({
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
      products: {
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
          <h1 className="text-2xl font-bold text-gray-900">
            Business Not Found
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            The business could not be found.
          </p>

          <Link
            href="/businesses"
            className="mt-6 inline-block rounded-lg bg-black px-5 py-3 text-sm font-semibold text-white hover:bg-gray-800"
          >
            Back to Businesses
          </Link>
        </div>
      </main>
    );
  }

  const typeConfig = getBusinessTypeConfig(
    business.businessType
  );

  const isTransport =
    business.businessType === "TRANSPORT_SERVICES";

  const contentLabel = typeConfig.contentLabel;
  const contentPlural = typeConfig.contentPlural;

  const activeProducts = business.products.filter(
    (product) => product.status === "ACTIVE"
  ).length;

  const inactiveProducts = business.products.filter(
    (product) => product.status === "INACTIVE"
  ).length;

  const formatPrice = (price: unknown) => {
    if (price === null || price === undefined) {
      return null;
    }

    const numericPrice = Number(price);

    if (!Number.isFinite(numericPrice)) {
      return null;
    }

    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numericPrice);
  };

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="mx-auto max-w-6xl px-6 py-8">

        {/* HEADER */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              href={`/businesses/${business.id}`}
              className="text-sm font-medium text-blue-600 hover:underline"
            >
              ← Back to Business
            </Link>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-bold text-gray-900">
                {contentPlural}
              </h1>

              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                {typeConfig.icon} {typeConfig.label}
              </span>
            </div>

            <p className="mt-2 text-gray-600">
              Manage {contentPlural.toLowerCase()} for{" "}
              {business.name}.
            </p>
          </div>

          <Link
            href={`/businesses/${business.id}/products/new`}
            className="inline-flex items-center justify-center rounded-lg bg-black px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-800"
          >
            + Add {contentLabel}
          </Link>
        </div>

        {/* SUMMARY */}
        <div className="mt-8 grid gap-4 sm:grid-cols-3">

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Total {contentPlural}
            </p>

            <p className="mt-2 text-3xl font-bold text-gray-900">
              {business.products.length}
            </p>
          </div>

          <div className="rounded-2xl border border-green-200 bg-green-50 p-5 shadow-sm">
            <p className="text-sm font-medium text-green-700">
              Available
            </p>

            <p className="mt-2 text-3xl font-bold text-green-800">
              {activeProducts}
            </p>
          </div>

          <div className="rounded-2xl border border-red-200 bg-red-50 p-5 shadow-sm">
            <p className="text-sm font-medium text-red-700">
              Unavailable
            </p>

            <p className="mt-2 text-3xl font-bold text-red-800">
              {inactiveProducts}
            </p>
          </div>
        </div>

        {/* EMPTY STATE */}
        {business.products.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-sm">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-2xl">
              {typeConfig.icon}
            </div>

            <h2 className="mt-5 text-xl font-bold text-gray-900">
              No {contentPlural.toLowerCase()} yet
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Add your first {contentLabel.toLowerCase()} to
              make it available to your customers.
            </p>

            <Link
              href={`/businesses/${business.id}/products/new`}
              className="mt-6 inline-flex rounded-lg bg-black px-5 py-3 text-sm font-semibold text-white hover:bg-gray-800"
            >
              Add Your First {contentLabel}
            </Link>
          </div>
        ) : (

          /* CONTENT GRID */
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

            {business.products.map((product) => {
              const available =
                product.status === "ACTIVE";

              return (
                <article
                  key={product.id}
                  className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
                >

                  {/* IMAGE */}
                  {product.imageUrl ? (
                    <div className="aspect-[16/10] overflow-hidden bg-gray-100">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="flex aspect-[16/10] items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                      <span className="text-5xl">
                        {typeConfig.icon}
                      </span>
                    </div>
                  )}

                  <div className="p-5">

                    {/* NAME + PRICE */}
                    <div className="flex items-start justify-between gap-4">
                      <h2 className="text-lg font-bold text-gray-900">
                        {product.name}
                      </h2>

                      {product.price !== null ? (
                        <span className="whitespace-nowrap text-lg font-bold text-gray-900">
                          {formatPrice(product.price)}
                        </span>
                      ) : null}
                    </div>

                    {/* TRANSPORT DETAILS */}
                    {isTransport && (
                      <div className="mt-5 space-y-3 rounded-xl border border-blue-100 bg-blue-50 p-4">

                        <p className="text-sm font-bold text-blue-900">
                          🚗 Transport Service Details
                        </p>

                        {product.serviceType && (
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                              Service Type
                            </p>

                            <p className="mt-1 text-sm font-medium text-gray-900">
                              {product.serviceType}
                            </p>
                          </div>
                        )}

                        {product.vehicleType && (
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                              Vehicle Type
                            </p>

                            <p className="mt-1 text-sm font-medium text-gray-900">
                              {product.vehicleType}
                            </p>
                          </div>
                        )}

                        {product.startingLocation && (
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                              Starting Location
                            </p>

                            <p className="mt-1 text-sm font-medium text-gray-900">
                              {product.startingLocation}
                            </p>
                          </div>
                        )}

                        {product.destination && (
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                              Destination
                            </p>

                            <p className="mt-1 text-sm font-medium text-gray-900">
                              {product.destination}
                            </p>
                          </div>
                        )}

                        {product.route && (
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                              Route
                            </p>

                            <p className="mt-1 text-sm font-medium text-gray-900">
                              {product.route}
                            </p>
                          </div>
                        )}

                        {product.availability && (
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                              Service Availability
                            </p>

                            <p className="mt-1 text-sm font-medium text-gray-900">
                              {product.availability}
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* DESCRIPTION */}
                    {product.description ? (
                      <div className="mt-4">
                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                          Description
                        </p>

                        <p className="mt-1 text-sm leading-6 text-gray-600">
                          {product.description}
                        </p>
                      </div>
                    ) : null}

                    {/* AVAILABILITY */}
                    <div className="mt-5 rounded-xl border border-gray-200 bg-gray-50 p-4">

                      <div className="flex items-center justify-between gap-3">

                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                            Availability
                          </p>

                          <p
                            className={`mt-1 text-sm font-bold ${
                              available
                                ? "text-green-700"
                                : "text-red-700"
                            }`}
                          >
                            {available
                              ? "● AVAILABLE"
                              : "● UNAVAILABLE"}
                          </p>
                        </div>

                        <ProductAvailabilityToggle
                          businessId={business.id}
                          productId={product.id}
                          available={available}
                        />

                      </div>
                    </div>

                    {/* EDIT */}
                    <Link
                      href={`/businesses/${business.id}/products/${product.id}/edit`}
                      className="mt-4 block rounded-lg border border-gray-300 px-4 py-2.5 text-center text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                    >
                      Edit {contentLabel}
                    </Link>

                    {/* CREATED DATE */}
                    <p className="mt-3 text-xs text-gray-400">
                      Added{" "}
                      {new Date(
                        product.createdAt
                      ).toLocaleDateString("en-IN")}
                    </p>

                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}