"use client";

import { useEffect, useState, FormEvent } from "react";
import { AgentConfig } from "@/lib/types";
import { Bot, Save, Loader2, Link2, Key, AlertTriangle } from "lucide-react";

export default function AgentPage() {
  const [config, setConfig] = useState<AgentConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    async function fetchConfig() {
      try {
        const res = await fetch("/api/agent");
        const data = await res.json();
        if (data.success) {
          setConfig(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch agent config:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchConfig();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!config) return;

    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/agent", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      const data = await res.json();
      
      if (data.success) {
        setConfig(data.data);
        setMessage({ type: "success", text: "Agent configuration saved successfully." });
      } else {
        setMessage({ type: "error", text: data.error || "Failed to save configuration." });
      }
    } catch (error) {
      setMessage({ type: "error", text: "An unexpected error occurred." });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 5000);
    }
  };

  if (loading || !config) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-[var(--color-brand)] animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-5xl mx-auto">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <Bot className="w-8 h-8 text-purple-400" />
            Agent Configuration
          </h1>
          <p className="text-[var(--text-secondary)] mt-1">
            Configure Bolna Voice AI prompts, extractions, and behavior.
          </p>
        </div>
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="btn-primary"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? "Saving..." : "Save Configuration"}
        </button>
      </header>

      {message && (
        <div className={`p-4 rounded-xl flex items-center gap-3 text-sm font-medium ${
          message.type === "success" 
            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
            : "bg-red-500/10 text-red-400 border border-red-500/20"
        }`}>
          {message.type === "success" ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* General Settings */}
          <div className="glass-card p-6 space-y-6">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2 border-b border-white/[0.06] pb-4">
              <Settings className="w-5 h-5 text-[var(--color-brand-light)]" />
              General Settings
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-2">
                  Agent Name
                </label>
                <input
                  type="text"
                  className="input-field"
                  value={config.name}
                  onChange={(e) => setConfig({ ...config, name: e.target.value })}
                />
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-2 flex justify-between">
                  <span>Welcome Message</span>
                  <span className="text-[10px] text-indigo-400 normal-case font-normal">Supports variables like {'{lead_name}'}</span>
                </label>
                <textarea
                  className="input-field min-h-[80px]"
                  value={config.welcomeMessage}
                  onChange={(e) => setConfig({ ...config, welcomeMessage: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* AI Prompts */}
          <div className="glass-card p-6 space-y-6">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2 border-b border-white/[0.06] pb-4">
              <Bot className="w-5 h-5 text-purple-400" />
              Prompt Engineering
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-2">
                  System Prompt (Behavior & Instructions)
                </label>
                <textarea
                  className="input-field min-h-[300px] font-mono text-xs leading-relaxed"
                  value={config.systemPrompt}
                  onChange={(e) => setConfig({ ...config, systemPrompt: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-2">
                  Data Extraction Schema (JSON)
                </label>
                <textarea
                  className="input-field min-h-[250px] font-mono text-xs text-amber-200/80 bg-black/20"
                  value={config.extractionPrompt}
                  onChange={(e) => setConfig({ ...config, extractionPrompt: e.target.value })}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Integration */}
          <div className="glass-card p-6 space-y-6">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2 border-b border-white/[0.06] pb-4">
              <Link2 className="w-5 h-5 text-emerald-400" />
              Integration
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-2">
                  Bolna Agent ID
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                  <input
                    type="text"
                    className="input-field pl-9 font-mono text-xs text-[var(--text-secondary)] bg-black/20"
                    value={config.id || ""}
                    disabled
                    title="Configured via environment variables"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-2">
                  Webhook URL (For post-call data)
                </label>
                <input
                  type="url"
                  className="input-field text-xs"
                  placeholder="https://your-domain.com/api/webhook/bolna"
                  value={config.webhookUrl}
                  onChange={(e) => setConfig({ ...config, webhookUrl: e.target.value })}
                />
                <p className="text-[10px] text-[var(--text-muted)] mt-1.5 leading-relaxed">
                  Bolna will send a POST request with the call transcript and extracted data to this URL when a call ends.
                </p>
              </div>
            </div>
          </div>

          {/* Voice Model */}
          <div className="glass-card p-6 space-y-6">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2 border-b border-white/[0.06] pb-4">
              <Settings className="w-5 h-5 text-amber-400" />
              Model Configuration
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-2">
                  Language Model
                </label>
                <select 
                  className="input-field"
                  value={config.llmModel}
                  onChange={(e) => setConfig({ ...config, llmModel: e.target.value })}
                >
                  <option value="gpt-4o">GPT-4o (Recommended)</option>
                  <option value="gpt-4-turbo">GPT-4 Turbo</option>
                  <option value="claude-3-opus">Claude 3 Opus</option>
                  <option value="claude-3-sonnet">Claude 3 Sonnet</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-2">
                  Voice Provider
                </label>
                <select 
                  className="input-field"
                  value={config.voiceProvider}
                  onChange={(e) => setConfig({ ...config, voiceProvider: e.target.value })}
                >
                  <option value="elevenlabs">ElevenLabs</option>
                  <option value="playht">Play.ht</option>
                  <option value="openai">OpenAI</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Need to import CheckCircle2 and Settings at the top since we use them
import { CheckCircle2, Settings } from "lucide-react";
