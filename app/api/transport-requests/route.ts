import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      businessId,
      productId,
      customerName,
      customerPhone,
      pickupLocation,
      destination,
      travelDate,
      travelTime,
      passengers,
      notes,
    } = body;

    if (!businessId || !productId) {
      return NextResponse.json(
        { error: "Business and service are required" },
        { status: 400 }
      );
    }

    if (!customerName?.trim()) {
      return NextResponse.json(
        { error: "Customer name is required" },
        { status: 400 }
      );
    }

    if (!customerPhone?.trim()) {
      return NextResponse.json(
        { error: "Customer phone number is required" },
        { status: 400 }
      );
    }

    if (!pickupLocation?.trim()) {
      return NextResponse.json(
        { error: "Pickup location is required" },
        { status: 400 }
      );
    }

    if (!destination?.trim()) {
      return NextResponse.json(
        { error: "Destination is required" },
        { status: 400 }
      );
    }

    const business = await prisma.business.findUnique({
      where: {
        id: businessId,
      },
    });

    if (!business) {
      return NextResponse.json(
        { error: "Business not found" },
        { status: 404 }
      );
    }

    const product = await prisma.product.findFirst({
      where: {
        id: productId,
        businessId,
        status: "ACTIVE",
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Transport service is unavailable" },
        { status: 404 }
      );
    }

    let passengerCount: number | null = null;

    if (
      passengers !== undefined &&
      passengers !== null &&
      passengers !== ""
    ) {
      const parsedPassengers = Number(passengers);

      if (
        !Number.isInteger(parsedPassengers) ||
        parsedPassengers < 1
      ) {
        return NextResponse.json(
          { error: "Passenger count must be at least 1" },
          { status: 400 }
        );
      }

      passengerCount = parsedPassengers;
    }

    const requestRecord =
      await prisma.transportRequest.create({
        data: {
          businessId,
          productId,

          customerName: customerName.trim(),

          customerPhone: customerPhone.trim(),

          pickupLocation:
            pickupLocation?.trim() || null,

          destination:
            destination?.trim() || null,

          travelDate:
            travelDate?.trim() || null,

          travelTime:
            travelTime?.trim() || null,

          passengerCount,

          notes:
            notes?.trim() || null,
        },
      });

    return NextResponse.json(
      {
        success: true,
        request: {
          id: requestRecord.id,
          status: requestRecord.status,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "Create transport request error:",
      error
    );

    return NextResponse.json(
      {
        error: "Failed to submit transport request",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();

    const { requestId, status } = body;

    const allowedStatuses = [
      "REQUESTED",
      "CONTACTED",
      "CONFIRMED",
      "COMPLETED",
      "CANCELLED",
    ];

    if (!requestId || !status) {
      return NextResponse.json(
        { error: "Request ID and status are required" },
        { status: 400 }
      );
    }

    if (!allowedStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Invalid request status" },
        { status: 400 }
      );
    }

    const existingRequest =
      await prisma.transportRequest.findUnique({
        where: {
          id: requestId,
        },
      });

    if (!existingRequest) {
      return NextResponse.json(
        { error: "Transport request not found" },
        { status: 404 }
      );
    }

    const updatedRequest =
      await prisma.transportRequest.update({
        where: {
          id: requestId,
        },
        data: {
          status,
        },
      });

    return NextResponse.json({
      success: true,
      request: {
        id: updatedRequest.id,
        status: updatedRequest.status,
      },
    });
  } catch (error) {
    console.error(
      "Update transport request error:",
      error
    );

    return NextResponse.json(
      {
        error: "Failed to update transport request",
      },
      { status: 500 }
    );
  }
}
