"use client";

import { useEffect } from "react";
import { ErrorView } from "@/components/Status/ErrorView";

export default function ErrorPage({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return <ErrorView error={error} retry={retry} fullPage />;
}
