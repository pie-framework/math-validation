import { Triage } from "../triage";

export default {
  mode: "literal",
  skip: false,
  tests: [
    {
      opts: {
        literal: { allowTrailingZeros: true}
      },
      target: "1",
      eq: ["1.0", "01"], // 01 is a leading zero, not a trailing zero
      ne: ["1.01"],
      triage: Triage.FLOATING_POINT,
    },
    {
      opts: {
        allowTrailingZeros: false,
      },
      target: "1",
      eq: ["01"],
      ne: ["1.0"],
    },
  ],
};
