import { describe, expect, it } from "vitest";
import { getWeatherGradient } from "@/utils/getWeatherGradient";

describe("getWeatherGradient", () => {
  it("returns literal light and dark classes for known conditions", () => {
    const result = getWeatherGradient("Clear");
    expect(result).toContain("from-amber-300");
    expect(result).toContain("dark:from-blue-950");
  });

  it("maps atmosphere-family conditions to the Atmosphere pair", () => {
    const haze = getWeatherGradient("Haze");
    expect(haze).toContain("dark:from-zinc-700");
    expect(haze).toBe(getWeatherGradient("Fog"));
  });

  it("falls back to Clear for unknown or missing conditions", () => {
    expect(getWeatherGradient("Aurora")).toBe(getWeatherGradient("Clear"));
    expect(getWeatherGradient(undefined)).toBe(getWeatherGradient("Clear"));
  });

  it("includes three dark variant stops for every condition", () => {
    for (const main of ["Clear", "Clouds", "Rain", "Drizzle", "Thunderstorm", "Snow", "Atmosphere"]) {
      const darkStops = getWeatherGradient(main)
        .split(" ")
        .filter((c) => c.startsWith("dark:"));
      expect(darkStops).toHaveLength(3);
    }
  });
});
