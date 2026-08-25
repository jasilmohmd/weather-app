import { NextRequest, NextResponse } from 'next/server';
import { fetchAirPollution } from '@/services/owmServer';
import { badRequest, handleOwmError, toNumber } from '@/lib/apiHelpers';

export async function GET(request: NextRequest) {
  const lat = toNumber(request.nextUrl.searchParams.get('lat'));
  const lon = toNumber(request.nextUrl.searchParams.get('lon'));

  if (lat === null || lon === null || Math.abs(lat) > 90 || Math.abs(lon) > 180) {
    return badRequest('Provide valid ?lat=&lon= coordinates');
  }

  try {
    return NextResponse.json(await fetchAirPollution(lat, lon));
  } catch (error) {
    return handleOwmError(error);
  }
}
