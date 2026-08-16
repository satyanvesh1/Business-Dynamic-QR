import { NextResponse } from "next/server";
import { PrismaClient } from "@/app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { UAParser } from "ua-parser-js";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const code = body.code;

    if (!code) {
      return NextResponse.json(
        { error: "QR code is required" },
        { status: 400 }
      );
    }

    const qrCode = await prisma.qRCode.findUnique({
      where: {
        code,
      },
    });

    if (!qrCode || qrCode.status !== "ACTIVE") {
      return NextResponse.json(
        { error: "QR code not found or inactive" },
        { status: 404 }
      );
    }

    const userAgent = request.headers.get("user-agent") || null;

    const parser = new UAParser(userAgent || undefined);
    const result = parser.getResult();

    const device =
      result.device.type ||
      (result.device.model
        ? result.device.model
        : "desktop");

    const browser = result.browser.name || null;

    const operatingSystem = result.os.name
      ? `${result.os.name}${result.os.version ? ` ${result.os.version}` : ""}`
      : null;

    const forwardedFor = request.headers.get("x-forwarded-for");

    const ipAddress =
      forwardedFor?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      null;

    const scan = await prisma.scan.create({
      data: {
        qrCodeId: qrCode.id,
        userAgent,
        ipAddress,
        device,
        browser,
        operatingSystem,
      },
    });

    return NextResponse.json({
      success: true,
      scanId: scan.id,
    });
  } catch (error) {
    console.error("SCAN ERROR:", error);

    return NextResponse.json(
      { error: "Failed to record scan" },
      { status: 500 }
    );
  }
}