
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{
    id: string;
    productId: string;
  }>;
};

export async function PUT(
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

    const { id: businessId, productId } = await params;

    const product = await prisma.product.findFirst({
      where: {
        id: productId,
        businessId,
        business: {
          owner: {
            email: session.user.email,
          },
        },
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    const body = await request.json();

    const name = String(body.name ?? "").trim();

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

    const updatedProduct = await prisma.product.update({
      where: {
        id: productId,
      },
      data: {
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

    return NextResponse.json({
      success: true,
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Update product error:", error);

    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
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

    const { id: businessId, productId } = await params;

    const product = await prisma.product.findFirst({
      where: {
        id: productId,
        businessId,
        business: {
          owner: {
            email: session.user.email,
          },
        },
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    await prisma.product.delete({
      where: {
        id: productId,
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("Delete product error:", error);

    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
