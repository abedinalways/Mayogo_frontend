import JobDetatilsPage from '@/components/Job/JobDetatilsPage'
import BackButton from '@/components/shared/BackButton'
import React from 'react'


export default function page() {
  return (
    <div className='space-y-5'>
      <BackButton />
      <JobDetatilsPage />
    </div>
  )
}
