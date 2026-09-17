import { Suspense } from "react";
import SettingsContainer from "@/components/Pages/Settings/SettingsContainer";

export default function SettingsPage() {
  return (
    <Suspense fallback={null}>
      <SettingsContainer />
    </Suspense>
  );
}
