"use client";

import { Lead, LeadStatus } from "@/lib/types";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
  PhoneCall,
  PhoneOff,
  RotateCw,
  AlertCircle,
} from "lucide-react";

interface LeadCardProps {
  lead: Lead;
  onCall?: (leadId: string) => void;
  onViewDetails?: (lead: Lead) => void;
  compact?: boolean;
}

function getStatusBadge(status: LeadStatus) {
  const config: Record<
    LeadStatus,
    { label: string; className: string; icon: React.ReactNode }
  > = {
    new: {
      label: "New",
      className: "badge-new",
      icon: <AlertCircle className="w-3 h-3" />,
    },
    calling: {
      label: "Calling...",
      className: "badge-calling",
      icon: <PhoneCall className="w-3 h-3" />,
    },
    qualified: {
      label: "Qualified",
      className: "badge-qualified",
      icon: <CheckCircle2 className="w-3 h-3" />,
    },
    not_interested: {
      label: "Not Interested",
      className: "badge-not-interested",
      icon: <XCircle className="w-3 h-3" />,
    },
    callback: {
      label: "Callback",
      className: "badge-callback",
      icon: <RotateCw className="w-3 h-3" />,
    },
    wrong_number: {
      label: "Wrong #",
      className: "badge-wrong-number",
      icon: <PhoneOff className="w-3 h-3" />,
    },
    no_answer: {
      label: "No Answer",
      className: "badge-no-answer",
      icon: <PhoneOff className="w-3 h-3" />,
    },
  };
  const s = config[status];
  return (
    <span className={`badge ${s.className}`}>
      {s.icon}
      {s.label}
    </span>
  );
}

export default function LeadCard({
  lead,
  onCall,
  onViewDetails,
  compact,
}: LeadCardProps) {
  const timeAgo = getTimeAgo(lead.createdAt);

  if (compact) {
    return (
      <div
        className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/[0.02] transition-colors cursor-pointer"
        onClick={() => onViewDetails?.(lead)}
      >
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center text-sm font-bold text-indigo-400">
          {lead.name.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white truncate">{lead.name}</p>
          <p className="text-xs text-[var(--text-tertiary)]">
            {lead.city} • {timeAgo}
          </p>
        </div>
        {getStatusBadge(lead.status)}
      </div>
    );
  }

  return (
    <div className="glass-card p-5 flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center text-base font-bold text-indigo-400">
            {lead.name.charAt(0)}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">{lead.name}</h3>
            <p className="text-xs text-[var(--text-tertiary)] mt-0.5">
              {lead.source} • {timeAgo}
            </p>
          </div>
        </div>
        {getStatusBadge(lead.status)}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
          <Phone className="w-3.5 h-3.5 text-[var(--text-tertiary)]" />
          <span className="font-mono">{lead.phone}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
          <MapPin className="w-3.5 h-3.5 text-[var(--text-tertiary)]" />
          <span>{lead.city}</span>
        </div>
        {lead.email && (
          <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)] col-span-2">
            <Mail className="w-3.5 h-3.5 text-[var(--text-tertiary)]" />
            <span className="truncate">{lead.email}</span>
          </div>
        )}
      </div>

      {lead.qualification && (
        <div className="p-3 rounded-xl bg-emerald-500/[0.06] border border-emerald-500/10">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-[var(--text-tertiary)]">Budget:</span>
              <span className="ml-1 text-emerald-400 font-medium">
                ₹{lead.qualification.budgetMin} - ₹{lead.qualification.budgetMax}
              </span>
            </div>
            <div>
              <span className="text-[var(--text-tertiary)]">Location:</span>
              <span className="ml-1 text-white font-medium">
                {lead.qualification.preferredLocation}
              </span>
            </div>
            <div>
              <span className="text-[var(--text-tertiary)]">Type:</span>
              <span className="ml-1 text-white font-medium capitalize">
                {lead.qualification.propertyType}
              </span>
            </div>
            <div>
              <span className="text-[var(--text-tertiary)]">Timeline:</span>
              <span className="ml-1 text-white font-medium">
                {lead.qualification.timeline}
              </span>
            </div>
          </div>
          {lead.qualification.wantsSiteVisit && (
            <div className="flex items-center gap-1.5 mt-2 text-xs text-amber-400">
              <Clock className="w-3 h-3" />
              <span className="font-medium">Wants site visit</span>
            </div>
          )}
        </div>
      )}

      <div className="flex gap-2 mt-auto">
        {(lead.status === "new" || lead.status === "callback") && (
          <button
            className="btn-primary text-xs flex-1"
            onClick={() => onCall?.(lead.id)}
          >
            <PhoneCall className="w-3.5 h-3.5" />
            Call Now
          </button>
        )}
        <button
          className="btn-secondary text-xs flex-1"
          onClick={() => onViewDetails?.(lead)}
        >
          View Details
        </button>
      </div>
    </div>
  );
}

function getTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}
