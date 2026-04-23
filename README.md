# Bolna AI - Real Estate Voice Agent & Dashboard

**🌐 Live Demo:** [https://bolna-voice-ai-ysxd.vercel.app/](https://bolna-voice-ai-ysxd.vercel.app/)

This project is a full-stack Next.js web application built to interface with a Voice AI agent powered by [Bolna](https://bolna.dev/). It is designed for a **Real Estate Enterprise Use Case**: automating the initial contact, qualification, and data extraction for inbound property leads.

## 🚀 Enterprise Use Case: Real Estate Lead Qualification

Real estate agencies often receive hundreds of leads daily, making it impossible for human agents to call everyone immediately. This delay leads to a drop in conversion rates.

**The Solution:**
A Bolna AI Voice Agent automatically calls new leads within seconds. The agent acts as a professional real estate consultant, qualifying the lead by identifying their intent, preferred location, budget, and property type. The extracted data is then sent via webhook to this Next.js application, which updates a beautiful, real-time analytics dashboard and CRM.

**Outcome Metrics:**
- Increased lead contact rate (100% of leads contacted within 5 minutes).
- Reduced human agent time spent on unqualified leads.
- Higher conversion rate due to immediate follow-up.

## ✨ Features

- **Real-Time Dashboard:** A stunning, dark-mode dashboard built with modern UI principles (glassmorphism, subtle animations) to view live metrics.
- **Persistent Database:** Integrates seamlessly with Supabase (PostgreSQL) to store all webhook payloads, call transcripts, and extracted lead data permanently.
- **Lead CRM:** View and manage leads, their status, and extracted preferences (budget, location, timeline, etc.).
- **Live Call Logs:** Monitor ongoing and completed AI calls with full conversation transcripts mapped natively to the UI.
- **Bolna Webhook Integration:** A robust Next.js API route (`/api/webhook/bolna`) that ingests structured JSON from Bolna and instantly persists it to PostgreSQL.

## 🛠️ Technology Stack

- **Framework:** Next.js 14+ (App Router)
- **Database:** Supabase (PostgreSQL)
- **Styling:** Tailwind CSS (v4) with Custom CSS variables for a dynamic design system.
- **Icons & Animations:** Lucide React, Framer Motion.
- **Voice Agent:** Bolna AI Platform.

## 📄 Agent Configuration

For details on the Voice AI agent's prompt, data extraction schema, and webhook setup, please refer to the [BOLNA_AGENT_CONFIG.md](./BOLNA_AGENT_CONFIG.md) file.

## ⚙️ Getting Started

### Prerequisites

- Node.js (v18 or newer)
- npm or pnpm
- A Bolna account (to configure the voice agent)
- A Supabase account (for the database)

### Installation & Local Setup

1. Clone the repository and install dependencies:
   ```bash
   npm install
   ```

2. Set up Environment Variables:
   Create a `.env.local` file in the root of the project and add your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

3. Database Setup:
   In your Supabase SQL Editor, run the following command to create the webhook table and disable Row Level Security (RLS) to allow external inserts:
   ```sql
   CREATE TABLE bolna_webhooks (
     id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
     phone text NOT NULL,
     status text NOT NULL,
     duration integer,
     extracted_data jsonb,
     transcript text,
     created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
   );
   
   ALTER TABLE bolna_webhooks DISABLE ROW LEVEL SECURITY;
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

### Connecting Bolna (Webhook)

In your Bolna Dashboard, point the agent's webhook destination to your live Vercel URL (or use Ngrok for local testing):
`https://your-app-domain.vercel.app/api/webhook/bolna`

## 🎥 Demonstration Video

*(Please provide a link to the end-to-end demonstration video here. The video should show the user expressing interest on a simulated landing page, receiving a call from the Bolna AI agent, and the web app dashboard updating in real-time based on the conversation's extracted data.)*

## 📝 License

This project is open-source and available under the MIT License.
