import { NextRequest, NextResponse } from "next/server";

const endpoint = "https://models.github.ai/inference";
const model = "gpt-3.5-turbo";

export async function POST(req: NextRequest) {
  const { text } = await req.json();
  const token = process.env.NEXT_PUBLIC_GITHUB_TOKEN || process.env.GITHUB_TOKEN;
  if (!token) {
    return NextResponse.json({ error: "GitHub token missing" }, { status: 500 });
  }

  const body = {
    messages: [
      {
        role: "system",
        content:
          "You are an expert resume writer. Rewrite the user's message for a professional resume. Correct grammar, spelling, and expand short phrases into full sentences. If the input is already good, make it even more polished and formal. Never return the input unchanged."
      },
      { role: "user", content: text }
    ],
    temperature: 0.3,
    top_p: 1.0,
    model
  };

  try {
    const response = await fetch(`${endpoint}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(body)
    });
    const data = await response.json();
    console.log("AI raw response:", data);
    const aiText = data.choices?.[0]?.message?.content?.trim() || text;
    return NextResponse.json({ text: aiText, raw: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Unknown error" }, { status: 500 });
  }
}
