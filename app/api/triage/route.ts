import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import type { TriageRequest, TriageResponse, TriageResult } from "@/types";

const SYSTEM_PROMPT = `You are a friendly, calm urgent-care triage assistant for CareLocate. Your job is to understand the user's medical situation so we can match them with the right clinic.

RULES:
- Ask 2-3 short follow-up questions, ONE at a time, to understand their situation.
- Keep responses brief (1-2 sentences max).
- Be empathetic but efficient — the user may be in pain or stressed.
- Never give medical advice or diagnoses. You are only gathering information.
- After you have enough information (usually 2-3 exchanges), output your final triage.

QUESTIONS TO CLARIFY (pick what's relevant):
- What symptoms or injury they have
- How urgent it is (happening now vs. can wait a few hours)
- Any mobility or accessibility needs

WHEN READY TO TRIAGE, respond with ONLY a JSON block in this exact format (no other text):
\`\`\`json
{
  "reason": "<one of: fever, infection, xray, breathing, minor, general>",
  "timing": "<one of: now, few_hours, later_today>",
  "travelMethod": "driving",
  "accessibility": [],
  "summary": "<one-sentence summary of their situation>"
}
\`\`\`

REASON MAPPING:
- "fever" = child fever, high temperature, chills
- "infection" = swelling, redness, signs of infection
- "xray" = possible fracture, sprain, impact injury needing imaging
- "breathing" = cough, congestion, shortness of breath, flu
- "minor" = cuts, scrapes, minor burns, bruises
- "general" = anything else or unclear

ACCESSIBILITY OPTIONS (include any that apply):
- "wheelchair", "elevator", "minimal_walking", "parking", "child_friendly", "mobility_accessible"`;

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "GEMINI_API_KEY not configured." },
      { status: 500 }
    );
  }

  const genAI = new GoogleGenerativeAI(apiKey);

  let body: TriageRequest;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body." },
      { status: 400 }
    );
  }

  const { messages } = body;
  if (!Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json(
      { error: "messages array is required." },
      { status: 400 }
    );
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: "System instructions: " + SYSTEM_PROMPT }],
        },
        {
          role: "model",
          parts: [{ text: "Understood. I'll act as the CareLocate triage assistant following those rules." }],
        },
        ...messages.slice(0, -1).map((m) => ({
          role: m.role === "assistant" ? "model" as const : "user" as const,
          parts: [{ text: m.content }],
        })),
      ],
    });

    const lastMessage = messages[messages.length - 1];
    console.log("Triage request:", JSON.stringify(messages));
    const result = await chat.sendMessage(lastMessage.content);
    const text = result.response.text();
    console.log("Gemini raw response:", text);

    const jsonMatch = text.match(/```json\s*([\s\S]*?)```/);
    if (jsonMatch) {
      try {
        const triage: TriageResult = JSON.parse(jsonMatch[1].trim());
        const response: TriageResponse = {
          reply: triage.summary,
          done: true,
          triage,
        };
        return NextResponse.json(response);
      } catch {
        // JSON parse failed — treat as regular reply
      }
    }

    const response: TriageResponse = {
      reply: text,
      done: false,
    };
    return NextResponse.json(response);
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error("Gemini API error:", errorMsg);
    return NextResponse.json(
      { error: `AI error: ${errorMsg}` },
      { status: 500 }
    );
  }
}
