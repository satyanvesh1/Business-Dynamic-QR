import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(
  request: Request,
  { params }: RouteContext
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
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
      return NextResponse.json(
        { error: "Business not found" },
        { status: 404 }
      );
    }

    const body = await request.json();

    const updatedBusiness = await prisma.business.update({
      where: {
        id: business.id,
      },
      data: {
        name: body.name,
        description: body.description || null,
        phone: body.phone || null,
        whatsapp: body.whatsapp || null,
        email: body.email || null,
        website: body.website || null,
        address: body.address || null,
        city: body.city || null,
        state: body.state || null,
        country: body.country || null,
        postalCode: body.postalCode || null,
        googleMapsUrl: body.googleMapsUrl || null,
        isPublished: Boolean(body.isPublished),
      },
    });

    return NextResponse.json({
      success: true,
      business: updatedBusiness,
    });
  } catch (error) {
    console.error("Update business error:", error);

    return NextResponse.json(
      { error: "Failed to update business" },
      { status: 500 }
    );
  }
}