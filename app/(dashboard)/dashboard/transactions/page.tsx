import { PagePlaceholder } from "@/components/Pages/Dashboard/PagePlaceholder";
import CommisionPlatform from "@/components/Pages/Transaction/CommisionPlatform";
import TransactionStatsCard from "@/components/Pages/Transaction/StatusCard";
import TransactionTable from "@/components/Pages/Transaction/TransactionTable";

export default function TransactionsPage() {
  return (
    <div className="space-y-5">
      <TransactionStatsCard />
      <CommisionPlatform />
      <TransactionTable />
    </div>
  );
}
