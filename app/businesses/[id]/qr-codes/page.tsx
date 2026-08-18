import Link from "next/link";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import QRCode from "qrcode";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function QRCodesPage({
  params,
}: PageProps) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    notFound();
  }

  const { id } = await params;

  const business = await prisma.business.findFirst({
    where: {
      id,
      owner: {
        email: session.user.email,
      },
    },
    include: {
      qrCodes: {
        include: {
          _count: {
            select: {
              scans: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!business) {
    notFound();
  }

  const baseUrl =
    process.env.NEXTAUTH_URL || "http://localhost:3000";

  const qrCodesWithImages = await Promise.all(
    business.qrCodes.map(async (qrCode) => {
      const qrUrl = `${baseUrl}/qr/${qrCode.code}`;

      const qrDataUrl = await QRCode.toDataURL(qrUrl, {
        width: 320,
        margin: 2,
        errorCorrectionLevel: "H",
      });

      return {
        ...qrCode,
        qrUrl,
        qrDataUrl,
      };
    })
  );

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8">

        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              href={`/businesses/${business.id}`}
              className="text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              ← Back to Business
            </Link>

            <h1 className="mt-3 text-3xl font-bold text-gray-900">
              QR Codes
            </h1>

            <p className="mt-1 text-gray-600">
              Manage dynamic QR codes for {business.name}.
            </p>
          </div>

          <Link
            href={`/businesses/${business.id}/qr-codes/new`}
            className="inline-flex items-center justify-center rounded-lg bg-black px-5 py-3 text-sm font-semibold text-white hover:bg-gray-800"
          >
            + Generate QR Code
          </Link>
        </div>

        {/* Business Card */}
        <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {business.name}
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                {business.city}
                {business.state
                  ? `, ${business.state}`
                  : ""}
              </p>
            </div>

            <span
              className={`inline-flex w-fit rounded-full px-3 py-1 text-sm font-semibold ${
                business.isPublished
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {business.isPublished
                ? "Published"
                : "Unpublished"}
            </span>
          </div>
        </div>

        {/* Empty State */}
        {qrCodesWithImages.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center shadow-sm">

            <div className="text-6xl">
              ▦
            </div>

            <h2 className="mt-5 text-xl font-bold text-gray-900">
              No QR codes yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-gray-500">
              Create your first dynamic QR code to start
              tracking customer scans.
            </p>

            <Link
              href={`/businesses/${business.id}/qr-codes/new`}
              className="mt-6 inline-flex rounded-lg bg-black px-5 py-3 text-sm font-semibold text-white hover:bg-gray-800"
            >
              Generate Your First QR
            </Link>
          </div>
        ) : (
          <div className="space-y-6">

            {qrCodesWithImages.map((qrCode) => (
              <div
                key={qrCode.id}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
              >

                <div className="grid gap-8 p-6 lg:grid-cols-[260px_1fr]">

                  {/* QR Preview */}
                  <div className="flex flex-col items-center justify-center">

                    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                      <img
                        src={qrCode.qrDataUrl}
                        alt={`QR Code for ${qrCode.name}`}
                        className="h-52 w-52"
                      />
                    </div>

                    <p className="mt-3 text-center text-xs text-gray-500">
                      Scan to open customer menu
                    </p>

                    <a
                      href={qrCode.qrDataUrl}
                      download={`${qrCode.name}-QR.png`}
                      className="mt-4 inline-flex rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800"
                    >
                      Download PNG
                    </a>
                  </div>

                  {/* Information */}
                  <div className="min-w-0">

                    {/* Title */}
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">

                      <div>
                        <div className="flex flex-wrap items-center gap-3">

                          <h2 className="text-2xl font-bold text-gray-900">
                            {qrCode.name}
                          </h2>

                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              qrCode.status === "ACTIVE"
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {qrCode.status}
                          </span>

                        </div>

                        <p className="mt-1 text-sm text-gray-500">
                          Dynamic QR code
                        </p>
                      </div>

                      {/* Scan Count */}
                      <div className="rounded-xl bg-gray-50 px-6 py-4 text-center">
                        <div className="text-3xl font-bold text-gray-900">
                          {qrCode._count.scans}
                        </div>

                        <div className="mt-1 text-xs font-medium text-gray-500">
                          TOTAL SCANS
                        </div>
                      </div>
                    </div>

                    {/* Information */}
                    <div className="mt-8 grid gap-5 sm:grid-cols-2">

                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                          QR Code
                        </p>

                        <p className="mt-1 break-all text-sm font-medium text-gray-700">
                          {qrCode.code}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                          Created
                        </p>

                        <p className="mt-1 text-sm font-medium text-gray-700">
                          {qrCode.createdAt.toLocaleString()}
                        </p>
                      </div>

                    </div>

                    {/* Dynamic URL */}
                    <div className="mt-5">

                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                        Dynamic URL
                      </p>

                      <div className="mt-2 flex flex-col gap-2 sm:flex-row">

                        <div className="min-w-0 flex-1 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
                          <p className="break-all text-sm text-blue-600">
                            {qrCode.qrUrl}
                          </p>
                        </div>

                        <a
                          href={qrCode.qrUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                        >
                          Open
                        </a>

                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-8 flex flex-wrap gap-3">

                      <Link
                        href={`/businesses/${business.id}/qr-codes/${qrCode.id}`}
                        className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                      >
                        View QR Details
                      </Link>

                      <Link
                        href={`/businesses/${business.id}/analytics`}
                        className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                      >
                        Analytics
                      </Link>

                      <a
                        href={qrCode.qrUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-lg bg-black px-4 py-2.5 text-sm font-semibold text-white hover:bg-gray-800"
                      >
                        Open Customer Page
                      </a>

                    </div>

                  </div>
                </div>

                {/* Footer */}
                <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">

                  <div className="flex flex-col gap-2 text-sm text-gray-500 sm:flex-row sm:items-center sm:justify-between">

                    <span>
                      Every scan is automatically recorded in Analytics.
                    </span>

                    <Link
                      href={`/businesses/${business.id}/analytics`}
                      className="font-semibold text-blue-600 hover:text-blue-800"
                    >
                      View scan analytics →
                    </Link>

                  </div>

                </div>

              </div>
            ))}

          </div>
        )}

      </div>
    </main>
  );
}