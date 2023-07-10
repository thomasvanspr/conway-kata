import { describe, expect, test } from "@jest/globals";
import { main } from "../conway";

describe("conway", () => {
  test("main is a function", () => {
    expect(typeof main).toBe("function");
  });
});
