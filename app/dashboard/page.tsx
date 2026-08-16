import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-gray-100">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Dynamic QR
            </h1>
            <p className="text-sm text-gray-500">
              Business Management Dashboard
            </p>
          </div>

          <div className="text-right">
            <p className="font-medium text-gray-900">
              {session.user.name || "Administrator"}
            </p>

            <p className="text-sm text-gray-500">
              {session.user.email}
            </p>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <h2 className="text-3xl font-bold text-gray-900">
          Welcome to Dynamic QR
        </h2>

        <p className="mt-2 text-gray-600">
          Manage your businesses, products, QR codes and scan analytics.
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <DashboardCard
            title="Businesses"
            value="0"
            description="Manage businesses"
          />

          <DashboardCard
            title="Products"
            value="0"
            description="Manage products"
          />

          <DashboardCard
            title="QR Codes"
            value="0"
            description="Manage dynamic QR codes"
          />

          <DashboardCard
            title="Scans"
            value="0"
            description="View scan analytics"
          />
        </div>

        <div className="mt-8 rounded-2xl bg-white p-8 shadow-sm">
          <h3 className="text-xl font-semibold text-gray-900">
            Getting Started
          </h3>

          <p className="mt-2 text-gray-600">
            Your Dynamic QR business platform is ready for configuration.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <ActionCard
              number="01"
              title="Create Business"
              description="Add your first business account."
            />

            <ActionCard
              number="02"
              title="Add Products"
              description="Create products for your business."
            />

            <ActionCard
              number="03"
              title="Generate QR"
              description="Create dynamic QR codes."
            />
          </div>
        </div>
      </section>
    </main>
  );
}

function DashboardCard({
  title,
  value,
  description,
}: {
  title: string;
  value: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <p className="text-sm font-medium text-gray-500">{title}</p>

      <p className="mt-3 text-4xl font-bold text-gray-900">
        {value}
      </p>

      <p className="mt-2 text-sm text-gray-500">
        {description}
      </p>
    </div>
  );
}

function ActionCard({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-gray-200 p-5">
      <span className="text-sm font-bold text-blue-600">
        {number}
      </span>

      <h4 className="mt-2 font-semibold text-gray-900">
        {title}
      </h4>

      <p className="mt-1 text-sm text-gray-500">
        {description}
      </p>
    </div>
  );
}