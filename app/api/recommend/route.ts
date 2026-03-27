import { NextResponse } from "next/server";
import { clinics, randomizeWaitTime } from "@/data/clinics";
import { scoreClinic } from "@/lib/scoring";
import type { RecommendRequest, RecommendResponse, RankedClinic } from "@/types";

const TOP_N = 4;

export async function POST(request: Request) {
  let body: RecommendRequest;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body." },
      { status: 400 }
    );
  }

  const { lat, lng, issue, travelMethod = "driving" } = body;

  if (typeof lat !== "number" || typeof lng !== "number") {
    return NextResponse.json(
      { error: "lat and lng must be numbers." },
      { status: 400 }
    );
  }

  if (typeof issue !== "string" || issue.trim().length === 0) {
    return NextResponse.json(
      { error: "issue is required and must be a non-empty string." },
      { status: 400 }
    );
  }

  const scored: { clinic: RankedClinic; score: number; specialtyMatch: boolean }[] = [];

  for (const clinic of clinics) {
    const waitTime = randomizeWaitTime();
    const result = scoreClinic(clinic, lat, lng, issue, waitTime);

    scored.push({
      clinic: {
        ...clinic,
        waitTimeMinutes: waitTime,
        distanceMiles: result.distanceMiles,
        rank: 0,
        reasoning: "",
      },
      score: result.score,
      specialtyMatch: result.specialtyMatch,
    });
  }

  scored.sort((a, b) => b.score - a.score);

  const topClinics: RankedClinic[] = scored.slice(0, TOP_N).map((s, i) => ({
    ...s.clinic,
    rank: i + 1,
    reasoning: buildReasoning(s.clinic, s.specialtyMatch, travelMethod, i === 0),
  }));

  const response: RecommendResponse = { clinics: topClinics };
  return NextResponse.json(response);
}

function buildReasoning(
  clinic: RankedClinic,
  specialtyMatch: boolean,
  travelMethod: string,
  isBest: boolean
): string {
  if (isBest) {
    const parts = [
      "Recommended because it can fully treat this condition today and avoids a second trip.",
      `It has the shortest combined travel and wait time`,
      specialtyMatch
        ? `with specialist care in ${clinic.specialties.slice(0, 2).join(", ")}.`
        : "for general urgent care.",
    ];
    return parts.join(" ");
  }

  const parts: string[] = [];
  if (specialtyMatch) {
    parts.push(`Offers relevant care (${clinic.specialties.slice(0, 2).join(", ")})`);
  } else {
    parts.push("General urgent care option");
  }
  parts.push(`${clinic.distanceMiles} mi by ${travelMethod}`);
  parts.push(`~${clinic.waitTimeMinutes} min wait`);
  return parts.join(". ") + ".";
}
