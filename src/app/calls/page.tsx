"use client";

import { useEffect, useState } from "react";
import CallLog from "@/components/CallLog";
import { CallRecord } from "@/lib/types";
import { Phone, Search, Download, Filter } from "lucide-react";

export default function CallsPage() {
  const [calls, setCalls] = useState<CallRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchCalls() {
      try {
        const res = await fetch("/api/calls");
        const data = await res.json();
        if (data.success) {
          setCalls(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch calls:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchCalls();
  }, []);

  const filteredCalls = calls.filter((c) => 
    c.leadName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.phoneNumber.includes(searchQuery)
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <Phone className="w-8 h-8 text-indigo-400" />
            Call History
          </h1>
          <p className="text-[var(--text-secondary)] mt-1">
            Detailed logs, transcripts, and extracted data from AI conversations.
          </p>
        </div>
        <button className="btn-secondary">
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </header>

      {/* Filters & Search */}
      <div className="glass-card p-4 flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="Search calls by lead name or phone..."
            className="input-field pl-10 w-full bg-white/[0.02]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <select className="input-field bg-white/[0.02]">
            <option value="all">All Statuses</option>
            <option value="completed">Completed</option>
            <option value="in-progress">In Progress</option>
            <option value="failed">Failed / No Answer</option>
          </select>
          <button className="btn-icon shrink-0">
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Calls List */}
      <div className="space-y-4">
        {loading ? (
          [1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="glass-card p-6 h-20 animate-pulse bg-white/[0.02]" />
          ))
        ) : filteredCalls.length > 0 ? (
          filteredCalls.map((call) => (
            <CallLog key={call.id} call={call} />
          ))
        ) : (
          <div className="glass-card p-12 text-center text-[var(--text-tertiary)] flex flex-col items-center gap-3">
            <Phone className="w-12 h-12 opacity-20" />
            <p className="text-lg font-medium text-[var(--text-secondary)]">No call records found</p>
            <p className="text-sm">Initiate a call from the Leads tab to see activity here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
