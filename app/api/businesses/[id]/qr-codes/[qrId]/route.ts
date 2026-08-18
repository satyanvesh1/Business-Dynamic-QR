import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{
    id: string;
    qrId: string;
  }>;
};

export async function PATCH(
  request: Request,
  { params }: RouteContext
) {
  try {
    // --------------------------------------------------
    // 1. Check authentication
    // --------------------------------------------------

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

    // --------------------------------------------------
    // 2. Get business ID and QR ID
    // --------------------------------------------------

    const { id, qrId } = await params;

    if (!id || !qrId) {
      return NextResponse.json(
        {
          error: "Business ID and QR code ID are required",
        },
        {
          status: 400,
        }
      );
    }

    // --------------------------------------------------
    // 3. Read request body
    // --------------------------------------------------

    const body = await request.json();

    const status =
      typeof body.status === "string"
        ? body.status.toUpperCase()
        : "";

    // --------------------------------------------------
    // 4. Validate status
    // --------------------------------------------------

    if (
      status !== "ACTIVE" &&
      status !== "INACTIVE"
    ) {
      return NextResponse.json(
        {
          error: "Invalid QR code status",
        },
        {
          status: 400,
        }
      );
    }

    // --------------------------------------------------
    // 5. Find logged-in user
    // --------------------------------------------------

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          error: "User not found",
        },
        {
          status: 404,
        }
      );
    }

    // --------------------------------------------------
    // 6. Verify QR belongs to user's business
    // --------------------------------------------------

    const qrCode = await prisma.qRCode.findFirst({
      where: {
        id: qrId,
        businessId: id,
        business: {
          ownerId: user.id,
        },
      },
      select: {
        id: true,
        businessId: true,
        status: true,
      },
    });

    if (!qrCode) {
      return NextResponse.json(
        {
          error: "QR code not found",
        },
        {
          status: 404,
        }
      );
    }

    // --------------------------------------------------
    // 7. Update QR status
    // --------------------------------------------------

    const updatedQRCode =
      await prisma.qRCode.update({
        where: {
          id: qrCode.id,
        },
        data: {
          status,
        },
      });

    // --------------------------------------------------
    // 8. Return updated QR code
    // --------------------------------------------------

    return NextResponse.json(
      {
        success: true,
        qrCode: updatedQRCode,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "QR CODE STATUS UPDATE ERROR:",
      error
    );

    return NextResponse.json(
      {
        error: "Failed to update QR code status",
      },
      {
        status: 500,
      }
    );
  }
}