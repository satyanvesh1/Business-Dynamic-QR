import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@/app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
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

    const body = await request.json();

    const name = body.name?.trim();
    const status = body.status || "ACTIVE";

    if (!name) {
      return NextResponse.json(
        { error: "QR code name is required" },
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

    const business = await prisma.business.findFirst({
      where: {
        id,
        ownerId: user.id,
      },
    });

    if (!business) {
      return NextResponse.json(
        { error: "Business not found" },
        { status: 404 }
      );
    }

    const code = `${business.slug}-${Math.random()
      .toString(36)
      .substring(2, 10)}`;

    const qrCode = await prisma.qRCode.create({
      data: {
        businessId: business.id,
        name,
        code,
        status,
      },
    });

    return NextResponse.json(
      {
        success: true,
        qrCode,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("QR CODE CREATE ERROR:", error);

    return NextResponse.json(
      { error: "Failed to create QR code" },
      { status: 500 }
    );
  }
}