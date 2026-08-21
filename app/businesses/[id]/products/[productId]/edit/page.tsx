import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import EditProductForm from "./EditProductForm";

type PageProps = {
  params: Promise<{
    id: string;
    productId: string;
  }>;
};

export default async function EditProductPage({
  params,
}: PageProps) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login");
  }

  const { id, productId } = await params;

  const product = await prisma.product.findFirst({
    where: {
      id: productId,
      businessId: id,
      business: {
        owner: {
          email: session.user.email,
        },
      },
    },
    include: {
      business: {
        select: {
          name: true,
        },
      },
    },
  });

  if (!product) {
    notFound();
  }

  return (
    <EditProductForm
      businessId={id}
      businessName={product.business.name}
      product={{
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price?.toString() ?? null,
        imageUrl: product.imageUrl,
        status: product.status,
      }}
    />
  );
}