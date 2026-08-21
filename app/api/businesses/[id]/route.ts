import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { BusinessType } from "@/app/generated/prisma/client";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

/**
 * GET BUSINESS
 */
export async function GET(
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

    const { id } = await params;

    const business = await prisma.business.findFirst({
      where: {
        id,
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
        { error: "Business not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      business,
    });
  } catch (error) {
    console.error("Get business error:", error);

    return NextResponse.json(
      {
        error: "Failed to load business",
      },
      {
        status: 500,
      }
    );
  }
}

/**
 * UPDATE BUSINESS
 */
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

    const name = String(body.name ?? "").trim();

    if (!name) {
      return NextResponse.json(
        { error: "Business name is required" },
        { status: 400 }
      );
    }

    /*
     * BUSINESS TYPE
     *
     * Convert the incoming string into the Prisma BusinessType enum.
     */
    const rawBusinessType = String(
      body.businessType ?? business.businessType
    ).trim();

    const validBusinessTypes = Object.values(BusinessType);

    const businessType = validBusinessTypes.includes(
      rawBusinessType as BusinessType
    )
      ? (rawBusinessType as BusinessType)
      : business.businessType;

    const updatedBusiness = await prisma.business.update({
      where: {
        id: business.id,
      },

      data: {
        name,

        businessType,

        description:
          body.description !== undefined
            ? String(body.description).trim() || null
            : business.description,

        phone:
          body.phone !== undefined
            ? String(body.phone).trim() || null
            : business.phone,

        whatsapp:
          body.whatsapp !== undefined
            ? String(body.whatsapp).trim() || null
            : business.whatsapp,

        email:
          body.email !== undefined
            ? String(body.email).trim() || null
            : business.email,

        website:
          body.website !== undefined
            ? String(body.website).trim() || null
            : business.website,

        address:
          body.address !== undefined
            ? String(body.address).trim() || null
            : business.address,

        city:
          body.city !== undefined
            ? String(body.city).trim() || null
            : business.city,

        state:
          body.state !== undefined
            ? String(body.state).trim() || null
            : business.state,

        country:
          body.country !== undefined
            ? String(body.country).trim() || null
            : business.country,

        postalCode:
          body.postalCode !== undefined
            ? String(body.postalCode).trim() || null
            : business.postalCode,

        googleMapsUrl:
          body.googleMapsUrl !== undefined
            ? String(body.googleMapsUrl).trim() || null
            : business.googleMapsUrl,

        isPublished:
          body.isPublished !== undefined
            ? Boolean(body.isPublished)
            : business.isPublished,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Business updated successfully",
      business: updatedBusiness,
    });
  } catch (error) {
    console.error("Update business error:", error);

    return NextResponse.json(
      {
        error: "Failed to update business",
      },
      {
        status: 500,
      }
    );
  }
}

/**
 * DELETE BUSINESS
 */
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

    const { id } = await params;

    /*
     * Make sure this business belongs to
     * the currently logged-in user.
     */
    const business = await prisma.business.findFirst({
      where: {
        id,
        owner: {
          email: session.user.email,
        },
      },

      select: {
        id: true,
        name: true,
      },
    });

    if (!business) {
      return NextResponse.json(
        { error: "Business not found" },
        { status: 404 }
      );
    }

    /*
     * Delete the business.
     *
     * Prisma cascade relationships will also delete:
     *
     * Business
     *   ├── Products
     *   └── QR Codes
     *         └── Scan records
     */
    await prisma.business.delete({
      where: {
        id: business.id,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Business deleted successfully",
    });
  } catch (error) {
    console.error("Delete business error:", error);

    return NextResponse.json(
      {
        error: "Failed to delete business",
      },
      {
        status: 500,
      }
    );
  }
}