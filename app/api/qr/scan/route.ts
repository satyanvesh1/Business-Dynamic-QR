import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const code = body.code?.trim();

    if (!code) {
      return NextResponse.json(
        {
          error: "QR code is required",
        },
        {
          status: 400,
        }
      );
    }

    const qrCode = await prisma.qRCode.findUnique({
      where: {
        code,
      },
      select: {
        id: true,
        status: true,
        businessId: true,
        business: {
          select: {
            id: true,
            isPublished: true,
          },
        },
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

    if (qrCode.status !== "ACTIVE") {
      return NextResponse.json(
        {
          error: "QR code is inactive",
        },
        {
          status: 403,
        }
      );
    }

    if (!qrCode.business.isPublished) {
      return NextResponse.json(
        {
          error: "Business is not published",
        },
        {
          status: 403,
        }
      );
    }

    /*
     * Create scan record.
     *
     * We intentionally do not require
     * the customer to log in.
     */
    const scan = await prisma.scan.create({
      data: {
        qrCodeId: qrCode.id,
      },
    });

    return NextResponse.json(
      {
        success: true,
        scanId: scan.id,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "QR SCAN ERROR:",
      error
    );

    return NextResponse.json(
      {
        error: "Failed to record scan",
      },
      {
        status: 500,
      }
    );
  }
}