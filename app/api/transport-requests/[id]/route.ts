import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const allowedStatuses = [
  "REQUESTED",
  "CONTACTED",
  "CONFIRMED",
  "COMPLETED",
  "CANCELLED",
] as const;

type Status = (typeof allowedStatuses)[number];

export async function PATCH(
  request: Request,
  context: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();

    const status = body.status as Status;

    if (!allowedStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Invalid transport request status." },
        { status: 400 }
      );
    }

    const existingRequest =
      await prisma.transportRequest.findUnique({
        where: { id },
      });

    if (!existingRequest) {
      return NextResponse.json(
        { error: "Transport request not found." },
        { status: 404 }
      );
    }

    const updatedRequest =
      await prisma.transportRequest.update({
        where: { id },
        data: { status },
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
      { error: "Failed to update transport request." },
      { status: 500 }
    );
  }
}
