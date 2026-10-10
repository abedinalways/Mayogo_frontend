import { Suspense } from "react";
import Login from "@/components/Auth/Login";

export default function LoginPage() {
  return (
    <main className="min-h-screen p-2 sm:p-4 flex flex-col justify-center">
      <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
        <Login />
      </Suspense>
    </main>
  );
}
