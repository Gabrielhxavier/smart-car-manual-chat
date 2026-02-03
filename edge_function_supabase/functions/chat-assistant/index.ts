// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import OpenAI from "npm:openai@latest";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // ✅ action via querystring: ?action=start | ?action=status | ?action=sync
    const url = new URL(req.url);
    const action = url.searchParams.get("action") ?? "sync"; // default mantém o comportamento antigo

    const body = await req.json().catch(() => ({}));

    // ✅ aceita threadId ou thread_id (pra evitar undefined)
    const message: string | undefined = body?.message;
    let activeThreadId: string | undefined = body?.threadId ?? body?.thread_id;

    // ✅ runId (para status)
    const runId: string | undefined = body?.runId ?? body?.run_id;

    const apiKey = Deno.env.get("OPENAI_API_KEY");
    const assistantId = Deno.env.get("OPENAI_ASSISTANT_ID");

    if (!apiKey || !assistantId) {
      return json({ error: "Missing environment variables (OPENAI_API_KEY / OPENAI_ASSISTANT_ID)" }, 500);
    }

    const openai = new OpenAI({
      apiKey,
      defaultHeaders: {
        "OpenAI-Beta": "assistants=v2",
      },
    });

    // -------------------------
    // ACTION: STATUS
    // -------------------------
    // Checa um run existente e, se completed, devolve a resposta.
    if (action === "status") {
      if (!activeThreadId || !runId) {
        return json({ error: 'Send { "threadId": "...", "runId": "..." }' }, 400);
      }

      const run = await openai.beta.threads.runs.retrieve(activeThreadId, runId);

      if (run.status !== "completed") {
        return json({
          status: run.status,
          threadId: activeThreadId,
          runId,
        });
      }

      const messages = await openai.beta.threads.messages.list(activeThreadId, { limit: 20 });

      // pega a última mensagem do assistant
      const lastAssistant = messages.data.find((m) => m.role === "assistant");
      const response =
        lastAssistant?.content?.[0]?.type === "text"
          ? lastAssistant.content[0].text.value
          : "";

      return json({
        status: "completed",
        response,
        threadId: activeThreadId,
        runId,
      });
    }

    // Para start/sync precisa de message
    if (!message) {
      return json({ error: "Message is required" }, 400);
    }

    // -------------------------
    // Create or reuse thread
    // -------------------------
    if (!activeThreadId) {
      const thread = await openai.beta.threads.create();
      activeThreadId = thread.id;
      console.log("Thread created:", activeThreadId);
    }

    console.log("Adding message to thread...");
    await openai.beta.threads.messages.create(activeThreadId, {
      role: "user",
      content: message,
    });
    console.log("Message added");

    // -------------------------
    // ACTION: START (rápido, sem poll)
    // -------------------------
    // Cria o run e devolve imediatamente (evita WORKER_LIMIT).
    if (action === "start") {
      console.log("Creating run (no poll)...");
      const run = await openai.beta.threads.runs.create(activeThreadId, {
        assistant_id: assistantId,
      });

      return json({
        status: run.status, // queued/in_progress
        threadId: activeThreadId,
        runId: run.id,
      });
    }

    // -------------------------
    // ACTION: SYNC (comportamento antigo)
    // -------------------------
    // Mantém sua forma antiga, mas pode dar WORKER_LIMIT no Lovable.
    console.log("Creating run (createAndPoll)...");
    const run = await openai.beta.threads.runs.createAndPoll(activeThreadId, {
      assistant_id: assistantId,
    });
    console.log("Run completed:", run.status);

    if (run.status === "completed") {
      const messages = await openai.beta.threads.messages.list(activeThreadId, { limit: 20 });
      const lastAssistant = messages.data.find((m) => m.role === "assistant");

      const response =
        lastAssistant?.content?.[0]?.type === "text"
          ? lastAssistant.content[0].text.value
          : "";

      return json({
        response,
        threadId: activeThreadId,
      });
    }

    return json({ error: `Run failed with status: ${run.status}` }, 500);
  } catch (error) {
    console.error("Error:", error?.message ?? error, error?.stack);
    return json({ error: error?.message || String(error) }, 500);
  }
});


/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/chat-assistant' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
