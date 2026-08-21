import Link from "next/link";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

type CountMap = Record<string, number>;

function incrementCount(
  map: CountMap,
  value: string | null | undefined
) {
  const key = value?.trim() || "Unknown";
  map[key] = (map[key] || 0) + 1;
}

function getPercentage(
  count: number,
  total: number
) {
  if (!total) return 0;

  return Math.round((count / total) * 100);
}

export default async function AnalyticsPage({
  params,
}: PageProps) {
  const { id } = await params;

  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    notFound();
  }

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
          scans: {
            orderBy: {
              scannedAt: "desc",
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

  const scans = business.qrCodes.flatMap((qrCode) =>
    qrCode.scans.map((scan) => ({
      ...scan,
      qrCodeName: qrCode.name,
      qrCodeCode: qrCode.code,
      qrCodeId: qrCode.id,
    }))
  );

  const totalScans = scans.length;

  /* -------------------------------------------------
     Date ranges
  ------------------------------------------------- */

  const now = new Date();

  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);

  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(
    sevenDaysAgo.getDate() - 7
  );

  const thirtyDaysAgo = new Date(now);
  thirtyDaysAgo.setDate(
    thirtyDaysAgo.getDate() - 30
  );

  const todayScans = scans.filter(
    (scan) =>
      new Date(scan.scannedAt) >= startOfToday
  ).length;

  const sevenDayScans = scans.filter(
    (scan) =>
      new Date(scan.scannedAt) >= sevenDaysAgo
  ).length;

  const thirtyDayScans = scans.filter(
    (scan) =>
      new Date(scan.scannedAt) >= thirtyDaysAgo
  ).length;

  /* -------------------------------------------------
     Device / Browser / OS statistics
  ------------------------------------------------- */

  const deviceCounts: CountMap = {};
  const browserCounts: CountMap = {};
  const operatingSystemCounts: CountMap = {};

  for (const scan of scans) {
    incrementCount(
      deviceCounts,
      scan.device
    );

    incrementCount(
      browserCounts,
      scan.browser
    );

    incrementCount(
      operatingSystemCounts,
      scan.operatingSystem
    );
  }

  const sortedDevices = Object.entries(
    deviceCounts
  ).sort((a, b) => b[1] - a[1]);

  const sortedBrowsers = Object.entries(
    browserCounts
  ).sort((a, b) => b[1] - a[1]);

  const sortedOperatingSystems =
    Object.entries(
      operatingSystemCounts
    ).sort((a, b) => b[1] - a[1]);

  /* -------------------------------------------------
     Last 7 days trend
  ------------------------------------------------- */

  const dailyScans = Array.from(
    { length: 7 },
    (_, index) => {
      const date = new Date(now);

      date.setDate(
        now.getDate() - (6 - index)
      );

      date.setHours(0, 0, 0, 0);

      const nextDate = new Date(date);

      nextDate.setDate(
        date.getDate() + 1
      );

      const count = scans.filter(
        (scan) => {
          const scanDate =
            new Date(scan.scannedAt);

          return (
            scanDate >= date &&
            scanDate < nextDate
          );
        }
      ).length;

      return {
        date,
        count,
      };
    }
  );

  const maxDailyScans = Math.max(
    ...dailyScans.map(
      (day) => day.count
    ),
    1
  );

  /* -------------------------------------------------
     QR code performance
  ------------------------------------------------- */

  const qrPerformance =
    business.qrCodes.map((qrCode) => {
      const qrScans = scans.filter(
        (scan) =>
          scan.qrCodeId === qrCode.id
      ).length;

      return {
        id: qrCode.id,
        name: qrCode.name,
        code: qrCode.code,
        status: qrCode.status,
        scans: qrScans,
      };
    });

  qrPerformance.sort(
    (a, b) => b.scans - a.scans
  );

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="mx-auto max-w-7xl px-4 py-8">

        {/* Header */}
        <div className="mb-8">
          <Link
            href={`/businesses/${business.id}`}
            className="text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            ← Back to Business
          </Link>

          <div className="mt-4">
            <h1 className="text-3xl font-bold text-gray-900">
              {business.name} Analytics
            </h1>

            <p className="mt-2 text-gray-600">
              Monitor QR code scans and customer activity.
            </p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Total Scans
            </p>

            <p className="mt-2 text-4xl font-bold text-gray-900">
              {totalScans}
            </p>

            <p className="mt-2 text-xs text-gray-500">
              All recorded scans
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Today's Scans
            </p>

            <p className="mt-2 text-4xl font-bold text-gray-900">
              {todayScans}
            </p>

            <p className="mt-2 text-xs text-gray-500">
              Since midnight
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Last 7 Days
            </p>

            <p className="mt-2 text-4xl font-bold text-gray-900">
              {sevenDayScans}
            </p>

            <p className="mt-2 text-xs text-gray-500">
              Rolling 7-day period
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Last 30 Days
            </p>

            <p className="mt-2 text-4xl font-bold text-gray-900">
              {thirtyDayScans}
            </p>

            <p className="mt-2 text-xs text-gray-500">
              Rolling 30-day period
            </p>
          </div>

        </div>

        {/* 7-Day Trend */}
        <section className="mt-8 rounded-2xl bg-white p-6 shadow-sm">

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Scan Trend
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                QR scans during the last 7 days.
              </p>
            </div>

            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
              {sevenDayScans} scans
            </span>
          </div>

          <div className="mt-8 grid grid-cols-7 gap-3">
            {dailyScans.map((day) => {
              const percentage =
                getPercentage(
                  day.count,
                  maxDailyScans
                );

              return (
                <div
                  key={day.date.toISOString()}
                  className="flex flex-col items-center"
                >
                  <div className="flex h-48 w-full items-end justify-center rounded-lg bg-gray-50 p-2">
                    <div
                      className="w-full max-w-10 rounded-md bg-black transition-all"
                      style={{
                        height: `${Math.max(
                          percentage,
                          day.count > 0 ? 5 : 0
                        )}%`,
                      }}
                      title={`${day.count} scans`}
                    />
                  </div>

                  <p className="mt-3 text-xs font-medium text-gray-700">
                    {day.date.toLocaleDateString(
                      undefined,
                      {
                        weekday: "short",
                      }
                    )}
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    {day.count}
                  </p>
                </div>
              );
            })}
          </div>

        </section>

        {/* Device / Browser / OS */}
        <div className="mt-8 grid gap-6 lg:grid-cols-3">

          {/* Devices */}
          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900">
              Devices
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Devices used for scanning.
            </p>

            <div className="mt-6 space-y-4">
              {sortedDevices.length === 0 ? (
                <p className="text-sm text-gray-500">
                  No scan data yet.
                </p>
              ) : (
                sortedDevices.map(
                  ([device, count]) => (
                    <div key={device}>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                          {device}
                        </span>

                        <span className="text-sm font-semibold text-gray-900">
                          {count}
                        </span>
                      </div>

                      <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100">
                        <div
                          className="h-full rounded-full bg-black"
                          style={{
                            width: `${getPercentage(
                              count,
                              totalScans
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  )
                )
              )}
            </div>
          </section>

          {/* Browsers */}
          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900">
              Browsers
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Browsers detected during scans.
            </p>

            <div className="mt-6 space-y-4">
              {sortedBrowsers.length === 0 ? (
                <p className="text-sm text-gray-500">
                  No browser data yet.
                </p>
              ) : (
                sortedBrowsers.map(
                  ([browser, count]) => (
                    <div key={browser}>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                          {browser}
                        </span>

                        <span className="text-sm font-semibold text-gray-900">
                          {count}
                        </span>
                      </div>

                      <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100">
                        <div
                          className="h-full rounded-full bg-black"
                          style={{
                            width: `${getPercentage(
                              count,
                              totalScans
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  )
                )
              )}
            </div>
          </section>

          {/* Operating Systems */}
          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900">
              Operating Systems
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Operating systems detected during scans.
            </p>

            <div className="mt-6 space-y-4">
              {sortedOperatingSystems.length === 0 ? (
                <p className="text-sm text-gray-500">
                  No operating system data yet.
                </p>
              ) : (
                sortedOperatingSystems.map(
                  ([os, count]) => (
                    <div key={os}>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                          {os}
                        </span>

                        <span className="text-sm font-semibold text-gray-900">
                          {count}
                        </span>
                      </div>

                      <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100">
                        <div
                          className="h-full rounded-full bg-black"
                          style={{
                            width: `${getPercentage(
                              count,
                              totalScans
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  )
                )
              )}
            </div>
          </section>

        </div>

        {/* QR Code Performance */}
        <section className="mt-8 rounded-2xl bg-white shadow-sm">

          <div className="border-b border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900">
              QR Code Performance
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Compare scans across your QR codes.
            </p>
          </div>

          {qrPerformance.length === 0 ? (
            <div className="p-6">
              <p className="text-sm text-gray-500">
                No QR codes created yet.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">

                <thead className="border-b bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 font-semibold text-gray-700">
                      QR Code
                    </th>

                    <th className="px-6 py-4 font-semibold text-gray-700">
                      Status
                    </th>

                    <th className="px-6 py-4 font-semibold text-gray-700">
                      Scans
                    </th>

                    <th className="px-6 py-4 font-semibold text-gray-700">
                      Share
                    </th>

                    <th className="px-6 py-4 font-semibold text-gray-700">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {qrPerformance.map(
                    (qrCode) => (
                      <tr
                        key={qrCode.id}
                        className="border-b last:border-b-0"
                      >
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900">
                            {qrCode.name}
                          </div>

                          <div className="mt-1 break-all text-xs text-gray-500">
                            {qrCode.code}
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                              qrCode.status === "ACTIVE"
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {qrCode.status}
                          </span>
                        </td>

                        <td className="px-6 py-4 font-semibold text-gray-900">
                          {qrCode.scans}
                        </td>

                        <td className="px-6 py-4 text-gray-600">
                          {getPercentage(
                            qrCode.scans,
                            totalScans
                          )}
                          %
                        </td>

                        <td className="px-6 py-4">
                          <Link
                            href={`/businesses/${business.id}/qr-codes/${qrCode.id}`}
                            className="font-medium text-blue-600 hover:text-blue-800"
                          >
                            View QR
                          </Link>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>

              </table>
            </div>
          )}

        </section>

        {/* Recent Scan Activity */}
        <section className="mt-8 rounded-2xl bg-white shadow-sm">

          <div className="border-b border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Recent Scan Activity
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Latest QR code scans for this business.
            </p>
          </div>

          {scans.length === 0 ? (
            <div className="p-6">
              <p className="text-gray-500">
                No scans recorded yet.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">

                <thead className="border-b bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 font-semibold text-gray-700">
                      Date
                    </th>

                    <th className="px-6 py-4 font-semibold text-gray-700">
                      QR Code
                    </th>

                    <th className="px-6 py-4 font-semibold text-gray-700">
                      Device
                    </th>

                    <th className="px-6 py-4 font-semibold text-gray-700">
                      Browser
                    </th>

                    <th className="px-6 py-4 font-semibold text-gray-700">
                      Operating System
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {scans
                    .slice(0, 25)
                    .map((scan) => (
                      <tr
                        key={scan.id}
                        className="border-b last:border-b-0"
                      >
                        <td className="whitespace-nowrap px-6 py-4 text-gray-600">
                          {new Date(
                            scan.scannedAt
                          ).toLocaleString()}
                        </td>

                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900">
                            {scan.qrCodeName}
                          </div>

                          <div className="mt-1 text-xs text-gray-500">
                            {scan.qrCodeCode}
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          {scan.device || "Unknown"}
                        </td>

                        <td className="px-6 py-4">
                          {scan.browser || "Unknown"}
                        </td>

                        <td className="px-6 py-4">
                          {scan.operatingSystem || "Unknown"}
                        </td>
                      </tr>
                    ))}
                </tbody>

              </table>
            </div>
          )}

        </section>

      </div>
    </main>
  );
}