import React from 'react'

export default function ClientStats() {
    return (
        <section className='grid grid-cols-2 gap-4'>

            <div className="self-stretch h-32 p-4 rounded-xl shadow-[2px_2px_22px_0px_rgba(55,36,31,0.01)] outline outline-1 outline-offset-[-1px] outline-Card-bg inline-flex flex-col justify-between items-start">
                <div className="self-stretch inline-flex justify-start items-center gap-2.5">
                    <div className="size-4 relative overflow-hidden">
                        <div className="size-3.5 left-[1.50px] top-[1.50px] absolute outline outline-[1.50px] outline-offset-[-0.75px] outline-Silver-900" />
                        <div className="size-[3px] left-[7.50px] top-[8.37px] absolute outline outline-[1.50px] outline-offset-[-0.75px] outline-Silver-900" />
                    </div>
                    <div className="justify-start text-Silver-900 text-sm font-medium font-['Manrope'] leading-4">Total Job Requested</div>
                </div>
                <div className="self-stretch justify-start text-Heading text-3xl font-semibold font-['Manrope'] leading-10">14</div>
            </div><div className="self-stretch h-32 p-4 rounded-xl shadow-[2px_2px_22px_0px_rgba(55,36,31,0.01)] outline outline-1 outline-offset-[-1px] outline-Card-bg inline-flex flex-col justify-between items-start">
                <div className="self-stretch inline-flex justify-start items-center gap-2.5">
                    <div className="size-4 relative overflow-hidden">
                        <div className="size-3.5 left-[1.50px] top-[1.50px] absolute outline outline-[1.50px] outline-offset-[-0.75px] outline-Silver-900" />
                        <div className="size-[3px] left-[7.50px] top-[8.37px] absolute outline outline-[1.50px] outline-offset-[-0.75px] outline-Silver-900" />
                    </div>
                    <div className="justify-start text-Silver-900 text-sm font-medium font-['Manrope'] leading-4">Total Job Requested</div>
                </div>
                <div className="self-stretch justify-start text-Heading text-3xl font-semibold font-['Manrope'] leading-10">14</div>
            </div>

        </section>

    )
}
