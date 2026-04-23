"use client";

import { useEffect, useState } from "react";
import LeadCard from "@/components/LeadCard";
import AddLeadModal from "@/components/AddLeadModal";
import { Lead } from "@/lib/types";
import { Plus, Users, Search, Filter } from "lucide-react";

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const res = await fetch("/api/leads");
      const data = await res.json();
      if (data.success) {
        setLeads(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch leads:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddLead = async (newLeadData: any) => {
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newLeadData),
      });
      const data = await res.json();
      if (data.success) {
        setLeads([data.data, ...leads]);
      }
    } catch (error) {
      console.error("Failed to add lead:", error);
    }
  };

  const handleCallLead = async (leadId: string) => {
    try {
      // Optimistic update
      setLeads((prev) =>
        prev.map((l) => (l.id === leadId ? { ...l, status: "calling" } : l))
      );

      const res = await fetch("/api/call", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId }),
      });
      const data = await res.json();
      
      if (!data.success) {
        console.error("Call failed:", data.error);
        fetchLeads(); // Revert on error
      }
    } catch (error) {
      console.error("Failed to initiate call:", error);
      fetchLeads();
    }
  };

  const filteredLeads = leads.filter((l) => 
    l.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    l.phone.includes(searchQuery) ||
    l.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <Users className="w-8 h-8 text-[var(--color-brand)]" />
            Lead Management
          </h1>
          <p className="text-[var(--text-secondary)] mt-1">
            Manage your real estate leads and initiate AI qualification calls.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary"
        >
          <Plus className="w-5 h-5" />
          Add New Lead
        </button>
      </header>

      {/* Filters & Search */}
      <div className="glass-card p-4 flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="Search leads by name, phone, or city..."
            className="input-field pl-10 w-full bg-white/[0.02]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button className="btn-secondary w-full sm:w-auto">
          <Filter className="w-4 h-4" />
          Filters
        </button>
      </div>

      {/* Leads Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="glass-card p-5 h-48 animate-pulse bg-white/[0.02]" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredLeads.map((lead) => (
            <LeadCard
              key={lead.id}
              lead={lead}
              onCall={handleCallLead}
            />
          ))}
          {filteredLeads.length === 0 && (
            <div className="col-span-full py-12 text-center text-[var(--text-tertiary)]">
              No leads found matching your criteria.
            </div>
          )}
        </div>
      )}

      <AddLeadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddLead}
      />
    </div>
  );
}
