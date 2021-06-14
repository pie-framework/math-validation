import { Triage } from "../../triage";

export default {
  mode: "symbolic",
  tests: [
    {
      target: "a_n=3a_{n-1}",
      eq: ["a_n=3\\times a_{n-1}"],
      ne: ["a_n=3\\times a_{n+1}"],
    },
    {
      target: "a_{i}=1/2i[2s+(i-1)d]",
      eq: ["a_{i}=0.5i(2s+di-d)"],
      ne: ["a_{i-1}=0.5i(2s+di-d)"],
    },
    {
      // this is not working
      target: "a_{n}=(-1/2i)^n",
      eq: ["a_{n}=\\frac{-1}{2i}^n", "a_{n}=(-1*\\frac{1}{2i})^n"],
      ne: ["a_{i-1}=0.5i(2s+di-d)"],
      triage: [Triage.FRACTIONS_PROPERTIES],
    },
  ],
};
