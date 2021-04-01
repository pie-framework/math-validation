import { Triage } from "../triage";
export default {
  mode: "symbolic",
  tests: [
    {
      triage: [Triage.BAD_USER_INPUT],
      target: "1 + 1",
      ne: [
        "abcdefghijklmnopqrstuvwxyz 1 2 abcdeghijk ab cd ef bq arub oin tsn arstoin a8 asin aosin cvbkyu isn",
      ],
    },
  ],
};
