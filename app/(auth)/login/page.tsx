import { Suspense } from "react";
import Login from "@/components/Auth/Login";

export default function LoginPage() {
  return (
    <main className="p-4">
      <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
        <Login />
      </Suspense>
    </main>
  );
}
