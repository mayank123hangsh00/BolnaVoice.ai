"use client";

import { useEffect, useState } from "react";
import StatsCard from "@/components/StatsCard";
import LeadCard from "@/components/LeadCard";
import CallLog from "@/components/CallLog";
import { DashboardStats, Lead, CallRecord } from "@/lib/types";
import { Users, PhoneCall, CheckCircle2, Clock, Activity, AlertCircle } from "lucide-react";

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentLeads, setRecentLeads] = useState<Lead[]>([]);
  const [recentCalls, setRecentCalls] = useState<CallRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsRes, leadsRes, callsRes] = await Promise.all([
          fetch("/api/stats", { cache: "no-store" }),
          fetch("/api/leads", { cache: "no-store" }),
          fetch("/api/calls", { cache: "no-store" }),
        ]);
        
        const statsData = await statsRes.json();
        const leadsData = await leadsRes.json();
        const callsData = await callsRes.json();

        if (statsData.success) setStats(statsData.data.stats);
        if (leadsData.success) setRecentLeads(leadsData.data.slice(0, 4));
        if (callsData.success) setRecentCalls(callsData.data.slice(0, 4));
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Activity className="w-8 h-8 text-[var(--color-brand)] animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
          Dashboard Overview
          <span className="badge badge-qualified text-xs py-1">
            <span className="pulse-dot mr-1" /> Live
          </span>
        </h1>
        <p className="text-[var(--text-secondary)]">
          Real-time metrics from your Bolna AI Voice agent.
        </p>
      </header>

      {/* Stats Grid */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Leads"
            value={stats.totalLeads}
            subtitle={`${stats.leadsToday} today`}
            trend="up"
            trendValue="+12%"
            icon={<Users className="w-5 h-5" />}
            variant="brand"
          />
          <StatsCard
            title="Qualified Leads"
            value={stats.qualifiedLeads}
            subtitle={`Conversion: ${stats.conversionRate}%`}
            trend="up"
            trendValue="+5%"
            icon={<CheckCircle2 className="w-5 h-5" />}
            variant="success"
          />
          <StatsCard
            title="Total Calls Made"
            value={stats.totalCalls}
            subtitle={`${stats.callsToday} today`}
            icon={<PhoneCall className="w-5 h-5" />}
            variant="warning"
          />
          <StatsCard
            title="Avg Response Time"
            value={`${stats.responseTime}m`}
            subtitle="AI callback speed"
            trend="neutral"
            icon={<Clock className="w-5 h-5" />}
            variant="brand"
          />
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Leads */}
        <div className="lg:col-span-1 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-[var(--color-brand-light)]" />
              Recent Leads
            </h2>
            <a href="/leads" className="text-xs font-medium text-[var(--color-brand-light)] hover:text-white transition-colors">
              View all
            </a>
          </div>
          <div className="glass-card flex flex-col divide-y divide-white/[0.06]">
            {recentLeads.length > 0 ? (
              recentLeads.map((lead) => (
                <div key={lead.id} className="p-1">
                  <LeadCard lead={lead} compact />
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-[var(--text-tertiary)] flex flex-col items-center gap-2">
                <AlertCircle className="w-8 h-8 opacity-50" />
                <p>No recent leads found.</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Calls */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-400" />
              Live Call Activity
            </h2>
            <a href="/calls" className="text-xs font-medium text-[var(--color-brand-light)] hover:text-white transition-colors">
              View all calls
            </a>
          </div>
          <div className="space-y-3">
            {recentCalls.length > 0 ? (
              recentCalls.map((call) => (
                <CallLog key={call.id} call={call} />
              ))
            ) : (
              <div className="glass-card p-12 text-center text-[var(--text-tertiary)] flex flex-col items-center gap-3">
                <PhoneCall className="w-10 h-10 opacity-20" />
                <p>No call activity yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
