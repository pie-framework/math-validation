import { string } from "mathjs";
import { latexEqual } from "./index";
import { Opts } from "./latex-equal";

let opts: Opts = {};
let flags = "";

const params = window.location.search;
const urlParams = new URLSearchParams(params);

// atob()

// // this metod is necessary in order to encode UTF-8 characters
// const toBinary = (latex) => {
//   const codeUnits = new Uint16Array(latex.length);

//   for (let i = 0; i < codeUnits.length; i++) {
//     codeUnits[i] = latex.charCodeAt(i);
//   }
//   return String.fromCharCode(...new Uint8Array(codeUnits.buffer));
// };

window.addEventListener("DOMContentLoaded", (event) => {
  const form = <HTMLFormElement>document.getElementById("equalityform")!;

  const mode = document.getElementById("validation-type") as HTMLInputElement;
  mode.value = urlParams.get("validation-type")
    ? urlParams.get("validation-type")
    : "";

  const allowTzn = document.getElementById("tzn") as HTMLInputElement;
  allowTzn.value = urlParams.get("tzn") ? urlParams.get("tzn") : "";

  const ignTrue = document.getElementById("ign") as HTMLInputElement;
  ignTrue.value = urlParams.get("ign") ? urlParams.get("ign") : "";

  const exp1 = document.getElementById("me1") as HTMLInputElement;
  exp1.value = urlParams.get("me1") ? urlParams.get("me1") : "";

  const exp2 = document.getElementById("me2") as HTMLInputElement;
  exp2.value = urlParams.get("me2") ? urlParams.get("me2") : "";

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const validationType = (
      document.getElementById("validation-type") as HTMLInputElement
    ).value;

    if (validationType == "literal" || validationType == "symbolic") {
      console.log(validationType, "validationType");
      opts.mode = validationType;
      console.log(opts.mode, "mode");
    }

    const tzn: string = (document.getElementById("tzn") as HTMLInputElement)
      .value;

    const ignoreOrder: string = (
      document.getElementById("ign") as HTMLInputElement
    ).value;

    if (opts.mode == "literal") {
      opts.literal = {
        allowTrailingZeros: false,
        ignoreOrder: false,
      };

      console.log("tzn", tzn);
      if (tzn) {
        opts.literal.allowTrailingZeros = true;
      }

      console.log(ignoreOrder, "ign");
      if (ignoreOrder) {
        opts.literal.ignoreOrder = true;
      }
    }

    let firstExpression: string = (
      document.getElementById("me1") as HTMLInputElement
    ).value;

    let secondExpression: string = (
      document.getElementById("me2") as HTMLInputElement
    ).value;

    const result = latexEqual(firstExpression, secondExpression, opts);

    let message: string;
    if (result) {
      message = `The entered expressions validate each other in ${validationType} mode`;
    } else {
      message = `The entered expressions does not validate each other in ${validationType} mode`;
    }

    console.log(firstExpression, "firstexpr");
    console.log(secondExpression, "secondexpr");
    console.log(result, "result");

    let paragraph = document.createElement("p");
    const node = document.createTextNode(message);
    paragraph.appendChild(node);
    const response = document.getElementById("result");
    response.appendChild(paragraph);
  });
});
