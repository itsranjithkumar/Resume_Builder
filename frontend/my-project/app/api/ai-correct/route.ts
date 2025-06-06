import { NextRequest, NextResponse } from "next/server";

const endpoint = "https://models.github.ai/inference";
const model = "deepseek/DeepSeek-V3-0324";

// Helper to check if input is a valid email
function isEmail(input: string) {
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(input.trim());
}

// Helper to check if input is a simple name (e.g., two words, letters only)
function isSimpleName(input: string) {
  return /^[A-Za-z]+\s+[A-Za-z]+$/.test(input.trim());
}

export async function POST(req: NextRequest) {
  const { text, field } = await req.json();
  const token = process.env.NEXT_PUBLIC_GITHUB_TOKEN ?? process.env.GITHUB_TOKEN;
  if (!token) {
    return NextResponse.json({ error: "GitHub token missing" }, { status: 500 });
  }

  // Helper: Check if input is truly instructions or empty
  function looksLikeInstructions(input: string) {
    const lower = input.trim().toLowerCase();
    return (
      !lower ||
      lower.includes('system instructions') ||
      lower.startsWith('[no text') ||
      lower.startsWith('please enter') ||
      lower.startsWith('type your')
    );
  }

  if (looksLikeInstructions(text)) {
    return NextResponse.json({ error: "Please enter your real resume content for optimization." }, { status: 400 });
  }

  // Skip AI improvement for email or simple name
  if (isEmail(text) || isSimpleName(text)) {
    return NextResponse.json({ text: text.trim(), raw: null });
  }

  try {
    const body = {
      messages: [
        {
          role: "system",
          content:
            field === 'organization'
              ? "You are an expert in professional resumes. The user will provide the name of a company, organization, or certification issuer. Correct the spelling and capitalize it as the official name would appear on a resume. Only return the corrected organization name, with no extra text, instructions, or formatting."
              : "You are an elite professional resume writer. Rewrite the user's text to be polished, concise, and highly professional. Do NOT add instructions, placeholders, suggestions, or extra commentary. Only return the improved version of the user's input, ready to be used directly in a resume. Never return the input unchanged."
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
      if (res.status === 429) {
        return NextResponse.json({ error: "Rate limit exceeded. Please try again later.", detail: errorText }, { status: 429 });
      }
      return NextResponse.json({ error: `API error ${res.status}`, detail: errorText }, { status: 500 });
    }

    const data = await res.json();
    if (!data.choices?.[0]?.message?.content) {
      return NextResponse.json({ error: "Unexpected API response", raw: data }, { status: 500 });
    }

    // Post-process: Remove lines with suggestions, placeholders, or meta-comments
    let improved = data.choices[0].message.content
      .split('\n')
      .filter((line: string) => !/\b(placeholder|replace|let me know|would you like|optional:|note:|\[|\]|\*|suggestion|further refinement|additionally|alternatively)\b/i.test(line))
      .join('\n')
      .trim();

    // If output is empty after filtering, fall back to raw AI output
    if (!improved) improved = data.choices[0].message.content.trim();

    // Remove Markdown bold (**text**) and italic (*text*) formatting
    improved = improved.replace(/\*\*(.*?)\*\*/g, '$1').replace(/\*(.*?)\*/g, '$1');

    // If improved is empty or unchanged from input, return the input (unless input is blank/instructions)
    if (!improved || improved === text.trim()) {
      if (looksLikeInstructions(text)) {
        return NextResponse.json({ error: "Please enter your real resume content for optimization." }, { status: 400 });
      }
      // Accept and return the original text if it's real resume content
      return NextResponse.json({ text: text.trim(), raw: data });
    }

    return NextResponse.json({ text: improved, raw: data });
  } catch (error: unknown) {
    // If the error has a status of 429, return a 429 response
    if (
      typeof error === "object" &&
      error !== null &&
      'response' in error &&
      typeof (error as { response?: { status?: number } }).response === 'object' &&
      (error as { response?: { status?: number } }).response !== null
    ) {
      const response = (error as { response?: { status?: number } }).response;
      if (
        response &&
        'status' in response &&
        (response as { status?: number }).status === 429
      ) {
        return NextResponse.json({ error: "Rate limit exceeded. Please try again later." }, { status: 429 });
      }
    }
    const message =
      typeof error === 'object' && error !== null && 'message' in error && typeof (error as { message?: string }).message === 'string'
        ? (error as { message?: string }).message
        : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
