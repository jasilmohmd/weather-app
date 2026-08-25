import { describe, expect, it } from "vitest";
import { convertSpeed } from "@/utils/convertSpeed";
import { metersToKilometers } from "@/utils/metersToKilometers";

describe("convertSpeed", () => {
  it("zero stays zero", () => {
    expect(convertSpeed(0)).toBe("0");
  });

  it("converts m/s to km/h", () => {
    expect(convertSpeed(10)).toBe("36");
  });

  it("rounds to integer string", () => {
    expect(convertSpeed(2.75)).toBe("10");
  });
});

describe("metersToKilometers", () => {
  it("exact kilometers", () => {
    expect(metersToKilometers(1000)).toBe("1");
  });

  it("rounds down below half", () => {
    expect(metersToKilometers(1400)).toBe("1");
  });

  it("rounds up at half and above", () => {
    expect(metersToKilometers(1600)).toBe("2");
  });

  it("sub-500m rounds to zero", () => {
    expect(metersToKilometers(400)).toBe("0");
  });
});
