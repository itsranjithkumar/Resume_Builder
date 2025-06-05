import { useState } from "react";

interface AIFeedback {
  missing: string[];
  improve: string[];
  suggested?: string;
}

export function useAIFieldImprover() {
  const [aiLoading, setAiLoading] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<AIFeedback | null>(null);

  const improveFieldWithAI = async (value: string, field: string, extra?: Record<string, any>) => {
    setAiLoading(true);
    setAiFeedback(null);
    try {
      const res = await fetch("/api/ai-correct", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: value, field, ...extra })
      });
      const result = await res.json();
      if (res.ok && result.text) {
        if (result.feedback) {
          setAiFeedback({
            missing: result.feedback.missing || [],
            improve: result.feedback.improve || [],
            suggested: result.feedback.suggested || undefined,
          });
        }
        return result.text;
      } else {
        window.alert(result.error || "AI improvement failed.");
      }
    } catch (e: any) {
      window.alert("AI improvement failed: " + (e?.message ?? String(e)));
    } finally {
      setAiLoading(false);
    }
    return null;
  };

  return { aiLoading, aiFeedback, improveFieldWithAI, setAiFeedback };
}
