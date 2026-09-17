import { Suspense } from "react";
import { RolesAndPermissionsContainer } from "@/components/Pages/RolesPermissions/RolesAndPermissionsContainer";

export default function RolesPermissionsPage() {
  return (
    <Suspense fallback={null}>
      <RolesAndPermissionsContainer />
    </Suspense>
  );
}
