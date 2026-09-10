"use client";

import { useEffect } from "react";
import { ErrorView } from "@/components/Status/ErrorView";
import "./globals.css";

export default function GlobalError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <ErrorView error={error} retry={retry} fullPage />
      </body>
    </html>
  );
}
