import axios from 'axios';
import { NextResponse } from 'next/server';

export function badRequest(message: string) {
  return NextResponse.json({ message }, { status: 400 });
}

export function toNumber(value: string | null): number | null {
  if (value === null) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

/** Maps upstream OWM / unexpected errors onto JSON responses the client service layer understands. */
export async function handleOwmError(error: unknown) {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status ?? 502;
    const data = error.response?.data as { message?: string } | undefined;
    return NextResponse.json(
      { message: data?.message || 'Upstream weather service error' },
      { status }
    );
  }
  console.error('[api] unexpected error:', error);
  return NextResponse.json({ message: 'Unexpected server error' }, { status: 500 });
}
