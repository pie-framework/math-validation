const { parse, HtmlGenerator } = require("latex.js");
const { createHTMLWindow } = require("svgdom");

global.window = createHTMLWindow();
global.document = window.document;

let latex = "\\[\\frac{1}{2}\\]";

let generator = {};

let doc = parse(latex, { generator }).htmlDocument();

console.log(doc.documentElement.outerHTML);
