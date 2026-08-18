import prisma from "@/lib/prisma";
import ScanTracker from "./ScanTracker";

type PageProps = {
  params: Promise<{
    code: string;
  }>;
};

export default async function QRPage({
  params,
}: PageProps) {
  const { code } = await params;

  const qrCode = await prisma.qRCode.findUnique({
    where: {
      code,
    },
    include: {
      business: {
        include: {
          products: {
            where: {
              status: "ACTIVE",
            },
            orderBy: {
              createdAt: "asc",
            },
          },
        },
      },
    },
  });

  /*
   * QR code does not exist.
   *
   * We return a friendly page instead of
   * exposing database information.
   */
  if (!qrCode) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-stone-50 px-6">
        <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-2xl">
            QR
          </div>

          <h1 className="mt-5 text-2xl font-bold text-gray-900">
            QR Code Not Found
          </h1>

          <p className="mt-3 text-sm leading-6 text-gray-500">
            This QR code does not exist or the link may be incorrect.
          </p>
        </div>
      </main>
    );
  }

  /*
   * Business must be published.
   */
  if (!qrCode.business.isPublished) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-stone-50 px-6">
        <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-2xl">
            QR
          </div>

          <h1 className="mt-5 text-2xl font-bold text-gray-900">
            Business Unavailable
          </h1>

          <p className="mt-3 text-sm leading-6 text-gray-500">
            This business is currently unavailable.
            Please try again later.
          </p>
        </div>
      </main>
    );
  }

  /*
   * QR code exists but has been deactivated.
   *
   * IMPORTANT:
   * Do not render ScanTracker here.
   * This prevents an inactive QR from creating
   * a scan record.
   */
  if (qrCode.status !== "ACTIVE") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-stone-50 px-6">
        <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100 text-2xl">
            !
          </div>

          <h1 className="mt-5 text-2xl font-bold text-gray-900">
            QR Code Inactive
          </h1>

          <p className="mt-3 text-sm leading-6 text-gray-500">
            This QR code is currently inactive and cannot
            be used to access the customer menu.
          </p>

          <p className="mt-5 text-xs text-gray-400">
            Please contact the business for assistance.
          </p>
        </div>
      </main>
    );
  }

  const business = qrCode.business;

  const formatPrice = (price: unknown) => {
    if (price === null || price === undefined) {
      return null;
    }

    const numericPrice = Number(price);

    if (Number.isNaN(numericPrice)) {
      return null;
    }

    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(numericPrice);
  };

  return (
    <>
      <ScanTracker code={code} />

      <main className="min-h-screen bg-stone-50">
        {/* HERO */}
        <section className="relative overflow-hidden bg-gray-950 text-white">
          {business.coverImageUrl ? (
            <div
              className="absolute inset-0 bg-cover bg-center opacity-40"
              style={{
                backgroundImage: `url(${business.coverImageUrl})`,
              }}
            />
          ) : null}

          <div className="absolute inset-0 bg-black/60" />

          <div className="relative mx-auto max-w-4xl px-5 py-14 text-center sm:px-8 sm:py-20">
            {/* LOGO */}
            {business.logoUrl ? (
              <div className="mx-auto mb-6 h-24 w-24 overflow-hidden rounded-full border-4 border-white/20 bg-white shadow-lg">
                <img
                  src={business.logoUrl}
                  alt={`${business.name} logo`}
                  className="h-full w-full object-cover"
                />
              </div>
            ) : (
              <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-white text-3xl font-bold text-gray-900 shadow-lg">
                {business.name.charAt(0).toUpperCase()}
              </div>
            )}

            {/* BUSINESS NAME */}
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              {business.name}
            </h1>

            {/* DESCRIPTION */}
            {business.description ? (
              <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-gray-300 sm:text-lg">
                {business.description}
              </p>
            ) : null}

            {/* LOCATION */}
            {business.city ||
            business.state ||
            business.country ? (
              <p className="mt-4 text-sm text-gray-300">
                {[
                  business.city,
                  business.state,
                  business.country,
                ]
                  .filter(Boolean)
                  .join(", ")}
              </p>
            ) : null}
          </div>
        </section>

        {/* MAIN CONTENT */}
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
          {/* MENU HEADER */}
          <div className="mb-8 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
              Welcome
            </p>

            <h2 className="mt-2 text-3xl font-bold text-gray-900">
              Our Menu
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Freshly prepared selections from{" "}
              {business.name}
            </p>
          </div>

          {/* PRODUCTS */}
          {business.products.length === 0 ? (
            <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-2xl">
                🍽️
              </div>

              <h3 className="mt-5 text-lg font-semibold text-gray-900">
                Menu coming soon
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                There are currently no products available.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2">
              {business.products.map((product) => (
                <article
                  key={product.id}
                  className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
                >
                  {/* PRODUCT IMAGE */}
                  {product.imageUrl ? (
                    <div className="aspect-[16/10] overflow-hidden bg-gray-100">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="h-full w-full object-cover transition duration-300 hover:scale-105"
                      />
                    </div>
                  ) : (
                    <div className="flex aspect-[16/10] items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                      <span className="text-5xl">
                        🍽️
                      </span>
                    </div>
                  )}

                  {/* PRODUCT DETAILS */}
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="text-lg font-bold text-gray-900">
                        {product.name}
                      </h3>

                      {product.price !== null ? (
                        <span className="whitespace-nowrap text-lg font-bold text-gray-900">
                          {formatPrice(product.price)}
                        </span>
                      ) : null}
                    </div>

                    {product.description ? (
                      <p className="mt-2 text-sm leading-6 text-gray-500">
                        {product.description}
                      </p>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* CONTACT */}
          <section className="mt-12 rounded-2xl bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-xl font-bold text-gray-900">
              Visit Us
            </h2>

            <div className="mt-5 space-y-4 text-sm text-gray-600">
              {business.address ? (
                <div className="flex gap-3">
                  <span className="text-lg">📍</span>

                  <p>{business.address}</p>
                </div>
              ) : null}

              {business.phone ? (
                <div className="flex gap-3">
                  <span className="text-lg">📞</span>

                  <a
                    href={`tel:${business.phone}`}
                    className="font-medium text-gray-900 hover:underline"
                  >
                    {business.phone}
                  </a>
                </div>
              ) : null}

              {business.email ? (
                <div className="flex gap-3">
                  <span className="text-lg">✉️</span>

                  <a
                    href={`mailto:${business.email}`}
                    className="font-medium text-gray-900 hover:underline"
                  >
                    {business.email}
                  </a>
                </div>
              ) : null}

              {business.website ? (
                <div className="flex gap-3">
                  <span className="text-lg">🌐</span>

                  <a
                    href={business.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-gray-900 hover:underline"
                  >
                    Visit Website
                  </a>
                </div>
              ) : null}
            </div>

            {/* ACTION BUTTONS */}
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              {business.phone ? (
                <a
                  href={`tel:${business.phone}`}
                  className="flex flex-1 items-center justify-center rounded-xl bg-gray-900 px-5 py-3 font-semibold text-white transition hover:bg-gray-800"
                >
                  📞 Call
                </a>
              ) : null}

              {business.whatsapp ? (
                <a
                  href={`https://wa.me/${business.whatsapp.replace(
                    /[^0-9]/g,
                    ""
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-1 items-center justify-center rounded-xl bg-green-600 px-5 py-3 font-semibold text-white transition hover:bg-green-700"
                >
                  💬 WhatsApp
                </a>
              ) : null}

              {business.googleMapsUrl ? (
                <a
                  href={business.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-1 items-center justify-center rounded-xl border border-gray-300 bg-white px-5 py-3 font-semibold text-gray-900 transition hover:bg-gray-50"
                >
                  📍 Directions
                </a>
              ) : null}
            </div>
          </section>

          {/* FOOTER */}
          <footer className="py-8 text-center">
            <p className="text-xs text-gray-400">
              Powered by Dynamic QR
            </p>
          </footer>
        </div>
      </main>
    </>
  );
}