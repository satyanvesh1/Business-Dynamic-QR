import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import EditBusinessForm from "./EditBusinessForm";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditBusinessPage({
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
  });

  if (!business) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <a
          href={`/businesses/${business.id}`}
          className="text-sm font-medium text-blue-600 hover:underline"
        >
          ← Back to Business
        </a>

        <div className="mt-6 rounded-2xl bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-bold text-gray-900">
            Edit Business
          </h1>

          <p className="mt-2 text-gray-500">
            Update the information for {business.name}.
          </p>

          <div className="mt-8">
            <EditBusinessForm
              business={{
                id: business.id,
                name: business.name,
                businessType: business.businessType,
                description: business.description,
                phone: business.phone,
                whatsapp: business.whatsapp,
                email: business.email,
                website: business.website,
                address: business.address,
                city: business.city,
                state: business.state,
                country: business.country,
                postalCode: business.postalCode,
                googleMapsUrl: business.googleMapsUrl,
                isPublished: business.isPublished,
              }}
            />
          </div>
        </div>
      </div>
    </main>
  );
}