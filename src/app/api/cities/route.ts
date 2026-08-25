import { NextRequest, NextResponse } from "next/server";
import { fetchCities } from "@/services/owmServer";
import { badRequest, handleOwmError } from "@/lib/apiHelpers";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q");

  if (!q || q.trim().length < 1 || q.length > 100) {
    return badRequest("Provide a ?q= search term");
  }

  try {
    const cities = await fetchCities(q);
    return NextResponse.json({ list: cities });
  } catch (error) {
    return handleOwmError(error);
  }
}
