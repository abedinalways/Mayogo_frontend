"use client"

import React from 'react'
import { JobHeader } from './JobHeader'
import RightSide from './RightSide'
import JobCompletionEvidence from './JobCompletionEvidence';
import JobDetails from './JobDetails';

export default function JobDetatilsPage() {
    return (
        <>
            <div className='card-container grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.6fr)_minmax(280px,0.9fr)]'>
                <div className="flex flex-col gap-5">
                    <JobHeader />

                    <JobDetails />

                    <JobCompletionEvidence />   
                </div>

                <RightSide />

            </div>
        </>



    );
}