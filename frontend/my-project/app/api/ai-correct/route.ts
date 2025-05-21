import { NextRequest, NextResponse } from "next/server";

const endpoint = "https://models.github.ai/inference";
const model = "deepseek/DeepSeek-V3-0324";

export async function POST(req: NextRequest) {
  const token = process.env.NEXT_PUBLIC_GITHUB_TOKEN ?? process.env.GITHUB_TOKEN;
  if (!token) {
    return NextResponse.json({ error: "GitHub token missing" }, { status: 500 });
  }

  try {
    const { text } = await req.json();
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

    const res = await fetch(`${endpoint}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(body)
    });

    if (!res.ok) {
      const errorText = await res.text();
      return NextResponse.json({ error: `API error ${res.status}`, detail: errorText }, { status: 500 });
    }

    const data = await res.json();
    if (!data.choices?.[0]?.message?.content) {
      return NextResponse.json({ error: "Unexpected API response", raw: data }, { status: 500 });
    }

    return NextResponse.json({ text: data.choices[0].message.content.trim(), raw: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Unknown error" }, { status: 500 });
  }
}
