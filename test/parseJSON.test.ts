import { parseJSON } from "../src";
import { describe, expect, it } from "vitest";

describe("parseJSON", () => {
  it("should parse JSON", () => {
    expect(parseJSON("1")).toEqual(1);
    expect(parseJSON("true")).toEqual(true);
    expect(parseJSON("null")).toEqual(null);
    expect(parseJSON('"hello"')).toEqual("hello");
    expect(parseJSON("[1,2,3]")).toEqual([1, 2, 3]);
    expect(parseJSON('{"a":1}')).toEqual({ a: 1 });
  });
});
