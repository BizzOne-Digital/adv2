import { describe, expect, it } from "vitest";
import { contactSchema } from "@/lib/validation/schemas";

describe("contactSchema", () => {
  it("requires consent", () => {
    const result = contactSchema.safeParse({
      firstName: "A",
      lastName: "B",
      email: "a@example.com",
      topic: "Help",
      message: "Hello there world",
      consent: false,
    });
    expect(result.success).toBe(false);
  });

  it("accepts valid payload", () => {
    const result = contactSchema.safeParse({
      firstName: "A",
      lastName: "B",
      email: "a@example.com",
      topic: "Help",
      message: "Hello there world",
      consent: true,
    });
    expect(result.success).toBe(true);
  });
});
