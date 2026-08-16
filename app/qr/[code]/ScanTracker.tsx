"use client";

import { useEffect } from "react";

export default function ScanTracker({
  code,
}: {
  code: string;
}) {
  useEffect(() => {
    const storageKey = `qr-scan-${code}`;

    if (sessionStorage.getItem(storageKey)) {
      return;
    }

    sessionStorage.setItem(storageKey, "true");

    fetch("/api/qr/scan", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code,
      }),
    }).catch((error) => {
      console.error("Failed to record QR scan:", error);
    });
  }, [code]);

  return null;
}