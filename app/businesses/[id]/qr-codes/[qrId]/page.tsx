import Link from "next/link";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import QRCode from "qrcode";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import QRStatusButton from "@/app/components/QRStatusButton";

type PageProps = {
  params: Promise<{
    id: string;
    qrId: string;
  }>;
};

export default async function QRCodeDetailsPage({
  params,
}: PageProps) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    notFound();
  }

  const { id, qrId } = await params;

  const qrCode = await prisma.qRCode.findFirst({
    where: {
      id: qrId,
      businessId: id,
      business: {
        owner: {
          email: session.user.email,
        },
      },
    },
    include: {
      business: true,
      _count: {
        select: {
          scans: true,
        },
      },
    },
  });

  if (!qrCode) {
    notFound();
  }

  const baseUrl =
    process.env.NEXTAUTH_URL || "http://localhost:3000";

  const qrUrl = `${baseUrl}/qr/${qrCode.code}`;

  const qrDataUrl = await QRCode.toDataURL(qrUrl, {
    width: 500,
    margin: 3,
    errorCorrectionLevel: "H",
  });

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-5xl px-4 py-8">

        {/* Header */}
        <div className="mb-8">
          <Link
            href={`/businesses/${id}/qr-codes`}
            className="text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            ← Back to QR Codes
          </Link>

          <h1 className="mt-4 text-3xl font-bold text-gray-900">
            {qrCode.name}
          </h1>

          <p className="mt-2 text-gray-600">
            Manage and download your dynamic QR code.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">

          {/* QR Preview */}
          <section className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <div className="text-center">

              <h2 className="text-xl font-bold text-gray-900">
                QR Code
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Scan this QR code to open the customer menu.
              </p>

              <div className="mx-auto mt-6 flex max-w-sm justify-center rounded-2xl border border-gray-200 bg-white p-5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={qrDataUrl}
                  alt={`QR Code for ${qrCode.name}`}
                  className="h-auto w-full max-w-xs"
                />
              </div>

              <div className="mt-6">
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${
                    qrCode.status === "ACTIVE"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {qrCode.status}
                </span>
              </div>
            </div>
          </section>

          {/* Information */}
          <section className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">

            <h2 className="text-xl font-bold text-gray-900">
              QR Code Information
            </h2>

            <div className="mt-6 space-y-5">

              {/* Business */}
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Business
                </p>

                <p className="mt-1 text-lg font-semibold text-gray-900">
                  {qrCode.business.name}
                </p>
              </div>

              {/* QR Code Name */}
              <div>
                <p className="text-sm font-medium text-gray-500">
                  QR Code Name
                </p>

                <p className="mt-1 text-gray-900">
                  {qrCode.name}
                </p>
              </div>

              {/* Code */}
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Code
                </p>

                <p className="mt-1 break-all rounded-lg bg-gray-50 p-3 font-mono text-sm text-gray-700">
                  {qrCode.code}
                </p>
              </div>

              {/* Dynamic URL */}
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Dynamic URL
                </p>

                <p className="mt-1 break-all rounded-lg bg-gray-50 p-3 text-sm text-blue-600">
                  {qrUrl}
                </p>
              </div>

              {/* Total Scans */}
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Total Scans
                </p>

                <p className="mt-1 text-3xl font-bold text-gray-900">
                  {qrCode._count.scans}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 space-y-3">
            
	     <QRStatusButton
               businessId={id}
               qrId={qrCode.id}
               status={qrCode.status}
            />
              {/* Download QR */}
              <a
                href={qrDataUrl}
                download={`${qrCode.code}.png`}
                className="block w-full rounded-lg bg-black px-5 py-3 text-center text-sm font-semibold text-white hover:bg-gray-800"
              >
                Download PNG
              </a>

              {/* Open Customer Page */}
              <a
                href={qrUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full rounded-lg border border-gray-300 px-5 py-3 text-center text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Open Customer Page
              </a>

              {/* Analytics */}
              <Link
                href={`/businesses/${id}/analytics`}
                className="block w-full rounded-lg border border-gray-300 px-5 py-3 text-center text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                View Analytics
              </Link>
            </div>
          </section>
        </div>

        {/* Printing Instructions */}
        <section className="mt-8 rounded-2xl border border-blue-100 bg-blue-50 p-6">

          <h2 className="text-lg font-bold text-gray-900">
            How to use this QR code
          </h2>

          <ul className="mt-3 space-y-2 text-sm text-gray-700">
            <li>• Download the PNG and print it.</li>
            <li>• Place it on tables, counters, menus, or posters.</li>
            <li>• Customers can scan it with their phone camera.</li>
            <li>• The QR code opens your dynamic customer menu.</li>
            <li>• Every scan is recorded in Analytics.</li>
          </ul>

        </section>

      </div>
    </main>
  );
}