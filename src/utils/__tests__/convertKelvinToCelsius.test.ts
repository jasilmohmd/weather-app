import { describe, expect, it } from "vitest";
import { convertKtoC, convertKtoF } from "@/utils/convertKelvinToCelsius";

describe("convertKtoC", () => {
  it("freezing point", () => {
    expect(convertKtoC(273.15)).toBe(0);
  });

  it("boiling point", () => {
    expect(convertKtoC(373.15)).toBe(100);
  });

  it("rounds half up (consistent with Fahrenheit)", () => {
    expect(convertKtoC(273.65)).toBe(1);
  });

  it("handles negatives", () => {
    expect(convertKtoC(263.15)).toBe(-10);
  });
});

describe("convertKtoF", () => {
  it("freezing point", () => {
    expect(convertKtoF(273.15)).toBe(32);
  });

  it("rounds to nearest integer", () => {
    expect(convertKtoF(300)).toBe(80);
  });

  it("handles negatives", () => {
    expect(convertKtoF(250.15)).toBe(-9);
  });
});
