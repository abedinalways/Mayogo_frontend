import { Suspense } from "react";
import ContentManagementContainer from "@/components/Pages/ContentManagement/ContentManagementContainer";

export default function ContentManagementPage() {
  return (
    <Suspense fallback={null}>
      <ContentManagementContainer />
    </Suspense>
  );
}
