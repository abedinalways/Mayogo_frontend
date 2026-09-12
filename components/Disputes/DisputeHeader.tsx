import CustomButton from "../shared/CustomButton";

export interface DisputeHeaderProps {
    ticketId?: string;
    status?: string;
    category?: string;
    serviceName?: string;
    onViewChatHistory?: () => void;
  }
   export default function DisputeHeader({
    ticketId = "",
    status = "Under Review",
    category = "",
    serviceName = "Air Conditioner (AC) Repair",
    onViewChatHistory,
  }: DisputeHeaderProps) {
    return (
      <div className="w-full flex items-center justify-between gap-4 font-['Manrope']">
        {/* Left Content */}
        <div className="flex flex-col gap-1.5">
          {/* Ticket ID & Status Badge */}
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-[#0a3558] leading-none">
            #DSP-10482
            </h1>
  
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded border border-amber-200 bg-amber-50">
              <span className="h-2 w-2 rounded-full bg-amber-500" />
              <span className="text-xs font-semibold text-amber-600 leading-none">
              Under Review
              </span>
            </div>
          </div>
  
          {/* Category Breadcrumbs / Subtitle */}
          <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
            <span>Repair & Diagnostic</span>
            <span className="h-1 w-1 rounded-full bg-slate-300" />
            <span>{serviceName}</span>
          </div>
        </div>
  
        {/* Right Action Button */}
        <CustomButton
          variant="primary"
          size="lg"
          onClick={onViewChatHistory}
        >
          View Chat History
        </CustomButton>
      </div>
    );
  }