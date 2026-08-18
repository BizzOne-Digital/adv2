import { describe, expect, it } from "vitest";
import { slugify, readingTime } from "@/lib/utils";

describe("slugify", () => {
  it("normalizes text to slugs", () => {
    expect(slugify("Hello World!")).toBe("hello-world");
    expect(slugify("  Employment & Career  ")).toBe("employment-career");
  });
});

describe("readingTime", () => {
  it("returns at least 1 minute", () => {
    expect(readingTime("<p>short</p>")).toBe(1);
    expect(readingTime(`<p>${"word ".repeat(400)}</p>`)).toBeGreaterThan(1);
  });
});
