"use client";

import { useEffect } from "react";

type ScanTrackerProps = {
  code: string;
};

export default function ScanTracker({
  code,
}: ScanTrackerProps) {
  useEffect(() => {
    let cancelled = false;

    async function trackScan() {
      try {
        await fetch("/api/qr/scan", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            code,
          }),
          keepalive: true,
        });
      } catch (error) {
        if (!cancelled) {
          console.error(
            "Failed to record QR scan:",
            error
          );
        }
      }
    }

    trackScan();

    return () => {
      cancelled = true;
    };
  }, [code]);

  return null;
}