import { describe, expect, it } from "vitest";
import { getDayOrNightIcon } from "@/utils/getDayOrNightIcon";

describe("getDayOrNightIcon", () => {
  it("keeps d suffix during daytime", () => {
    expect(getDayOrNightIcon("01d", "2026-01-05T12:00:00")).toBe("01d");
  });

  it("swaps n to d after 6am", () => {
    expect(getDayOrNightIcon("01n", "2026-01-05T06:00:00")).toBe("01d");
  });

  it("keeps n at 5:59am", () => {
    expect(getDayOrNightIcon("01n", "2026-01-05T05:59:00")).toBe("01n");
  });

  it("swaps d to n at 6pm", () => {
    expect(getDayOrNightIcon("01d", "2026-01-05T18:00:00")).toBe("01n");
  });

  it("keeps d at 5:59pm", () => {
    expect(getDayOrNightIcon("01d", "2026-01-05T17:59:00")).toBe("01d");
  });
});
