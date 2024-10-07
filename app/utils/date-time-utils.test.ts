import { getMillisecondsAfter1337 } from "./date-time-utils";

describe("getMillisecondsAfter1337", () => {
  const testCases = [
    {
      actual: "2022-01-01 13:37:12.345-07",
      expected: 12345,
    },
    {
      actual: "2022-01-01 13:37:12.345+00",
      expected: 12345,
    },
    {
      actual: "2022-01-01 13:37:12.345+05",
      expected: 12345,
    }
  ];

  testCases.forEach((testCase) => {
    it(`should return 0 for ${testCase.actual}`, () => {
      const actual = getMillisecondsAfter1337(testCase.actual);

      expect(actual).toEqual(testCase.expected);
    });
  });
});
