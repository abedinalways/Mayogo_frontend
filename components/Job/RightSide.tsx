import React from 'react'
import { InfoCard } from './InfoCard'
import { PaymentSummaryCard } from '../Dashboard/PaymentSummaryCard'
import JobStatusTimeline from './JobStatusTimeline'

export default function RightSide() {
  return (
    <div className="flex flex-col gap-4 w-full ">
        <InfoCard
        title="Client Information"
        name="Sarah William"
        idText="Client ID #CET001"
        avatarUrl="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
        phone="999-(1234)-555"
        onViewProfile={() => console.log("View Client Profile")}
      />

      {/* Expert Card */}
      <InfoCard
        title="Expert Information"
        name="Alex Morgan"
        idText="Expert ID #EXP001"
        subtitle="Senior Electrician"
        avatarUrl="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80"
        isVerified={true}
        rating="4.8"
        onViewProfile={() => console.log("View Expert Profile")}
      />

      <PaymentSummaryCard />

      <JobStatusTimeline />
    </div>
  )
}
