export function convertSpeed ( speedInMps: number ): string {
  const speedInKmph = speedInMps * 3.6;
  return `${speedInKmph.toFixed(0)}`
}