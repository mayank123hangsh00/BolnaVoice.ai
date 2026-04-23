"use client";

import { ReactNode } from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  icon: ReactNode;
  variant?: "brand" | "success" | "warning" | "error";
}

export default function StatsCard({
  title,
  value,
  subtitle,
  trend,
  trendValue,
  icon,
  variant = "brand",
}: StatsCardProps) {
  const TrendIcon =
    trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;
  const trendColor =
    trend === "up"
      ? "text-emerald-400"
      : trend === "down"
      ? "text-red-400"
      : "text-[var(--text-tertiary)]";

  return (
    <div
      className={`glass-card stat-card stat-card-${variant} p-5 flex flex-col gap-3`}
    >
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--text-tertiary)]">
            {title}
          </span>
          <span className="text-3xl font-bold tracking-tight text-white">
            {value}
          </span>
        </div>
        <div className="w-11 h-11 rounded-xl bg-white/[0.04] flex items-center justify-center text-[var(--text-tertiary)]">
          {icon}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {trend && trendValue && (
          <span
            className={`flex items-center gap-1 text-xs font-semibold ${trendColor}`}
          >
            <TrendIcon className="w-3 h-3" />
            {trendValue}
          </span>
        )}
        {subtitle && (
          <span className="text-xs text-[var(--text-muted)]">{subtitle}</span>
        )}
      </div>
    </div>
  );
}
