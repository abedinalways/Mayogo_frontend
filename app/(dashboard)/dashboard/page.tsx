import DashboardStatsCard from "@/components/Dashboard/DashboardStatsCard";
import { MonthlyEarnings } from "@/components/Dashboard/MonthlyEarnings";
import { TopCategoriesCard } from "@/components/Dashboard/TopCategories";


export default function DashboardPage() {
  return (
    <div className="space-y-4">
      <DashboardStatsCard />
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.6fr)_minmax(280px,0.9fr)]">
        <MonthlyEarnings />
        <TopCategoriesCard />
      </div>
    </div>
  );
}
