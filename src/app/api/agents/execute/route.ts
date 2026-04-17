import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { task, model, agentName, agentRole, context } = await req.json();

  if (!task) {
    return NextResponse.json({ error: "Task is required" }, { status: 400 });
  }

  const systemPrompt = `You are ${agentName || "an AI agent"}, a ${agentRole || "helpful assistant"} working as part of an AI company team.

Your job is to execute tasks autonomously and provide detailed, actionable responses.
Always structure your response with:
1. A brief analysis of the task
2. Step-by-step execution plan
3. The actual work/output
4. A summary of what was done

Be concise but thorough. Format code blocks properly. Think step by step.`;

  const messages = [
    ...(context ? [{ role: "user", content: `Context: ${context}` }, { role: "assistant", content: "Understood. I have the context." }] : []),
    { role: "user", content: task },
  ];

  try {
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
        messages: [{ role: "system", content: systemPrompt }, ...messages],
        stream: false,
        max_tokens: 4096,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      return NextResponse.json({ error }, { status: response.status });
    }

    const data = await response.json();
    const result = data.choices?.[0]?.message?.content ?? "";
    const usage = data.usage ?? {};

    return NextResponse.json({
      result,
      model: data.model,
      usage,
      completedAt: new Date().toISOString(),
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
