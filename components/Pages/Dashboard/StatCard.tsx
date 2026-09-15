// StatCard.tsx
import React from "react";
import type { LucideIcon } from "lucide-react";
import { TrendingDown, TrendingUp } from "lucide-react";

export interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  glowColor?: string;
  trend?: {
    value: string;
    positive: boolean;
  };
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  glowColor = "#edfbd8",
  trend,
}) => {
  return (
    <div
      className="relative overflow-hidden rounded-xl border border-slate-100/80 bg-white p-4 shadow-[0_4px_20px_rgba(0,0,0,0.015)]"
      style={{
        background: `radial-gradient(circle at 100% 0%, ${glowColor} 0%, #ffffff 70%)`,
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        {Icon && <Icon className="h-5 w-5 text-slate-900" strokeWidth={1.75} />}
        <h3 className="text-[color:var(--Silver-900,#131313)] text-sm font-medium leading-[100%]">
          {title}
        </h3>
      </div>

      {/* Content */}
      <div className="mt-6">
        <span className="self-stretch text-[color:var(--Heading,#103D5C)] text-[32px] font-semibold leading-[124%]">
          {value}
        </span>

        <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
          {trend && (
            <span
              className={`inline-flex items-center gap-1 font-medium ${
                trend.positive ? "text-emerald-600" : "text-rose-500"
              }`}
            >
              {trend.positive ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
              {trend.value}
            </span>
          )}
          <span className="text-[color:var(--Body,#5A5A5A)] text-xs font-normal leading-[100%]">
            {subtitle}
          </span>
        </div>
      </div>
    </div>
  );
};
