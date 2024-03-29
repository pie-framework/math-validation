export default {
  mode: "symbolic",
  tests: [
    {
      target: "100",
      eq: [
        "100",
        "50+50",
        "25*4",
        "200/2",
        "20*5",
        "2.5*40",
        "10*10",
        "100 / 2 + 50",
      ],
      // ne: ["100.000001", "44 + 57", "50 * 3", "25 * 2 + 51"],
    },
    {
      target: "13/2",
      eq: ["26/4", "6 + 1/2", "6.5"],
    },
  ],
};
