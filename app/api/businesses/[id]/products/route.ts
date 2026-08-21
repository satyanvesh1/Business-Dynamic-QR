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
    /*
     * Check login
     */
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    /*
     * Get business ID
     */
    const { id: businessId } = await params;

    /*
     * Verify that this business belongs
     * to the logged-in user.
     */
    const business = await prisma.business.findFirst({
      where: {
        id: businessId,
        owner: {
          email: session.user.email,
        },
      },
      select: {
        id: true,
        name: true,
        businessType: true,
      },
    });

    if (!business) {
      return NextResponse.json(
        {
          error: "Business not found",
        },
        {
          status: 404,
        }
      );
    }

    /*
     * Read request body
     */
    const body = await request.json();

    /*
     * Product / Service name
     */
    const name = String(body.name ?? "").trim();

    if (!name) {
      return NextResponse.json(
        {
          error: "Product or service name is required",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * Price
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
          {
            error: "Invalid product price",
          },
          {
            status: 400,
          }
        );
      }

      price = parsedPrice.toFixed(2);
    }

    /*
     * Status
     */
    const status =
      body.status === "INACTIVE"
        ? "INACTIVE"
        : "ACTIVE";

    /*
     * Determine whether this is a transport business.
     */
    const isTransport =
      business.businessType === "TRANSPORT_SERVICES";

    /*
     * Transport fields
     */
    const serviceType =
      isTransport &&
      body.serviceType !== null &&
      body.serviceType !== undefined &&
      String(body.serviceType).trim() !== ""
        ? String(body.serviceType).trim()
        : null;

    const vehicleType =
      isTransport &&
      body.vehicleType !== null &&
      body.vehicleType !== undefined &&
      String(body.vehicleType).trim() !== ""
        ? String(body.vehicleType).trim()
        : null;

    const startingLocation =
      isTransport &&
      body.startingLocation !== null &&
      body.startingLocation !== undefined &&
      String(body.startingLocation).trim() !== ""
        ? String(body.startingLocation).trim()
        : null;

    const destination =
      isTransport &&
      body.destination !== null &&
      body.destination !== undefined &&
      String(body.destination).trim() !== ""
        ? String(body.destination).trim()
        : null;

    const route =
      isTransport &&
      body.route !== null &&
      body.route !== undefined &&
      String(body.route).trim() !== ""
        ? String(body.route).trim()
        : null;

    const availability =
      isTransport &&
      body.availability !== null &&
      body.availability !== undefined &&
      String(body.availability).trim() !== ""
        ? String(body.availability).trim()
        : null;

    /*
     * Create Product / Service
     */
    const product = await prisma.product.create({
      data: {
        businessId,

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

        /*
         * Transport service details
         */
        serviceType,
        vehicleType,
        startingLocation,
        destination,
        route,
        availability,
      },
    });

    /*
     * Return created product
     */
    return NextResponse.json(
      {
        success: true,

        message: isTransport
          ? "Transport service created successfully"
          : "Product created successfully",

        product: {
          id: product.id,
          businessId: product.businessId,
          name: product.name,
          description: product.description,

          price:
            product.price?.toString() ?? null,

          imageUrl: product.imageUrl,
          status: product.status,

          serviceType: product.serviceType,
          vehicleType: product.vehicleType,
          startingLocation: product.startingLocation,
          destination: product.destination,
          route: product.route,
          availability: product.availability,
        },
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "Create product/service error:",
      error
    );

    return NextResponse.json(
      {
        error: "Failed to create product or service",
      },
      {
        status: 500,
      }
    );
  }
}