import { JobStatusTable } from "@/components/Clients/JobStatusTable";
import { ReviewsGivenTable } from "@/components/Clients/ReviewsGivenTable";
import { TransactionHistoryTable } from "@/components/Clients/TransactionHistoryTable";
import { ClientHeader } from "@/components/Clients/ClientHeader";
import ClientStats from "@/components/Clients/ClientStats";
import ClientStatsCard from "@/components/Clients/ClientStatsCard";
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
