import getErrorMessage from "@/utils/getErrorMessage";

test("getErrorMessage will return string", () => {
  expect(typeof getErrorMessage({})).toBe("string");
});
