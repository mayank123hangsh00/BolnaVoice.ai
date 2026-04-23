// ============================================================
// Lead Types
// ============================================================
export type LeadStatus =
  | "new"
  | "calling"
  | "qualified"
  | "not_interested"
  | "callback"
  | "wrong_number"
  | "no_answer";

export type PropertyType = "apartment" | "villa" | "plot" | "commercial";

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email?: string;
  city: string;
  source: string;
  status: LeadStatus;
  createdAt: string;
  updatedAt: string;
  // Qualification data (filled after AI call)
  qualification?: LeadQualification;
}

export interface LeadQualification {
  interested: boolean;
  budgetMin?: string;
  budgetMax?: string;
  preferredLocation?: string;
  propertyType?: PropertyType;
  timeline?: string;
  wantsSiteVisit?: boolean;
  disposition?: string;
  notes?: string;
}

// ============================================================
// Call Types
// ============================================================
export type CallStatus =
  | "queued"
  | "in-progress"
  | "completed"
  | "failed"
  | "no-answer";

export interface CallRecord {
  id: string;
  leadId: string;
  leadName: string;
  phoneNumber: string;
  agentId: string;
  status: CallStatus;
  duration?: number; // seconds
  transcript?: string;
  summary?: string;
  extractedData?: Record<string, string>;
  createdAt: string;
  completedAt?: string;
}

// ============================================================
// Agent Types
// ============================================================
export interface AgentConfig {
  id?: string;
  name: string;
  welcomeMessage: string;
  systemPrompt: string;
  extractionPrompt: string;
  webhookUrl: string;
  llmModel: string;
  voiceProvider: string;
  voiceId: string;
  language: string;
}

// ============================================================
// Dashboard Stats
// ============================================================
export interface DashboardStats {
  totalLeads: number;
  qualifiedLeads: number;
  totalCalls: number;
  avgCallDuration: number;
  conversionRate: number;
  responseTime: number; // minutes
  callsToday: number;
  leadsToday: number;
}

export interface DailyCallData {
  date: string;
  calls: number;
  qualified: number;
}

// ============================================================
// API Types
// ============================================================
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface BolnaCallPayload {
  agentId: string;
  recipientPhoneNumber: string;
  leadId: string;
  variables?: Record<string, string>;
}

export interface BolnaWebhookPayload {
  execution_id: string;
  agent_id: string;
  status: string;
  duration?: number;
  transcript?: string;
  extracted_data?: Record<string, string>;
  call_data?: {
    recipient_phone_number: string;
    hangup_reason?: string;
  };
}
