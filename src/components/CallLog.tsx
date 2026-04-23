"use client";

import { CallRecord } from "@/lib/types";
import {
  Phone,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  PhoneOff,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useState } from "react";

interface CallLogProps {
  call: CallRecord;
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function getCallStatusIcon(status: string) {
  switch (status) {
    case "completed":
      return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
    case "in-progress":
      return <Loader2 className="w-4 h-4 text-amber-400 animate-spin" />;
    case "failed":
      return <XCircle className="w-4 h-4 text-red-400" />;
    case "no-answer":
      return <PhoneOff className="w-4 h-4 text-[var(--text-tertiary)]" />;
    default:
      return <Phone className="w-4 h-4 text-[var(--text-tertiary)]" />;
  }
}

export default function CallLog({ call }: CallLogProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="glass-card overflow-hidden">
      <div
        className="flex items-center gap-4 p-4 cursor-pointer hover:bg-white/[0.02] transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="w-10 h-10 rounded-xl bg-white/[0.04] flex items-center justify-center">
          {getCallStatusIcon(call.status)}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-white">{call.leadName}</p>
            <span
              className={`badge ${
                call.status === "completed"
                  ? "badge-qualified"
                  : call.status === "in-progress"
                  ? "badge-calling"
                  : "badge-no-answer"
              }`}
            >
              {call.status}
            </span>
          </div>
          <p className="text-xs text-[var(--text-tertiary)] mt-0.5 font-mono">
            {call.phoneNumber}
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs text-[var(--text-secondary)]">
          {call.duration && (
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[var(--text-tertiary)]" />
              <span className="font-mono">{formatDuration(call.duration)}</span>
            </div>
          )}
          <span className="text-[var(--text-muted)]">
            {new Date(call.createdAt).toLocaleDateString("en-IN", {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
          {expanded ? (
            <ChevronUp className="w-4 h-4 text-[var(--text-muted)]" />
          ) : (
            <ChevronDown className="w-4 h-4 text-[var(--text-muted)]" />
          )}
        </div>
      </div>

      {expanded && (
        <div className="border-t border-white/[0.06] p-5 space-y-4 animate-in slide-in-from-top-2">
          {call.summary && (
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-tertiary)] mb-2">
                Summary
              </h4>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                {call.summary}
              </p>
            </div>
          )}

          {call.extractedData && (
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-tertiary)] mb-2">
                Extracted Data
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {Object.entries(call.extractedData).map(([key, value]) => (
                  <div
                    key={key}
                    className="p-2.5 rounded-lg bg-white/[0.03] border border-white/[0.04]"
                  >
                    <span className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] block">
                      {key.replace(/_/g, " ")}
                    </span>
                    <span className="text-xs text-white font-medium mt-0.5 block">
                      {String(value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {call.transcript && (
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-tertiary)] mb-2">
                Transcript
              </h4>
              <div className="transcript-container text-sm">
                {call.transcript.split("\\n").map((line, i) => (
                  <span
                    key={i}
                    className={
                      line.startsWith("AI:")
                        ? "ai-line"
                        : line.trim()
                        ? "user-line"
                        : ""
                    }
                  >
                    {line}
                    {"\\n"}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
