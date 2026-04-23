# Slide 1: Title Slide
**Title:** Nexus Voice AI: Automating Real Estate Lead Qualification
**Subtitle:** A Bolna AI Integration by [Your Name]
**Role:** Full Stack Engineer Assignment Submission

---

# Slide 2: The Enterprise Problem
**Title:** The Challenge of Inbound Real Estate Leads
- **Problem:** Real estate agencies receive hundreds of inbound leads daily. Human agents cannot call them all immediately.
- **Impact:** Leads go cold within minutes. A 5-minute delay in response results in a massive drop in conversion rates.
- **Workflow Bottleneck:** Agents spend hours dialing unverified numbers and unqualified buyers instead of closing deals.

---

# Slide 3: The AI Solution
**Title:** Immediate Voice AI Qualification
- **Solution:** A Bolna Voice AI agent that immediately calls every new lead within seconds of them submitting an inquiry.
- **The Agent (Aura):** Acts as a professional real estate consultant to confirm interest and gather key requirements.
- **Extraction:** Automatically extracts *Budget*, *Preferred Location*, *Property Type*, and *Intent*.

---

# Slide 4: Outcome Metrics
**Title:** Measuring Success
- **Metric 1:** Lead Contact Rate (Target: 100% of leads contacted within 1 minute).
- **Metric 2:** Agent Time Saved (Eliminates time spent on "Not Interested" or "Wrong Number" calls).
- **Metric 3:** Conversion Rate (Increases due to immediate engagement and accurate CRM data routing).

---

# Slide 5: System Architecture & Workflow
**Title:** How It Works (End-to-End)
1. **User Action:** A lead submits their contact info via a web form.
2. **Web App:** Triggers the Bolna API to initiate a call.
3. **Bolna Agent:** "Aura" conducts the conversational qualification.
4. **Backend Logic:** Bolna processes the audio, extracts JSON data, and sends a POST request to our Webhook (`/api/webhook/bolna`).
5. **Output:** The Next.js dashboard updates in real-time, categorizing the lead as "Qualified" or "Not Interested" and populating their preferences.

---

# Slide 6: The Tech Stack
**Title:** Built For Speed & Scale
- **Frontend:** Next.js 14, Tailwind CSS, Framer Motion, Recharts.
- **Backend:** Next.js API Routes (Serverless Webhooks).
- **AI Voice Engine:** Bolna (using GPT-4o for fast reasoning and structured extraction).

---

# Slide 7: Demonstration
**Title:** Live Demo / Call Recording
*(Embed or link your screen recording here showing the web app, the live call occurring, and the dashboard updating)*

---

# Slide 8: Future Roadmap
**Title:** Next Steps & Scaling
- Integrating direct calendar booking for site visits.
- Multi-lingual support for regional real estate markets.
- Twilio integration for automated SMS follow-ups post-call.
