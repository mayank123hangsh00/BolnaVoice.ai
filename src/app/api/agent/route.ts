import { NextResponse } from "next/server";
import { defaultAgentConfig } from "@/lib/data";

export async function GET() {
  return NextResponse.json({ success: true, data: defaultAgentConfig });
}

export async function PUT(request: Request) {
  const body = await request.json();

  // Update config
  Object.assign(defaultAgentConfig, body);

  // If Bolna API key is available, sync with Bolna
  const bolnaApiKey = process.env.BOLNA_API_KEY;
  if (bolnaApiKey && defaultAgentConfig.id) {
    try {
      await fetch(`https://api.bolna.ai/v2/agent/${defaultAgentConfig.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${bolnaApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          agent_config: {
            agent_name: defaultAgentConfig.name,
            agent_welcome_message: defaultAgentConfig.welcomeMessage,
            webhook_url: defaultAgentConfig.webhookUrl,
          },
          agent_prompts: {
            task_1: {
              system_prompt: defaultAgentConfig.systemPrompt,
            },
          },
        }),
      });
    } catch {
      // Silently fail — dashboard still saves locally
    }
  }

  return NextResponse.json({ success: true, data: defaultAgentConfig });
}
