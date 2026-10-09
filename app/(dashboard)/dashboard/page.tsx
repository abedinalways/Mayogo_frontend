import DashboardStatsCard from "@/components/Pages/Dashboard/DashboardStatsCard";
import { MonthlyEarnings } from "@/components/Pages/Dashboard/MonthlyEarnings";
import { TopCategoriesCard } from "@/components/Pages/Dashboard/TopCategories";
import { RecentJobsTable } from "@/components/Pages/Dashboard/RecentJobsTable";
import TopExperts from "@/components/Pages/Dashboard/TopExperts";
import RecentActivityCard from "@/components/Pages/Dashboard/RecentActivityCard";

export default function DashboardPage() {
  return (
    <div className="space-y-4">
      <DashboardStatsCard />
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.6fr)_minmax(280px,0.9fr)]">
        <MonthlyEarnings />
        <TopCategoriesCard />
      </div>
      <RecentJobsTable />
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.6fr)_minmax(280px,0.9fr)]">
        <RecentActivityCard />
        <TopExperts />
      </div>
    </div>
  );
}
