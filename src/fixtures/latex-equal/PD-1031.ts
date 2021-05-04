import { Triage } from "../triage";

export default {
  mode: "literal",
  skip: true,
  tests: [{ target: "1000{ mL}", eq: ["1000 { ml}"] }],
  triage: Triage.MEASUREMENT_UNITS
};
