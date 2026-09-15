import SubscriptionStatsCard from "@/components/Pages/Subscription/SubscriptionStatsCard";
import SubscriptionTable from "@/components/Pages/Subscription/SubscriptionTable";

export default function SubscriptionsPage() {
  return (
    <div className="space-y-6">
      <SubscriptionStatsCard />
      <SubscriptionTable />
    </div>
  );
}
