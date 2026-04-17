import { NextRequest } from "next/server";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  const { messages, model, systemPrompt } = await req.json();

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer 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`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://myaicompany.io",
      "X-Title": "MyaiCompany",
    },
    body: JSON.stringify({
      model: model || "google/gemma-4-26b-a4b-it:free",
      messages: [
        ...(systemPrompt ? [{ role: "system", content: systemPrompt }] : []),
        ...messages,
      ],
      stream: true,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    return new Response(JSON.stringify({ error }), { status: response.status });
  }

  // Stream the response directly
  return new Response(response.body, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    },
  });
}
