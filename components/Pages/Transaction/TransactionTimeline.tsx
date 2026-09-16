import React from "react";

export default function TransactionTimeline({ timeline }: { timeline?: any }) {
  return (
    <div>
      <div>
        <div className="bg-white rounded-2xl border border-[#E8E8E8] shadow-xs">
          <h2 className="text-primary text-[18px] font-semibold leading-[132%]  p-4">
            Transaction Timeline
          </h2>
          <hr className="" />

          <div className="divide-y divide-[#F2F4F7] p-4">
            {timeline?.map((item: any, index: any) => (
              <div
                key={index}
                className="flex items-center justify-between py-3.5 first:pt-1 last:pb-1"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className={`h-2.5 w-2.5 shrink-0 rounded-full ${item.dotColor}`}
                  />
                  <div className="min-w-0">
                    <p className="text-primary text-[14px] font-normal leading-[100%]">
                      {item.title}
                    </p>
                    <p className="text-[#5A5A5A] text-[12px] font-normal leading-[160%] mt-1">
                      {item.description}
                    </p>
                  </div>
                </div>

                <span className="text-[#5A5A5A] text-[14px] font-medium leading-[160%] shrink-0 ml-4">
                  {item.time}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
