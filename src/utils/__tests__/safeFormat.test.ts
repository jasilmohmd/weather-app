import { describe, expect, it } from "vitest";
import { safeFormat, safeFormatUnix } from "@/utils/safeFormat";

describe("safeFormat", () => {
  it("formats a valid ISO date string", () => {
    expect(safeFormat("2026-01-05T06:00:00", "dd MMM")).toBe("05 Jan");
  });

  it("returns N/A for undefined input", () => {
    expect(safeFormat(undefined, "dd MMM")).toBe("N/A");
  });

  it("returns Invalid date for unparseable input", () => {
    expect(safeFormat("not-a-date", "dd MMM")).toBe("Invalid date");
  });
});

describe("safeFormatUnix", () => {
  it("returns N/A for undefined input", () => {
    expect(safeFormatUnix(undefined, "yyyy")).toBe("N/A");
  });

  it("returns N/A for NaN input", () => {
    expect(safeFormatUnix(NaN, "yyyy")).toBe("N/A");
  });

  it("formats a unix timestamp in local time", () => {
    const unix = Date.UTC(2026, 5, 15, 12, 0, 0) / 1000;
    const expected = String(new Date(unix * 1000).getFullYear());
    expect(safeFormatUnix(unix, "yyyy")).toBe(expected);
  });
});
