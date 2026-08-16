
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ProductsPage({ params }: PageProps) {
  const { id } = await params;

  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login");
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
    notFound();
  }

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Link
              href={`/businesses/${business.id}`}
              className="text-sm font-medium text-blue-600 hover:underline"
            >
              ← Back to Business
            </Link>

            <h1 className="mt-4 text-3xl font-bold text-gray-900">
              Products
            </h1>

            <p className="mt-2 text-gray-600">
              Manage products for {business.name}.
            </p>
          </div>

          <Link
            href={`/businesses/${business.id}/products/new`}
            className="rounded-lg bg-black px-5 py-3 text-sm font-semibold text-white hover:bg-gray-800"
          >
            + Add Product
          </Link>
        </div>

        {business.products.length === 0 ? (
          <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900">
              No products yet
            </h2>

            <p className="mt-2 text-gray-500">
              Add your first product to make it available on the customer menu.
            </p>

            <Link
              href={`/businesses/${business.id}/products/new`}
              className="mt-6 inline-block rounded-lg bg-black px-5 py-3 text-sm font-semibold text-white"
            >
              Add Your First Product
            </Link>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="border-b bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                      Product
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                      Price
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                      Status
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                      Created
                    </th>

                    <th className="px-6 py-4 text-sm font-semibold text-gray-700">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {business.products.map((product) => (
                    <tr
                      key={product.id}
                      className="border-b last:border-b-0"
                    >
                      <td className="px-6 py-5">
                        <div className="font-semibold text-gray-900">
                          {product.name}
                        </div>

                        {product.description && (
                          <div className="mt-1 max-w-md text-sm text-gray-500">
                            {product.description}
                          </div>
                        )}
                      </td>

                      <td className="px-6 py-5 font-medium text-gray-900">
                        {product.price !== null
                          ? `₹${Number(product.price).toFixed(2)}`
                          : "—"}
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            product.status === "ACTIVE"
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {product.status}
                        </span>
                      </td>

                      <td className="px-6 py-5 text-sm text-gray-500">
                        {new Date(product.createdAt).toLocaleDateString()}
                      </td>

                      <td className="px-6 py-5">
                        <Link
                          href={`/businesses/${business.id}/products/${product.id}/edit`}
                          className="font-medium text-blue-600 hover:underline"
                        >
                          Edit
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
