export default {
    mode: "symbolic",
    tests: [
      {
        target: "5.5",
        eq: [
          "5.50", "5.50000",
        ],
      },
      {
        target: "15",
        eq: [
          "15.000",
        ],
      },
      {
        target: "\\frac{5}{4}",
        eq: [
          "1.25000",
        ],
      },
      {
        target: "45",
        eq: [
          "45.00",
        ],
      },
      {
        target: "-45.3",
        eq: [
          "-45.300",
        ],
      },
      {
        target: "11.25",
        eq: [
            "11.250", "11.2500",
        ],
      },
      {
        target: "11.25x",
        eq: [
          "11.2500x",
        ],
      },
      {
        target: "0.75",
        eq: [
          "0.750",
        ],
      },
      {
        target: "16",
        eq: [
          "16.00",
        ],
      },
      {
        target: "1.30",
        eq: [
          "1.300",
        ],
      },
      {
        target: "8",
        eq: [
          "8.0",
        ],
      },
    ],
  };
  