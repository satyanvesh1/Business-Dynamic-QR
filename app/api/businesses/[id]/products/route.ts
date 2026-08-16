import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function POST(
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

    const { id: businessId } = await params;

    // Verify that the logged-in user owns this business
    const business = await prisma.business.findFirst({
      where: {
        id: businessId,
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

    const name = String(body.name || "").trim();

    if (!name) {
      return NextResponse.json(
        { error: "Product name is required" },
        { status: 400 }
      );
    }

    let price = null;

    if (
      body.price !== null &&
      body.price !== undefined &&
      body.price !== ""
    ) {
      const parsedPrice = Number(body.price);

      if (!Number.isFinite(parsedPrice) || parsedPrice < 0) {
        return NextResponse.json(
          { error: "Invalid product price" },
          { status: 400 }
        );
      }

      price = parsedPrice;
    }

    const product = await prisma.product.create({
      data: {
        businessId,
        name,
        description: body.description
          ? String(body.description).trim()
          : null,
        price,
        imageUrl: body.imageUrl
          ? String(body.imageUrl).trim()
          : null,
        status:
          body.status === "INACTIVE"
            ? "INACTIVE"
            : "ACTIVE",
      },
    });

    return NextResponse.json(
      {
        success: true,
        product,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create product error:", error);

    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}