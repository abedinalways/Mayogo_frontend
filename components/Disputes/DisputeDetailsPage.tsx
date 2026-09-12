"use client";

import BackButton from '../shared/BackButton'
import DisputeHeader from './DisputeHeader';
import DisputeJobDetails from './DisputeJobDetails';
import DisputeClaimsComparison from './ClaimCard';
import InternalNotes from './InternalNotes';
import RelatedJobSummary from './RelatedJobSummary';
import EscrowPayment from './EscrowPayment';
import DisputeJobTimeline from './DisputeJobTimeline';
import AdminDecisionPanel from './AdminDecisionPanel';

export default function DisputeDetailsPage() {
  return (
    <div className='space-y-5'>
      <BackButton />
      <DisputeHeader />
      <DisputeJobDetails />
      <DisputeClaimsComparison />

      <div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (3 Cards) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <RelatedJobSummary />
            <EscrowPayment />
            <DisputeJobTimeline />
          </div>

          {/* Right Column (2 Cards) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <AdminDecisionPanel />      
            <InternalNotes />
          </div>
        </div>
      </div>
    </div>
  )
}




