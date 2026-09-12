import DashboardStatsCard from "@/components/Dashboard/DashboardStatsCard";
import { MonthlyEarnings } from "@/components/Dashboard/MonthlyEarnings";
import { TopCategoriesCard } from "@/components/Dashboard/TopCategories";
import { RecentJobsTable } from "@/components/Dashboard/RecentJobsTable";
import TopExperts from "@/components/Dashboard/TopExperts";
import RecentActivityCard from "@/components/Dashboard/RecentActivityCard";
import BackButton from "@/components/shared/BackButton";


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
