import React from 'react'
import { ExpertProfileHeader } from './ExpertProfileHeader'
import { TransactionHistoryTable } from '../Clients/TransactionHistoryTable'
import { ReviewsGivenTable } from '../Clients/ReviewsGivenTable'
import ClientStatsCard from '../Clients/ClientStatsCard'
import { JobStatusTable } from '../Clients/JobStatusTable'
import BackButton from '../shared/BackButton'

export function ExpertDetailsPage() {
    return (
        <div className="space-y-4">
            <BackButton/>
            <ExpertProfileHeader />

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
