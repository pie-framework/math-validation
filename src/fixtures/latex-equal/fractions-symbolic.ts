export default {
  mode: "symbolic",
  tests: [
    {
      //only: true,
      target: "\\frac{x}{12}\\times7\\text{dollars}",
      eq: [
        "\\frac{7x}{12}\\ \\text{dollars}",
        "x\\times \\frac{1}{12}\\times 7\\ \\text{dollars}",
        "x\\times 7\\times \\frac{1}{12}\\ \\text{dollars}",
        "\\frac{1}{12}\\times x\\times 7\\ \\text{dollars}",
        "\\frac{7}{12}\\times x\\ \\text{dollars}",
        "\\frac{1}{12}x\\times 7\\ \\text{dollars}",
        "\\frac{1}{12}\\left(7x\\right)\\ \\text{dollars}",
        "\\frac{1}{12}\\left(x\\times 7\\right)\\ \\text{dollars}",
      ],
    },

    {
      target: "\\frac{n-5}{6}",
      eq: [
        "\\frac{-5+n}{6}",
        "\\frac{n}{6}-\\frac{5}{6}",
        "-\\frac{5}{6}+\\frac{n}{6}",
        "\\frac{1}{6}\\left(n-5\\right)",
        "\\frac{1}{6}\\left(-5+n\\right)",
      ],
    },
    {
      target: "6 \\frac{1}{2}",
      eq: ["6 + \\frac{1}{2}"],
      ne: ["6 * \\frac{1}{2}"],
    },

    {
      //GEORGE QUESTION
      target: "\\frac{6\\pi}{x}\\text{radians}\\ \\text{per}\\ \\text{second}",
      eq: [
        "\\frac{1}{x}\\left(6\\pi \\right)\\ \\text{radians}\\ \\text{per}\\ \\text{second}",
        "\\frac{6}{x}\\pi \\ \\text{radians}\\ \\text{per}\\ \\text{second}",
        // >>> TODO: the ast is wrong here - we get [+, 6, [/, pi, x]]
        // "6\\frac{\\pi }{x}\\ \\text{radians}\\ \\text{per}\\ \\text{second}",
        "6\\pi \\left(\\frac{1}{x}\\right)\\ \\text{radians}\\ \\text{per}\\ \\text{second}",
      ],
    },
    {
      //GEORGE QUESTION
      target: "\\frac{6\\pi}{x}",
      eq: [
        "\\frac{1}{x}\\left(6\\pi \\right)",
        "\\frac{6}{x}\\pi",
        // >>> TODO: the ast is wrong here - we get [+, 6, [/, pi, x]]
        "6 * \\frac{\\pi }{x}",
        "\\left(6\\right) \\frac{\\pi }{x}",

        // see above a number followed by a fraction is seen as addition not multiplication
        //"6 \\frac{\\pi }{x}",
        "6\\pi \\left(\\frac{1}{x}\\right)\\ \\text{radians}\\ \\text{per}\\ \\text{second}",
      ],
    },
    {
      target: "\\frac{d}{240}+4\\ \\text{years}",
      eq: [
        "4+\\frac{d}{240}\\ \\text{years}",
        "4+\\frac{1}{240}d\\ \\text{years}",
        "4+d\\left(\\frac{1}{240}\\right)\\ \\text{years}",
        "d\\left(\\frac{1}{240}\\right)+4\\ \\text{years}",
        "\\frac{1}{240}d+4\\ \\text{years}",
      ],
    },
    {
      target: "\\frac{d}{240}+4\\ \\text{years}",
      eq: [
        "4+\\frac{d}{240}\\ \\text{years}",
        "4+\\frac{1}{240}d\\ \\text{years}",
        "4+d\\left(\\frac{1}{240}\\right)\\ \\text{years}",
        "d\\left(\\frac{1}{240}\\right)+4\\ \\text{years}",
        "\\frac{1}{240}d+4\\ \\text{years}",
      ],
    },
    {
      target: "0.65x",
      eq: [
        "\\frac{65}{100}x",
        "\\frac{13}{20}x",
        "\\frac{65x}{100}",
        "\\frac{13x}{20}",
      ],
    },
    {
      target: "\\frac{a+c}{2}+\\frac{b+d}{2}i",
      eq: [
        "\\frac{c+a}{2}+\\frac{b+d}{2}i",
        "\\frac{c+a}{2}+\\frac{d+b}{2}i",
        "\\frac{a+c}{2}+\\frac{d+b}{2}i",
      ],
    },
    {
      target: "\\frac{10}{12}\\pi\\ \\text{radians}",
      eq: [
        "\\frac{5}{6}\\pi \\ \\text{radians}",
        "\\frac{10\\pi }{12}\\ \\text{radians}",
        "\\frac{5\\pi }{6}\\ \\text{radians}",
        "\\frac{50\\pi }{60}\\ \\text{radians}",
        "\\frac{50}{60}\\pi \\ \\text{radians}",
      ],
    },
    {
      target: "h=\\frac{3V}{B}",
      eq: [
        "h=3\\frac{V}{B}",
        "h=\\frac{\\left(3\\times V\\right)}{B}",
        "h=\\left(3V\\right)\\div B",
        "h=\\left(3\\times V\\right)\\div B",
      ],
    },
    {
      target: "r=\\sqrt{\\frac{V}{\\pi h}}",
      eq: [
        "r=\\left(\\frac{V}{\\pi h}\\right)^{\\frac{1}{2}}",
        "r=\\left(\\frac{V}{\\pi \\times h}\\right)^{\\frac{1}{2}}",
        "r=\\sqrt{\\frac{V}{\\pi \\times h}}",
      ],
    },
    {
      target: "c=-\\frac{b}{m}",
      eq: [
        "c=-b\\div m",
        "c=-b\\times \\frac{1}{m}",
        "c=\\left(-b\\right)\\left(\\frac{1}{m}\\right)",
        "c=\\frac{-b}{m}",
        "c=\\frac{b}{-m}",
      ],
    },
    {
      target: "c=\\frac{\\pi}{b}",
      eq: [
        "c=\\pi \\div b",
        "c=\\pi \\times \\frac{1}{b}",
        "c=\\pi \\left(\\frac{1}{b}\\right)",
        "c=\\left(\\frac{1}{b}\\right)\\pi ",
      ],
    },
    {
      target: "V\\left(t\\right)=750\\left(1.5\\right)^t",
      eq: [
        "V(t)\\ =\\ 750\\left(\\frac{3}{2}\\right)^t",
        "V(t)\\ =\\ 750\\left(1+0.5\\right)^t",
        "V(t)\\ =\\ 750\\left(1+\\frac{1}{2}\\right)^t",
      ],
    },
    {
      target: "g\\left(x\\right)=\\sqrt[3]{x-2}",
      eq: [
        "g\\left(x\\right)\\ =\\ \\sqrt[3]{-2+x}",
        "g\\left(x\\right)\\ =\\ \\left(x-2\\right)^{\\frac{1}{3}}",
        "g\\left(x\\right)\\ =\\ \\left(-2+x\\right)^{\\frac{1}{3}}",
      ],
    },
    {
      target: "g\\left(x\\right)=\\sqrt[3]{x-2}",
      eq: [
        "g\\left(x\\right)\\ =\\ \\sqrt[3]{-2+x}",
        "g\\left(x\\right)\\ =\\ \\left(x-2\\right)^{\\frac{1}{3}}",
        "g\\left(x\\right)\\ =\\ \\left(-2+x\\right)^{\\frac{1}{3}}",
      ],
    },
    {
      target: "h=\\frac{da}{c}",
      eq: [
        "h=\\frac{ad}{c}",
        "h=\\frac{a\\times d}{c}",
        "h=\\frac{d\\times a}{c}",
        "h=\\left(d\\times a\\right)\\div c",
        "h=\\left(a\\times d\\right)\\div c",
        "h=d\\left(\\frac{a}{c}\\right)",
        "h=d\\left(a\\div c\\right)",
        "h=a\\left(d\\div c\\right)",
        "h=a\\left(\\frac{d}{c}\\right)",
      ],
    },
    {
      target: "x=\\frac{c-by}{a}",
      eq: [
        "x=\\frac{1}{a}\\left(c-by\\right)",
        "x=\\left(c-by\\right)\\div a",
        "x=\\frac{1}{a}\\left(-by+c\\right)",
        "x=\\frac{\\left(-by+c\\right)}{a}",
        "x=\\frac{-by+c}{a}",
        "x=\\left(-by+c\\right)\\div a",
        "x=\\frac{\\left(c-by\\right)}{a}",
        "x=\\frac{c}{a}-\\frac{by}{a}",
        "x=\\frac{1}{a}c-\\frac{1}{a}by",
      ],
    },
    {
      skip: true,
      target: "f\\left(x\\right)=x\\left(3x+16\\right)",
      eq: [
        "f\\left(x\\right)\\ =\\ \\left(3x+16\\right)x",
        "f\\left(x\\right)\\ =\\ \\left(3x+16\\right)\\left(x\\right)",
        "f\\left(x\\right)\\ =\\ \\left(16+3x\\right)\\left(x\\right)",
        "f\\left(x\\right)\\ =\\ x\\left(16+3x\\right)",
        "f\\left(x\\right)\\ =\\ \\left(16+3x\\right)x",
        "f\\left(x\\right)\\ =\\ 16x+3x^2",
        "f\\left(x\\right)\\ =\\ 3x^2+16x",
      ],
    },
  ],
};

export const toBeAdded = [
  {
    target: "y=6x^2+2x",
    eq: [
      "y=2x+6x^2",
      "y=x\\left(6x+2\\right)",
      "y=2x\\left(3x+1\\right)",
      "y=x\\left(2+6x\\right)",
      "y=2x\\left(1+3x\\right)",
    ],
  },
  {
    target: "d\\left(x\\right)=0.05x^2+2x",
    eq: [
      "d\\left(x\\right)=\\frac{1}{20}x^2+2x",
      "d\\left(x\\right)=\\frac{x^2}{20}+2x",
      "d\\left(x\\right)=x\\left(0.05x+2\\right)",
      "d\\left(x\\right)=x\\left(2+0.05x\\right)",
      "d\\left(x\\right)=2x+0.05x^2",
      "d\\left(x\\right)=x\\left(\\frac{1}{20}x+2\\right)",
      "d\\left(x\\right)=x\\left(2+\\frac{1}{20}x\\right)",
      "d\\left(x\\right)=x\\left(2+\\frac{x}{20}\\right)",
      "d\\left(x\\right)=x\\left(\\frac{x}{20}+2\\right)",
    ],
  },
  {
    target: "f\\left(x\\right)=x\\left(4x-5\\right)",
    eq: [
      "f(x)\\ =\\ x\\left(-5+4x\\right)",
      "f(x)\\ =\\ 4x^2-5x",
      "f(x)\\ =\\ -5x+4x^2",
    ],
  },
  {
    target: "f\\left(x\\right)=x\\left(2x+6\\right)",
    eq: [
      "f(x)\\ =\\ x\\left(6+2x\\right)",
      "f(x)\\ =\\ 2x^2+6x",
      "f(x)\\ =\\ 6x+2x^2",
      "f(x)\\ =\\ 6x+2x^2",
      "f(x)\\ =\\ 2x\\left(3+x\\right)",
    ],
  },
  {
    target: "y=\\frac{a}{b}x-\\frac{c}{b}",
    eq: [
      "y=\\frac{c-ax}{-b}",
      "y=-\\frac{1}{b}\\left(c-ax\\right)",
      "y=-\\frac{c}{b}+\\frac{ax}{b}",
      "y=-\\frac{c}{b}+\\frac{a}{b}x",
      "y=\\frac{ax}{b}-\\frac{c}{b}",
      "y=-\\frac{1}{b}\\left(-ax+c\\right)",
      "y=\\frac{1}{b}\\left(ax-c\\right)",
      "y=\\frac{1}{b}\\left(-c+ax\\right)",
      "y=\\frac{-c+ax}{b}",
    ],
  },
  {
    target: "x=ab-ay",
    eq: [
      "x=-ay+ab",
      "x=ba-ya",
      "x=-ya+ba",
      "x=a\\left(b-y\\right)",
      "x=a\\left(b-y\\right)",
    ],
  },
  {
    target: "r=\\sqrt{\\frac{V}{\\pi h}}",
    eq: [
      "r=\\left(\\frac{V}{\\pi h}\\right)^{\\frac{1}{2}}",
      "r=\\left(\\frac{V}{\\pi \\times h}\\right)^{\\frac{1}{2}}",
      "r=\\sqrt{\\frac{V}{\\pi \\times h}}^{ }",
    ],
  },
  {
    target: "100,000=72,300\\left(1.008\\right)^x",
    eq: [
      "72,300\\left(1.008\\right)^x=100,000",
      "100000=72300\\left(1.008\\right)^x",
      "72300\\left(1.008\\right)^x=100000",
    ],
  },
  {
    target: "p=15n-5",
    eq: ["p=-5+15n", "-5+15n=p", "15n-5=p"],
  },
  {
    target: "f=\\text{$}7.5h",
    eq: ["f=\\text{$}7.5h"],
  },
  {
    target: "b=d",
    eq: ["d=b"],
  },
  {
    target:
      "\\frac{\\left(y+0\\right)^2}{16}-\\frac{\\left(x+2\\right)^2}{9}=1",
    eq: [
      "1=\\frac{\\left(y+0\\right)^2}{16}-\\frac{\\left(x+2\\right)^2}{9}",
      "-\\frac{\\left(x+2\\right)^2}{9}+\\frac{\\left(y+0\\right)^2}{16}=1",
      "1=-\\frac{\\left(x+2\\right)^2}{9}+\\frac{\\left(y+0\\right)^2}{16}",
    ],
  },
  {
    target: "\\left(y-7\\right)^2=60\\left(x-15\\right)",
    eq: [
      "60\\left(x-15\\right)=\\left(y-7\\right)^2",
      "60x-900=\\left(y-7\\right)^2",
      "\\left(y-7\\right)^2=60x-900",
      "y^2-14y+49=60x-900",
      "60x-900=y^2-14y+49",
    ],
  },
  {
    target: "\\frac{x^2}{64}+\\frac{y^2}{36}=1",
    eq: [
      "\\frac{x^2}{8^2}+\\frac{y^2}{6^2}=1",
      "1=\\frac{x^2}{64}+\\frac{y^2}{36}",
      "1=\\frac{y^2}{36}+\\frac{x^2}{64}",
      "\\frac{y^2}{36}+\\frac{x^2}{64}=1",
      "\\frac{y^2}{6^2}+\\frac{x^2}{8^2}=1",
      "1=\\frac{y^2}{6^2}+\\frac{x^2}{8^2}",
    ],
  },
  {
    target: "36x^2+64y^2=2,304",
    eq: ["36x^2+64y^2=36\\left(64\\right)", "36x^2+64y^2=2304"],
  },
  {
    target: "x=\\sin^{-1}\\left(\\frac{1}{n}\\right)",
    eq: ["\\frac{1}{n}=\\sin x"],
  },
  {
    target: "\\frac{\\left(x+10\\right)^2}{275}+\\frac{y^2}{900}=1",
    eq: [
      "\\frac{y^2}{900}+\\frac{\\left(x+10\\right)^2}{275}=1",
      "1=\\frac{\\left(x+10\\right)^2}{275}+\\frac{y^2}{900}",
      "1=\\frac{y^2}{900}+\\frac{\\left(x+10\\right)^2}{275}",
      "\\frac{\\left(x+10\\right)^2}{275}+\\frac{y^2}{30^2}=1",
      "\\frac{\\left(x+10\\right)^2}{30^2-25^2}+\\frac{y^2}{30^2}=1",
      "1=\\frac{\\left(x+10\\right)^2}{30^2-25^2}+\\frac{y^2}{30^2}",
      "1=\\frac{\\left(x+10\\right)^2}{275}+\\frac{y^2}{30^2}",
      "1=\\frac{y^2}{30^2}+\\frac{\\left(x+10\\right)^2}{275}",
      "1=\\frac{y^2}{30^2}+\\frac{\\left(x+10\\right)^2}{30^2-25^2}",
    ],
  },
  {
    target: "12x=200",
    eq: ["200=12x", "3x+9x=200", "9x+3x=200", "200=3x+9x", "200=9x+3x"],
  },
  {
    target: "x=\\frac{50}{3}",
    eq: [
      "x=\\frac{200}{12}",
      "\\frac{200}{12}=x",
      "x=\\frac{50}{3}",
      "\\frac{50}{3}=x",
    ],
  },
  {
    target: "y=350x",
    eq: ["350x=y"],
  },
  {
    target: "c=1-\\left(\\frac{3}{5}+\\frac{1}{4}\\right)",
    eq: [
      "1-\\left(\\frac{3}{5}+\\frac{1}{4}\\right)=c",
      "1-\\frac{3}{5}-\\frac{1}{4}=c",
      "c=1-\\frac{3}{5}-\\frac{1}{4}",
      "c=1-\\frac{1}{4}-\\frac{3}{5}",
      "c=1-\\left(\\frac{1}{4}+\\frac{3}{5}\\right)",
    ],
  },
  {
    target: "1=c+\\frac{3}{5}+\\frac{1}{4}",
    eq: [
      "1=\\frac{3}{5}+\\frac{1}{4}+c",
      "\\frac{3}{5}+\\frac{1}{4}+c=1",
      "c+\\frac{3}{5}+\\frac{1}{4}=1",
    ],
  },
  {
    target: "x+\\left(x-3\\right)+4x=63",
    eq: [
      "\\left(x-3\\right)+4x+x=63",
      "x+x-3+4x=63",
      "\\left(x-3\\right)+5x=63",
      "6x-3=63",
      "63=x+\\left(x-3\\right)+4x",
      "63=6x-3",
      "63=x+x-3+4x",
      "4x+x+\\left(x-3\\right)=63",
      "4x+\\left(x-3\\right)+x=63",
    ],
  },
  {
    target: "18+6x=33",
    eq: ["33=18+6x", "33=6x+18", "6x+18=33"],
  },
  {
    target: "y=\\frac{1}{2}x+11",
    eq: ["y=0.5x+11", "y=11+0.5x", "y=11+\\frac{1}{2}x"],
  },
  {
    target: "p=d-40",
    eq: ["p=-40+d", "d-40=p", "-40+d=p"],
  },
  {
    target: "d=p+40",
    eq: ["d=40+p", "p+40=d", "40+p=d"],
  },
  {
    target: "x+12\\ =\\ 16",
    eq: ["16=x+12", "12+x=16", "16=12+x"],
  },
  {
    target: "16-x=12",
    eq: ["12=16-x"],
  },
  {
    target: "x=16-12",
    eq: ["16-12=x"],
  },
  {
    target: "5.5x+8y\\ge100",
    eq: [
      "8y+5.5x\\ge 100",
      "100\\le 8y+5.5x",
      "100\\le 5.5x+8y",
      "5.50x+8y\\ge 100",
      "100\\le 5.50x+8y",
      "8y+5.50x\\ge 100",
      "100\\le 8y+5.50x",
    ],
  },
  {
    target: "c\\ge\\frac{15}{2}",
    eq: [
      "c\\ge \\frac{30}{4}",
      "c\\ge 7.5",
      "7.5\\le c",
      "\\frac{15}{2}\\le c",
      "\\frac{30}{4}\\le c",
    ],
  },
  {
    target: "x\\le\\frac{11}{5}",
    eq: ["x\\le 2.2", "x\\le 2\\frac{1}{5}"],
  },
  {
    target: "4+5x\\le15",
    eq: ["5x+4\\le 15"],
  },
  {
    target: "x\\le3\\frac{1}{8}",
    eq: ["x\\le 3.125", "3.125\\ge x", "3\\frac{1}{8}\\ge x"],
  },
];
