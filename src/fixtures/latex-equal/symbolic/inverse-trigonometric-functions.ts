import { Triage } from "../../triage";

export default {
  //skip: true,
  mode: "symbolic",

  only: true,
  tests: [
    //inverse functions conversion
    {
      target: "\\asin\\left(x\\right)",
      eq: ["\\arcsin \\left(x\\right)"],
    },
    {
      target: "\\sin^{-1}\\left(x\\right)",
      eq: ["\\arcsin x"],
    },
    {
      target: "\\acos\\left(x\\right)",
      eq: ["\\arccos \\left(x\\right)"],
    },
    {
      target: "\\cos^{-1}\\left(x\\right)",
      eq: ["\\arccos x"],
    },
    {
      target: "\\atan\\left(x\\right)",
      eq: ["\\arctan \\left(x\\right)"],
    },
    {
      target: "\\tan^{-1}\\left(x\\right)",
      eq: ["\\arctan x"],
    },
    {
      target: "\\asec\\left(x\\right)",
      eq: ["\\arcsec \\left(x\\right)"],
    },
    {
      target: "\\sec^{-1}\\left(x\\right)",
      eq: ["\\arcsec x"],
    },
    {
      target: "\\asin\\left(x\\right)",
      eq: ["\\arcsin \\left(x\\right)"],
    },
    {
      target: "\\csc^{-1}\\left(x\\right)",
      eq: ["\\arccsc x"],
    },
    {
      target: "\\acsc\\left(x\\right)",
      eq: ["\\arccsc \\left(x\\right)"],
    },
    {
      target: "\\acot\\left(x\\right)",
      eq: ["\\arccot \\left(x\\right)"],
    },
    {
      target: "\\cot^{-1}\\left(x\\right)",
      eq: ["\\arccot x"],
    },
    //inverse trigonometric functions relations
    {
      target: "x=\\sin^{-1}\\left(\\frac{1}{n}\\right)",
      eq: ["\\frac{1}{n}=\\sin x", "\\sin x = \\frac{1}{n}", "1/n = \\sin x"],
    },
    {
      target: "x=\\sin^{-1}\\left(y\\right)",
      eq: ["y=\\sin x", "\\sin x = y", "y= \\sin x"],
      ne: ["\\cos x=y", "y=x"],
    },
    {
      target: "x=\\cos^{-1}\\left(\\frac{1}{n}\\right)",
      eq: ["\\frac{1}{n}=\\cos x", "\\cos x = \\frac{1}{n}", "1/n = \\cos x"],
    },
    {
      target: "x=\\cos^{-1}\\left(y\\right)",
      eq: ["y=\\cos x", "\\cos x = y", "y= \\cos x"],
      ne: ["\\sin x=y", "y=x"],
    },
    {
      target: "x=\\tan^{-1}\\left(\\frac{1}{n}\\right)",
      eq: ["\\frac{1}{n}=\\tan x", "\\tan x = \\frac{1}{n}", "1/n = \\tan x"],
    },
    {
      target: "x=\\tan^{-1}\\left(y\\right)",
      eq: ["y=\\tan x", "\\tan x = y", "y= \\tan x"],
      ne: ["\\cos x=y", "y=x"],
    },
    {
      target: "x=\\cot^{-1}\\left(\\frac{1}{n}\\right)",
      eq: ["\\frac{1}{n}=\\cot x", "\\cot x = \\frac{1}{n}", "1/n = \\cot x"],
    },
    {
      target: "x=\\cot^{-1}\\left(y\\right)",
      eq: ["y=\\cot x", "\\cot x = y", "y= \\cot x"],
      ne: ["\\tan x=y", "y=x"],
    },
    {
      target: "x=\\sec^{-1}\\left(\\frac{1}{n}\\right)",
      eq: ["\\frac{1}{n}=\\sec x", "\\sec x = \\frac{1}{n}", "1/n = \\sec x"],
    },
    {
      target: "x=\\sec^{-1}\\left(y\\right)",
      eq: [
        "y=\\sec x",
        "\\sec x = y",
        "y = 1/\\cos (x)",
        "y= \\sec x",
        "y=1/\\cos x",
      ],
      ne: ["\\cos x=y", "y=x"],
    },
    {
      target: "x=\\csc^{-1}\\left(\\frac{1}{n}\\right)",
      eq: ["\\frac{1}{n}=\\csc x", "\\csc x = \\frac{1}{n}", "1/n = \\csc x"],
    },
    {
      target: "x=\\csc^{-1}\\left(y\\right)",
      eq: ["y=\\csc x", "\\csc x = y", "y= \\csc x"],
      ne: ["\\cos x=y", "y=x"],
    },
  ],
};
