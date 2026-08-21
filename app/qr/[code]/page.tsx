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
            orderBy: {
              createdAt: "desc",
            },
          },
        },
      },
    },
  });

  /*
   * QR code does not exist.
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
   * QR code is inactive.
   *
   * Do not render ScanTracker.
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
            be used to access the customer experience.
          </p>

          <p className="mt-5 text-xs text-gray-400">
            Please contact the business for assistance.
          </p>
        </div>
      </main>
    );
  }

  const business = qrCode.business;
  console.log("QR BUSINESS TYPE:", business.businessType);

  /*
   * Check whether this is a transport business.
   */
  const isTransport =
    business.businessType === "TRANSPORT_SERVICES";

  /*
   * Format price safely.
   */
  const formatPrice = (price: unknown) => {
    if (price === null || price === undefined) {
      return null;
    }

    const priceString = String(price);
    const numericPrice = Number(priceString);

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

  /*
   * TRANSPORT EXPERIENCE
   */
  if (isTransport) {
    return (
      <>
        <ScanTracker code={code} />

        <main className="min-h-screen bg-gray-50">

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

            <div className="absolute inset-0 bg-black/65" />

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

              {/* BUSINESS TYPE */}
              <div className="mt-5 inline-flex items-center rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/20">
                 Transport Services
              </div>

              {/* DESCRIPTION */}
              {business.description ? (
                <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-gray-300 sm:text-lg">
                  {business.description}
                </p>
              ) : null}

              {/* LOCATION */}
              {business.city ||
              business.state ||
              business.country ? (
                <p className="mt-4 text-sm text-gray-300">
                  {" "}
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

          {/* MAIN */}
          <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">

            {/* HEADER */}
            <div className="mb-8 text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
                Customer Experience
              </p>

              <h2 className="mt-2 text-3xl font-bold text-gray-900">
                Transport Services
              </h2>

              <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-gray-500">
                Explore available transport services, routes,
                vehicles, pricing and availability.
              </p>
            </div>

            {/* SERVICES */}
            {business.products.length === 0 ? (
              <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">

                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-3xl">
                  
                </div>

                <h3 className="mt-5 text-lg font-bold text-gray-900">
                  Transport services coming soon
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  There are currently no transport services
                  available.
                </p>

              </div>
            ) : (
              <div className="space-y-6">

                {business.products.map((product) => {
                  const isAvailable =
                    product.status === "ACTIVE";

                  return (
                    <article
                      key={product.id}
                      className={`overflow-hidden rounded-2xl border bg-white shadow-sm ${
                        isAvailable
                          ? "border-gray-200"
                          : "border-red-200"
                      }`}
                    >

                      {/* IMAGE */}
                      {product.imageUrl ? (
                        <div className="relative aspect-[16/8] overflow-hidden bg-gray-100">

                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className={`h-full w-full object-cover ${
                              isAvailable
                                ? ""
                                : "grayscale opacity-60"
                            }`}
                          />

                          <div className="absolute right-4 top-4">
                            {isAvailable ? (
                              <span className="inline-flex items-center gap-2 rounded-full bg-green-600 px-4 py-2 text-sm font-bold text-white shadow">
                                <span className="h-2.5 w-2.5 rounded-full bg-white" />
                                Available
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-2 rounded-full bg-red-600 px-4 py-2 text-sm font-bold text-white shadow">
                                <span className="h-2.5 w-2.5 rounded-full bg-white" />
                                Unavailable
                              </span>
                            )}
                          </div>

                        </div>
                      ) : (
                        <div className="relative flex aspect-[16/8] items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">

                          <span className="text-7xl">
                            
                          </span>

                          <div className="absolute right-4 top-4">
                            {isAvailable ? (
                              <span className="inline-flex items-center gap-2 rounded-full bg-green-600 px-4 py-2 text-sm font-bold text-white shadow">
                                <span className="h-2.5 w-2.5 rounded-full bg-white" />
                                Available
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-2 rounded-full bg-red-600 px-4 py-2 text-sm font-bold text-white shadow">
                                <span className="h-2.5 w-2.5 rounded-full bg-white" />
                                Unavailable
                              </span>
                            )}
                          </div>

                        </div>
                      )}

                      {/* SERVICE CONTENT */}
                      <div className="p-6 sm:p-8">

                        {/* TITLE + PRICE */}
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">

                          <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                               Transport Service
                            </p>

                            <h3
                              className={`mt-2 text-2xl font-bold ${
                                isAvailable
                                  ? "text-gray-900"
                                  : "text-gray-500 line-through"
                              }`}
                            >
                              {product.name}
                            </h3>
                          </div>

                          {product.price !== null ? (
                            <div className="rounded-xl bg-gray-100 px-4 py-3 text-right">
                              <p className="text-xs font-medium text-gray-500">
                                Starting Price
                              </p>

                              <p
                                className={`text-xl font-bold ${
                                  isAvailable
                                    ? "text-gray-900"
                                    : "text-gray-400 line-through"
                                }`}
                              >
                                {formatPrice(product.price)}
                              </p>
                            </div>
                          ) : null}

                        </div>

                        {/* TRANSPORT DETAILS */}
                        <div className="mt-6 grid gap-4 sm:grid-cols-2">

                          {product.serviceType ? (
                            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                              <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
                                Service Type
                              </p>

                              <p className="mt-1 text-base font-semibold text-gray-900">
                                {product.serviceType}
                              </p>
                            </div>
                          ) : null}

                          {product.vehicleType ? (
                            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                              <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
                                Vehicle Type
                              </p>

                              <p className="mt-1 text-base font-semibold text-gray-900">
                                {product.vehicleType}
                              </p>
                            </div>
                          ) : null}

                          {product.startingLocation ? (
                            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                              <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
                                Starting Location
                              </p>

                              <p className="mt-1 text-base font-semibold text-gray-900">
                                {product.startingLocation}
                              </p>
                            </div>
                          ) : null}

                          {product.destination ? (
                            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                              <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
                                Destination
                              </p>

                              <p className="mt-1 text-base font-semibold text-gray-900">
                                {product.destination}
                              </p>
                            </div>
                          ) : null}

                          {product.route ? (
                            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 sm:col-span-2">
                              <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
                                Route
                              </p>

                              <p className="mt-1 text-base font-semibold text-gray-900">
                                {product.route}
                              </p>
                            </div>
                          ) : null}

                          {product.availability ? (
                            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 sm:col-span-2">
                              <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
                                Service Availability
                              </p>

                              <p className="mt-1 text-base font-semibold text-gray-900">
                                {product.availability}
                              </p>
                            </div>
                          ) : null}

                        </div>

                        {/* DESCRIPTION */}
                        {product.description ? (
                          <div className="mt-6">
                            <h4 className="text-sm font-bold uppercase tracking-wider text-gray-500">
                              Description
                            </h4>

                            <p className="mt-2 text-base leading-7 text-gray-700">
                              {product.description}
                            </p>
                          </div>
                        ) : null}

                        {/* AVAILABILITY MESSAGE */}
                        {isAvailable ? (
                          <div className="mt-6 rounded-xl border border-green-200 bg-green-50 p-4">
                            <div className="flex items-center gap-3">
                              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-green-600 text-white">
                                
                              </span>

                              <div>
                                <p className="font-bold text-green-800">
                                  Service Available
                                </p>

                                <p className="text-sm text-green-700">
                                  This transport service is currently available.
                                </p>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4">
                            <div className="flex items-center gap-3">
                              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-red-600 text-white">
                                !
                              </span>

                              <div>
                                <p className="font-bold text-red-800">
                                  Service Unavailable
                                </p>

                                <p className="text-sm text-red-700">
                                  This transport service is currently unavailable.
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {isAvailable ? (
                          <a
                            href={`/transport-request?businessId=${encodeURIComponent(business.id)}&productId=${encodeURIComponent(product.id)}&service=${encodeURIComponent(product.name)}`}
                            className="mt-6 block w-full rounded-xl bg-gray-900 px-5 py-4 text-center text-base font-bold text-white transition hover:bg-gray-800"
                          >
                            Request This Service
                          </a>
                        ) : null}

                      </div>
                    </article>
                  );
                })}

              </div>
            )}

            {/* CONTACT / BOOKING */}
            <section className="mt-10 rounded-2xl bg-white p-6 shadow-sm sm:p-8">

              <div className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-2xl">
                  
                </div>

                <h2 className="mt-4 text-2xl font-bold text-gray-900">
                  Need a Transport Service?
                </h2>

                <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-gray-500">
                  Contact {business.name} to check availability,
                  confirm pricing and book your transport service.
                </p>
              </div>

              {/* CONTACT INFORMATION */}
              <div className="mt-7 space-y-4 text-sm text-gray-600">

                {business.address ? (
                  <div className="flex gap-3 rounded-xl bg-gray-50 p-4">
                    <span className="text-xl"></span>

                    <div>
                      <p className="font-semibold text-gray-900">
                        Address
                      </p>

                      <p className="mt-1">
                        {business.address}
                      </p>
                    </div>
                  </div>
                ) : null}

                {business.phone ? (
                  <div className="flex gap-3 rounded-xl bg-gray-50 p-4">
                    <span className="text-xl"></span>

                    <div>
                      <p className="font-semibold text-gray-900">
                        Phone
                      </p>

                      <a
                        href={`tel:${business.phone}`}
                        className="mt-1 block font-medium text-gray-900 hover:underline"
                      >
                        {business.phone}
                      </a>
                    </div>
                  </div>
                ) : null}

                {business.email ? (
                  <div className="flex gap-3 rounded-xl bg-gray-50 p-4">
                    <span className="text-xl"></span>

                    <div>
                      <p className="font-semibold text-gray-900">
                        Email
                      </p>

                      <a
                        href={`mailto:${business.email}`}
                        className="mt-1 block font-medium text-gray-900 hover:underline"
                      >
                        {business.email}
                      </a>
                    </div>
                  </div>
                ) : null}

              </div>

              {/* ACTION BUTTONS */}
              <div className="mt-7 grid gap-3 sm:grid-cols-3">

                {business.phone ? (
                  <a
                    href={`tel:${business.phone}`}
                    className="flex items-center justify-center rounded-xl bg-gray-900 px-5 py-3.5 font-semibold text-white transition hover:bg-gray-800"
                  >
                    
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
                    className="flex items-center justify-center rounded-xl bg-green-600 px-5 py-3.5 font-semibold text-white transition hover:bg-green-700"
                  >
                     WhatsApp
                  </a>
                ) : null}

                {business.googleMapsUrl ? (
                  <a
                    href={business.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center rounded-xl border border-gray-300 bg-white px-5 py-3.5 font-semibold text-gray-900 transition hover:bg-gray-50"
                  >
                    
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

  /*
   * NORMAL BUSINESS EXPERIENCE
   *
   * Restaurant, Hotel, Retail, etc.
   */
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

            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              {business.name}
            </h1>

            {business.description ? (
              <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-gray-300 sm:text-lg">
                {business.description}
              </p>
            ) : null}

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

          {/* AVAILABILITY LEGEND */}
          <div className="mb-8 flex flex-wrap items-center justify-center gap-4 text-sm">

            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-green-500" />

              <span className="font-medium text-gray-700">
                Available
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-red-500" />

              <span className="font-medium text-gray-700">
                Unavailable
              </span>
            </div>

          </div>

          {/* PRODUCTS */}
          {business.products.length === 0 ? (
            <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-2xl">
                ??
              </div>

              <h3 className="mt-5 text-lg font-semibold text-gray-900">
                Services coming soon
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                There are currently no transport services available.
              </p>

            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2">

              {business.products.map((product) => {

                const isAvailable =
                  product.status === "ACTIVE";

                console.log("PRODUCT:", product.name, "STATUS:", product.status);
                return (
                  <article
                    key={product.id}
                    className={`relative overflow-hidden rounded-2xl border bg-white shadow-sm transition ${
                      isAvailable
                        ? "border-gray-200 hover:shadow-md"
                        : "border-red-200"
                    }`}
                  >

                    <div className="p-6">

                      <div className="flex items-start justify-between gap-4">

                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                            ?? Transport Service
                          </p>

                          <h3
                            className={`mt-2 text-xl font-bold ${
                              isAvailable
                                ? "text-gray-900"
                                : "text-gray-500 line-through"
                            }`}
                          >
                            {product.name}
                          </h3>
                        </div>

                        {product.price !== null ? (
                          <span
                            className={`whitespace-nowrap text-lg font-bold ${
                              isAvailable
                                ? "text-gray-900"
                                : "text-gray-400 line-through"
                            }`}
                          >
                            {formatPrice(product.price)}
                          </span>
                        ) : null}

                      </div>

                      {product.description ? (
                        <p
                          className={`mt-3 text-sm leading-6 ${
                            isAvailable
                              ? "text-gray-600"
                              : "text-gray-400"
                          }`}
                        >
                          {product.description}
                        </p>
                      ) : null}

                      {isTransport ? (
                        <div className="mt-5 space-y-3 text-sm">

                          {product.serviceType ? (
                            <p>
                              <span className="font-semibold text-gray-700">
                                Service Type:
                              </span>{" "}
                              {product.serviceType}
                            </p>
                          ) : null}

                          {product.vehicleType ? (
                            <p>
                              <span className="font-semibold text-gray-700">
                                Vehicle:
                              </span>{" "}
                              {product.vehicleType}
                            </p>
                          ) : null}

                          {product.startingLocation ? (
                            <p>
                              <span className="font-semibold text-gray-700">
                                Starting Location:
                              </span>{" "}
                              {product.startingLocation}
                            </p>
                          ) : null}

                          {product.destination ? (
                            <p>
                              <span className="font-semibold text-gray-700">
                                Destination:
                              </span>{" "}
                              {product.destination}
                            </p>
                          ) : null}

                          {product.route ? (
                            <p>
                              <span className="font-semibold text-gray-700">
                                Route:
                              </span>{" "}
                              {product.route}
                            </p>
                          ) : null}

                          {product.availability ? (
                            <p>
                              <span className="font-semibold text-gray-700">
                                Availability:
                              </span>{" "}
                              {product.availability}
                            </p>
                          ) : null}

                        </div>
                      ) : null}

                      {!isAvailable ? (
                        <div className="mt-5 rounded-lg bg-red-50 px-3 py-2 text-center text-sm font-semibold text-red-700">
                          Currently unavailable
                        </div>
                      ) : (
                        <div className="mt-5 rounded-lg bg-green-50 px-3 py-2 text-center text-sm font-semibold text-green-700">
                          Service Available
                        </div>
                      )}

                      {isTransport && isAvailable ? (
                        <a
                          href={`/transport-request?businessId=${encodeURIComponent(business.id)}&productId=${encodeURIComponent(product.id)}&service=${encodeURIComponent(product.name)}`}
                          className="mt-4 block w-full rounded-xl bg-gray-900 px-5 py-3 text-center text-sm font-bold text-white transition hover:bg-gray-800"
                        >
                          ?? Request This Service
                        </a>
                      ) : null}

                    </div>

                  </article>
                );
              })}

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
                  <span className="text-lg"></span>

                  <p>{business.address}</p>
                </div>
              ) : null}

              {business.phone ? (
                <div className="flex gap-3">
                  <span className="text-lg"></span>

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
                  <span className="text-lg"></span>

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
                  <span className="text-lg"></span>

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
                   WhatsApp
                </a>
              ) : null}

              {business.googleMapsUrl ? (
                <a
                  href={business.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-1 items-center justify-center rounded-xl border border-gray-300 bg-white px-5 py-3 font-semibold text-gray-900 transition hover:bg-gray-50"
                >
                  
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







