import { isValidShareURLTemplate, isValidCharacter } from "./validation";

describe("isValidShareURLTemplate", () => {
  test("should return true for valid template with $TL-TEXT$ and $TL-URL$", () => {
    const template =
      "https://www.example.com/share?text=$TL-TEXT$&url=$TL-URL$";
    expect(isValidShareURLTemplate(template)).toBe(true);
  });

  test("should return false if $TL-TEXT$ is missing", () => {
    const template =
      "https://www.example.com/share?text=MISSING_TEXT&url=$TL-URL$";
    expect(isValidShareURLTemplate(template)).toBe(false);
  });

  test("should return false if $TL-URL$ is missing", () => {
    const template =
      "https://www.example.com/share?text=$TL-TEXT$&url=MISSING_URL";
    expect(isValidShareURLTemplate(template)).toBe(false);
  });

  test("should return false for invalid URL format", () => {
    const template = "invalid-url-format$TL-TEXT$and$TL-URL$";
    expect(isValidShareURLTemplate(template)).toBe(false);
  });

  test("should return false if $TL-TEXT$ appears more than once", () => {
    const template =
      "https://www.example.com/share?text=$TL-TEXT$&extra=$TL-TEXT$&url=$TL-URL$";
    expect(isValidShareURLTemplate(template)).toBe(false);
  });

  test("should return false if $TL-URL$ appears more than once", () => {
    const template =
      "https://www.example.com/share?text=$TL-TEXT$&url=$TL-URL$&extra=$TL-URL$";
    expect(isValidShareURLTemplate(template)).toBe(false);
  });

  test("should return false if both $TL-TEXT$ and $TL-URL$ appear more than once", () => {
    const template =
      "https://www.example.com/share?text=$TL-TEXT$&extra=$TL-TEXT$&url=$TL-URL$&extraurl=$TL-URL$";
    expect(isValidShareURLTemplate(template)).toBe(false);
  });

  test("should return true for valid template with $TL-TEXT$ and $TL-URL$ in different order", () => {
    const template =
      "https://www.example.com/share?url=$TL-URL$&text=$TL-TEXT$";
    expect(isValidShareURLTemplate(template)).toBe(true);
  });
});

describe("isValidCharacter", () => {
  it("should return true for an empty string", () => {
    expect(isValidCharacter("")).toBe(true);
  });

  it("should return true for a single character string", () => {
    expect(isValidCharacter("a")).toBe(true);
    expect(isValidCharacter("Z")).toBe(true);
    expect(isValidCharacter("1")).toBe(true);
    expect(isValidCharacter(" ")).toBe(false);
  });

  it("should return false for a string with more than one character", () => {
    expect(isValidCharacter("ab")).toBe(false);
    expect(isValidCharacter("hello")).toBe(false);
    expect(isValidCharacter("  ")).toBe(false);
    expect(isValidCharacter("123")).toBe(false);
  });

  it("should handle edge cases correctly", () => {
    expect(isValidCharacter("\n")).toBe(false);
    expect(isValidCharacter("\t")).toBe(false);
  });

  it("should return true for a single surrogate pair character", () => {
    expect(isValidCharacter("𝕏")).toBe(true);
    expect(isValidCharacter("😀")).toBe(true);
  });

  it("should return false for multiple surrogate pair characters", () => {
    expect(isValidCharacter("𝕏𝕐")).toBe(false);
    expect(isValidCharacter("😀😃")).toBe(false);
  });
});
