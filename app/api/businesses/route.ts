import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function createSlug(name: string) {
  return (
    name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") +
    "-" +
    Math.random().toString(36).substring(2, 8)
  );
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();

    if (!body.name?.trim()) {
      return NextResponse.json(
        { error: "Business name is required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const business = await prisma.business.create({
      data: {
        ownerId: user.id,
        name: body.name.trim(),
        slug: createSlug(body.name),
        description: body.description?.trim() || null,
        phone: body.phone?.trim() || null,
        whatsapp: body.whatsapp?.trim() || null,
        email: body.email?.trim() || null,
        website: body.website?.trim() || null,
        address: body.address?.trim() || null,
        city: body.city?.trim() || null,
        state: body.state?.trim() || null,
        country: body.country?.trim() || null,
        postalCode: body.postalCode?.trim() || null,
        googleMapsUrl: body.googleMapsUrl?.trim() || null,
      },
    });

    return NextResponse.json(
      {
        success: true,
        business,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create business error:", error);

    return NextResponse.json(
      { error: "Failed to create business" },
      { status: 500 }
    );
  }
}