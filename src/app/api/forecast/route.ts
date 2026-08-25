import { NextRequest, NextResponse } from "next/server";
import { fetchForecastByCity, fetchForecastByCoords } from "@/services/owmServer";
import { badRequest, handleOwmError, toNumber } from "@/lib/apiHelpers";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const city = params.get("city");
  const lat = toNumber(params.get("lat"));
  const lon = toNumber(params.get("lon"));

  try {
    if (city) {
      if (city.trim().length < 1 || city.length > 100) {
        return badRequest("Invalid city name");
      }
      return NextResponse.json(await fetchForecastByCity(city));
    }

    if (
      lat !== null && lon !== null &&
      Math.abs(lat) <= 90 && Math.abs(lon) <= 180
    ) {
      return NextResponse.json(await fetchForecastByCoords(lat, lon));
    }

    return badRequest("Provide either ?city= or ?lat=&lon=");
  } catch (error) {
    return handleOwmError(error);
  }
}
