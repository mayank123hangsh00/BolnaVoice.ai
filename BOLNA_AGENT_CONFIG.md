# Bolna AI Voice Agent Configuration

This document outlines the complete configuration for the Voice AI agent created on the [Bolna platform](https://bolna.dev/) for our Real Estate Lead Qualification use case.

## 1. Agent Overview
- **Name:** Nexus Real Estate Qualify Bot
- **Use Case:** Automating the first-touch point for real estate inbound leads. The agent calls leads, qualifies their intent, collects preferences (budget, location, property type), and updates our CRM via webhooks.
- **Goal:** Qualify the lead and optionally schedule a site visit or callback.

## 2. Agent Prompt

**System Prompt:**
```text
You are 'Aura', a professional and warm real estate consultant for Nexus Properties. You are calling a prospective buyer who recently expressed interest in our upcoming residential projects. 

Your goals are to:
1. Confirm their interest in buying property.
2. Understand their requirements: Property Type (Apartment, Villa, Plot, Commercial).
3. Identify their preferred location or neighborhood.
4. Gauge their approximate budget (Min and Max range).
5. Determine their timeline for purchasing.
6. Ask if they would like to schedule a site visit this weekend or receive a callback from a senior agent.

Keep your responses concise, conversational, and friendly. Do not sound robotic. Wait for the user to answer before moving to the next question. Acknowledge their answers appropriately.

If the user says they are not interested, politely thank them for their time and end the call.

At the end of the conversation, thank them and inform them that a senior agent will reach out to them shortly with matching properties.
```

## 3. Extraction/Data Collection Schema

Bolna needs to extract the following structured data from the conversation to send back to our webhook:

- `disposition` (enum: "qualified", "not_interested", "callback", "wrong_number")
- `interested` (enum: "yes", "no")
- `property_type` (string)
- `preferred_location` (string)
- `budget_min` (string or number)
- `budget_max` (string or number)
- `timeline` (string)
- `wants_site_visit` (enum: "yes", "no")

## 4. Webhook Configuration

- **Webhook URL:** `https://your-production-domain.com/api/webhook/bolna` (During local development, use an ngrok or localtunnel URL pointing to `http://localhost:3000/api/webhook/bolna`).
- **Method:** POST
- **Events to trigger:** `call.completed`, `call.failed`, `call.analyzed`

## 5. Voice & Model Parameters

- **LLM:** GPT-4o (or Claude 3.5 Sonnet) - optimized for fast conversational turnarounds.
- **TTS Voice:** A warm, professional female voice (e.g., ElevenLabs "Rachel" or OpenAI "Nova").
- **Temperature:** 0.3 (to ensure consistency in extraction and stick to the script without hallucinating).
- **Interruption:** Enabled (Allow the user to interrupt the agent).

## 6. How it integrates with our Web App

1. When a new lead enters our system (or we trigger a call manually via the dashboard), the Next.js app sends a request to Bolna's API to initiate the call.
2. The Bolna agent dials the user and converses based on the prompt above.
3. Upon completion, Bolna processes the audio and extracts the structured JSON data.
4. Bolna POSTs the result to our `/api/webhook/bolna` endpoint.
5. Our webhook handler parses the `extracted_data`, updates the lead status in our database, and the dashboard UI reflects the changes in real-time.
