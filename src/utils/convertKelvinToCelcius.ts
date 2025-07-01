export function convertKtoC( tempInK: number ): number {
  const tempInC = tempInK - 273.15;
  return Math.floor(tempInC);
}

export function convertKtoF(kelvin: number): number {
  return Math.round(((kelvin - 273.15) * 9 / 5) + 32);
}