import { latexEqual } from "./index";
import { Opts } from "./latex-equal";

let opts: Opts = {};
let flags = "?";

//const baseUrl = window.location.href;
const params = window.location.search;
const urlParams = new URLSearchParams(params);

// this metod is necessary in order to encode UTF-8 characters
const toBinary = (latex) => {
  const codeUnits = new Uint16Array(latex.length);

  for (let i = 0; i < codeUnits.length; i++) {
    codeUnits[i] = latex.charCodeAt(i);
  }
  return String.fromCharCode(...new Uint8Array(codeUnits.buffer));
};

const fromBinary = (binary) => {
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return String.fromCharCode(...new Uint16Array(bytes.buffer));
};

window.addEventListener("DOMContentLoaded", (event) => {
  const form = <HTMLFormElement>document.getElementById("equalityform")!;

  const mode = document.getElementById("validation-type") as HTMLInputElement;
  mode.value = urlParams.get("validation-type")
    ? atob(toBinary(urlParams.get("validation-type")))
    : "";

  const allowTzn = document.getElementById("tzn") as HTMLInputElement;
  // @ts-ignore
  allowTzn.checked = urlParams.get("tzn")
    ? atob(toBinary(urlParams.get("tzn")))
    : false;

  const ignTrue = document.getElementById("ign") as HTMLInputElement;
  // @ts-ignore
  ignTrue.checked = urlParams.get("ign")
    ? atob(toBinary(urlParams.get("ign")))
    : false;

  const exp1 = document.getElementById("me1") as HTMLInputElement;
  exp1.value = urlParams.get("me1") ? atob(toBinary(urlParams.get("me1"))) : "";

  const exp2 = document.getElementById("me2") as HTMLInputElement;
  exp2.value = urlParams.get("me2") ? atob(toBinary(urlParams.get("me2"))) : "";

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const validationType = (
      document.getElementById("validation-type") as HTMLInputElement
    ).value;

    flags += "validation-type=" + btoa(validationType);

    if (validationType == "literal" || validationType == "symbolic") {
      console.log(validationType, "validationType");
      opts.mode = validationType;
      console.log(opts.mode, "mode");
    }

    const tzn: boolean = (document.getElementById("tzn") as HTMLInputElement)
      .checked;

    const ignoreOrder: boolean = (
      document.getElementById("ign") as HTMLInputElement
    ).checked;

    if (opts.mode == "literal") {
      opts.literal = {
        allowTrailingZeros: false,
        ignoreOrder: false,
      };

      if (tzn) {
        opts.literal.allowTrailingZeros = true;
        flags += "&tzn=" + fromBinary(btoa(tzn.toString()));
      }

      if (ignoreOrder) {
        opts.literal.ignoreOrder = true;
        flags += "&ign=" + fromBinary(btoa(ignoreOrder.toString()));
      }
    }

    const firstExpression: string = (
      document.getElementById("me1") as HTMLInputElement
    ).value;

    const secondExpression: string = (
      document.getElementById("me2") as HTMLInputElement
    ).value;

    const result = latexEqual(firstExpression, secondExpression, opts);

    let message: string;
    if (result) {
      message = `The entered expressions validate each other in ${validationType} mode`;
    } else {
      message = `The entered expressions does not validate each other in ${validationType} mode`;
    }

    flags +=
      "&me1=" +
      fromBinary(btoa(firstExpression)) +
      "&me2=" +
      fromBinary(btoa(secondExpression));

    window.history.replaceState(null, null, flags);

    // reset flags
    flags = "?";

    const response = document.getElementById("response") as HTMLInputElement;
    response.innerHTML = message;
  });
});
