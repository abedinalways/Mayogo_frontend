import { JobStatusTable } from "@/components/Pages/Clients/JobStatusTable";
import { ReviewsGivenTable } from "@/components/Pages/Clients/ReviewsGivenTable";
import { TransactionHistoryTable } from "@/components/Pages/Clients/TransactionHistoryTable";
import { ClientHeader } from "@/components/Pages/Clients/ClientHeader";
import ClientStats from "@/components/Pages/Clients/ClientStats";
import ClientStatsCard from "@/components/Pages/Clients/ClientStatsCard";
export default function page() {
    return (
        <div className="space-y-4">
            <ClientHeader />
            <ClientStatsCard />
            <JobStatusTable />
            <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
                <div className="col-span-1">
                    <TransactionHistoryTable />
                </div>
                <div className="col-span-1">

                    <ReviewsGivenTable />
                </div>
            </div>
        </div>
    )
}
