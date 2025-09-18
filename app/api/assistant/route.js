// app/api/assistant/route.js
export const runtime = 'nodejs';

import OpenAI from "openai";

export async function POST(req) {
  try {
    const { assistantId, message } = await req.json();

    if (!assistantId || !message) {
      return new Response(
        JSON.stringify({ error: "assistantId and message are required" }),
        { status: 400 }
      );
    }

    // IMPORTANT: use the server env var, not anything from the browser
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    // Create a fresh thread
    const thread = await client.beta.threads.create();

    // Add the user's message
    await client.beta.threads.messages.create(thread.id, {
      role: "user",
      content: message,
    });

    // Run the Assistant
    let run = await client.beta.threads.runs.create(thread.id, {
      assistant_id: assistantId,
    });

    // Poll until it finishes
    while (
      ![
        "completed",
        "failed",
        "cancelled",
        "expired",
        "requires_action",
      ].includes(run.status)
    ) {
      await new Promise((r) => setTimeout(r, 1500));
      run = await client.beta.threads.runs.retrieve(thread.id, run.id);
    }

    if (run.status === "completed") {
      return new Response(JSON.stringify({ ok: true, threadId: thread.id }), {
        status: 200,
      });
    }

    return new Response(JSON.stringify({ error: `Run status: ${run.status}` }), {
      status: 500,
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err?.message ?? "Unknown error" }),
      { status: 500 }
    );
  }
}
