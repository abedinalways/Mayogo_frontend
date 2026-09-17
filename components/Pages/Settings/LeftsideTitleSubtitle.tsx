import React from 'react'

export default function LeftsideTitleSubtitle({ title, subtitle, subtitleWidth = "max-w-[470px]" }: { title: string, subtitle: string, subtitleWidth?: string }) {
    return (
        <div className={`lg:col-span-5 space-y-2 ${subtitleWidth}`}>
            <h2 className="text-lg font-medium text-[#103D5C]">
                {title}
            </h2>
            <p className="text-sm text-[#5A5A5A] leading-[160%]">
                {subtitle}
            </p>
        </div>
    )
}
