# Bolna AI - Real Estate Voice Agent & Dashboard

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
- **Lead CRM:** View and manage leads, their status, and extracted preferences (budget, location, etc.).
- **Live Call Logs:** Monitor ongoing and completed AI calls.
- **Bolna Webhook Integration:** An API endpoint (`/api/webhook/bolna`) that receives structured data from the Bolna agent and updates the database in real-time.
- **Data Visualization:** Built with Recharts for visualizing agent performance and conversion rates.

## 🛠️ Technology Stack

- **Framework:** Next.js 14+ (App Router)
- **Styling:** Tailwind CSS (v4) with Custom CSS variables for a dynamic design system.
- **Icons & Animations:** Lucide React, Framer Motion.
- **Voice Agent:** Bolna API.

## 📄 Agent Configuration

For details on the Voice AI agent's prompt, data extraction schema, and webhook setup, please refer to the [BOLNA_AGENT_CONFIG.md](./BOLNA_AGENT_CONFIG.md) file.

## ⚙️ Getting Started

### Prerequisites

- Node.js (v18 or newer)
- npm or pnpm
- A Bolna account (to configure the voice agent)

### Installation

1. Clone the repository and install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Setting up the Webhook (Local Development)

To test the Bolna integration locally, you need to expose your local server to the internet using a tool like `ngrok`:

```bash
ngrok http 3000
```

Use the generated ngrok URL (e.g., `https://your-ngrok-url.ngrok-free.app/api/webhook/bolna`) as the webhook destination in your Bolna agent configuration.

## 🎥 Demonstration Video

*(Please provide a link to the end-to-end demonstration video here. The video should show the user expressing interest on a simulated landing page, receiving a call from the Bolna AI agent, and the web app dashboard updating in real-time based on the conversation's extracted data.)*

## 📝 License

This project is open-source and available under the MIT License.
