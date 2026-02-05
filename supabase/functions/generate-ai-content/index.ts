import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { wins, type } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    if (!wins || !Array.isArray(wins) || wins.length === 0) {
      return new Response(
        JSON.stringify({ error: "No wins provided" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const winsText = wins.map((win: { content: string; createdAt: string; tags?: string[] }, i: number) => {
      const date = new Date(win.createdAt).toLocaleDateString();
      const tags = win.tags?.length ? ` [Tags: ${win.tags.join(", ")}]` : "";
      return `${i + 1}. ${win.content}${tags} (${date})`;
    }).join("\n");

    let systemPrompt = "";
    if (type === "summary") {
      systemPrompt = `You are an encouraging career coach. Analyze the following list of professional wins and accomplishments, then provide:
1. A brief overall summary (2-3 sentences) highlighting key themes and strengths
2. 3-5 key patterns or skills demonstrated
3. An encouraging message about their progress

Keep your response warm, professional, and motivating. Format with clear sections.`;
    } else if (type === "resume") {
      systemPrompt = `You are an expert resume writer. Convert the following professional wins into powerful resume bullet points. 
Rules:
- Start each bullet with a strong action verb
- Include quantifiable results when possible (estimate if needed)
- Use the XYZ formula: Accomplished [X] as measured by [Y], by doing [Z]
- Keep each bullet to 1-2 lines
- Group similar accomplishments if appropriate

Format as a clean bulleted list ready to copy into a resume.`;
    } else {
      return new Response(
        JSON.stringify({ error: "Invalid type. Use 'summary' or 'resume'" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Here are my professional wins:\n\n${winsText}` },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Usage limit reached. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "Failed to generate content" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "Unable to generate content";

    return new Response(
      JSON.stringify({ content }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("Error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
