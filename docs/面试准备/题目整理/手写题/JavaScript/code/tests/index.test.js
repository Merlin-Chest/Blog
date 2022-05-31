import { trim } from "../src/trim";
import { slice } from "../src/slice";
import { test, expect, describe } from "vitest";
import { stringTemplate } from "../src/stringTemplate";

describe("trim", () => {
  test("trim", () => {
    const str = " sss  ";
    expect(trim.call(str)).toBe(str.trim());
  });
});

describe("slice", () => {
  test("happy path", () => {
    const str = "abcdefg";
    expect(slice.call(str, 1, 3)).toBe(str.slice(1, 3));
  });
});

describe("stringTemplate", () => {
  test("happy path", () => {
    const message = "merlin";
    const rawStr = "hello, ${message}, how are you,${message}?";
    const str = `hello, ${message}, how are you,${message}?`;
    expect(stringTemplate(rawStr, { message })).toBe(str);
  });
});
