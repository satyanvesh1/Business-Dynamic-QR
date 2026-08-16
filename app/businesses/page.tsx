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

  return (
    <main className="min-h-screen bg-gray-100">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Business Management
            </h1>

            <p className="text-sm text-gray-500">
              Manage all your businesses
            </p>
          </div>

          <a
            href="/businesses/new"
            className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
          >
            + Create Business
          </a>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-10">
        {businesses.length === 0 ? (
          <div className="rounded-2xl bg-white p-12 text-center shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900">
              No businesses yet
            </h2>

            <p className="mt-2 text-gray-500">
              Create your first business to get started.
            </p>

            <a
              href="/businesses/new"
              className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
            >
              Create Your First Business
            </a>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {businesses.map((business) => (
              <div
                key={business.id}
                className="rounded-2xl bg-white p-6 shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {business.name}
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                      {business.city || "Location not specified"}
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      business.isPublished
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {business.isPublished ? "Published" : "Draft"}
                  </span>
                </div>

                {business.description && (
                  <p className="mt-4 text-sm text-gray-600">
                    {business.description}
                  </p>
                )}

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-gray-50 p-3">
                    <p className="text-xs text-gray-500">
                      Products
                    </p>

                    <p className="mt-1 text-xl font-bold">
                      {business._count.products}
                    </p>
                  </div>

                  <div className="rounded-lg bg-gray-50 p-3">
                    <p className="text-xs text-gray-500">
                      QR Codes
                    </p>

                    <p className="mt-1 text-xl font-bold">
                      {business._count.qrCodes}
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  <a
                    href={`/businesses/${business.id}`}
                    className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-center text-sm font-medium hover:bg-gray-50"
                  >
                    Manage
                  </a>

                  <a
                    href={`/businesses/${business.id}/edit`}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50"
                  >
                    Edit
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}