"use client";



import BackButton from '../shared/BackButton'
import CustomButton from '../shared/CustomButton';
import DisputeHeader from './DisputeHeader';
import DisputeJobDetails from './DisputeJobDetails';
import DisputeClaimsComparison from './ClaimCard';

export default function DisputeDetailsPage() {
  return (
    <div className='space-y-5'>
        <BackButton />
        <DisputeHeader />
        <DisputeJobDetails />
        <DisputeClaimsComparison />
    </div>
  )
}




