
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
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
    /*
     * 1. Check authentication
     */
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "You must be logged in." },
        { status: 401 }
      );
    }

    /*
     * 2. Get request ID and requested status
     */
    const { id } = await context.params;
    const body = await request.json();

    const status = body.status as Status;

    /*
     * 3. Validate status
     */
    if (!allowedStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Invalid transport request status." },
        { status: 400 }
      );
    }

    /*
     * 4. Find the transport request and verify
     *    that the logged-in user owns the business.
     */
    const existingRequest =
      await prisma.transportRequest.findFirst({
        where: {
          id,
          business: {
            owner: {
              email: session.user.email,
            },
          },
        },
      });

    /*
     * This intentionally returns the same response whether
     * the request does not exist or belongs to another owner.
     */
    if (!existingRequest) {
      return NextResponse.json(
        { error: "Transport request not found." },
        { status: 404 }
      );
    }

    /*
     * 5. Update the request
     */
    const updatedRequest =
      await prisma.transportRequest.update({
        where: {
          id,
        },
        data: {
          status,
        },
      });

    /*
     * 6. Return the updated status
     */
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
        error: "Failed to update transport request.",
      },
      { status: 500 }
    );
  }
}