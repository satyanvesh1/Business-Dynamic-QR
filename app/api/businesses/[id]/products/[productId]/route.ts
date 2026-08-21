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

    if (
      body.status !== "ACTIVE" &&
      body.status !== "INACTIVE"
    ) {
      return NextResponse.json(
        { error: "Invalid product status" },
        { status: 400 }
      );
    }

    const updatedProduct = await prisma.product.update({
      where: {
        id: productId,
      },
      data: {
        status: body.status,
      },
    });

    return NextResponse.json({
      success: true,
      product: {
        id: updatedProduct.id,
        name: updatedProduct.name,
        status: updatedProduct.status,
        serviceType: updatedProduct.serviceType,
        vehicleType: updatedProduct.vehicleType,
        startingLocation: updatedProduct.startingLocation,
        destination: updatedProduct.destination,
        route: updatedProduct.route,
        availability: updatedProduct.availability,
      },
    });
  } catch (error) {
    console.error(
      "Toggle product availability error:",
      error
    );

    return NextResponse.json(
      {
        error: "Failed to change product availability",
      },
      {
        status: 500,
      }
    );
  }
}

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

    const {
      id: businessId,
      productId,
    } = await params;

    /*
     * Make sure this product belongs to the logged-in
     * user's business.
     */
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

    /*
     * Store price as a 2-decimal string.
     *
     * Example:
     * 249     -> "249.00"
     * 249.5   -> "249.50"
     * 249.95  -> "249.95"
     */
    let price: string | null = null;

    if (
      body.price !== null &&
      body.price !== undefined &&
      body.price !== ""
    ) {
      const parsedPrice = Number(body.price);

      if (
        !Number.isFinite(parsedPrice) ||
        parsedPrice < 0
      ) {
        return NextResponse.json(
          { error: "Invalid product price" },
          { status: 400 }
        );
      }

      price = parsedPrice.toFixed(2);
    }

    /*
     * ACTIVE = Available
     * INACTIVE = Unavailable
     */
    const status =
      body.status === "INACTIVE"
        ? "INACTIVE"
        : "ACTIVE";

    const updatedProduct =
      await prisma.product.update({
        where: {
          id: productId,
        },

        data: {
  name,

  description:
    body.description !== null &&
    body.description !== undefined &&
    String(body.description).trim() !== ""
      ? String(body.description).trim()
      : null,

  price,

  imageUrl:
    body.imageUrl !== null &&
    body.imageUrl !== undefined &&
    String(body.imageUrl).trim() !== ""
      ? String(body.imageUrl).trim()
      : null,

  status,

  serviceType:
    body.serviceType !== null &&
    body.serviceType !== undefined &&
    String(body.serviceType).trim() !== ""
      ? String(body.serviceType).trim()
      : null,

  vehicleType:
    body.vehicleType !== null &&
    body.vehicleType !== undefined &&
    String(body.vehicleType).trim() !== ""
      ? String(body.vehicleType).trim()
      : null,

  startingLocation:
    body.startingLocation !== null &&
    body.startingLocation !== undefined &&
    String(body.startingLocation).trim() !== ""
      ? String(body.startingLocation).trim()
      : null,

  destination:
    body.destination !== null &&
    body.destination !== undefined &&
    String(body.destination).trim() !== ""
      ? String(body.destination).trim()
      : null,

  route:
    body.route !== null &&
    body.route !== undefined &&
    String(body.route).trim() !== ""
      ? String(body.route).trim()
      : null,

  availability:
    body.availability !== null &&
    body.availability !== undefined &&
    String(body.availability).trim() !== ""
      ? String(body.availability).trim()
      : null,
},
      });

    return NextResponse.json({
      success: true,

      product: {
        id: updatedProduct.id,
        name: updatedProduct.name,
        description: updatedProduct.description,
        price:
          updatedProduct.price?.toString() ?? null,
        imageUrl: updatedProduct.imageUrl,
        status: updatedProduct.status,
      },
    });
  } catch (error) {
    console.error("Update product error:", error);

    return NextResponse.json(
      {
        error: "Failed to update product",
      },
      {
        status: 500,
      }
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

    const {
      id: businessId,
      productId,
    } = await params;

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
      {
        error: "Failed to delete product",
      },
      {
        status: 500,
      }
    );
  }
}