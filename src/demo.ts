import { latexEqual } from "./index";
import { Opts } from "./latex-equal";

let opts: Opts = {};
let flags = "?";

const params = window.location.search;
const urlParams = new URLSearchParams(params);

window.addEventListener("DOMContentLoaded", (event) => {
  const form = <HTMLFormElement>document.getElementById("equalityform")!;

  const mode = document.getElementById("validation-type") as HTMLInputElement;
  mode.value = urlParams.get("validation-type")
    ? decodeURI(urlParams.get("validation-type"))
    : "";

  const allowTzn = document.getElementById("tzn") as HTMLInputElement;
  // @ts-ignore
  allowTzn.checked = urlParams.get("tzn")
    ? decodeURI(urlParams.get("tzn"))
    : false;

  const ignTrue = document.getElementById("ign") as HTMLInputElement;
  // @ts-ignore
  ignTrue.checked = urlParams.get("ign")
    ? decodeURI(urlParams.get("ign"))
    : false;

  const exp1 = document.getElementById("me1") as HTMLInputElement;
  exp1.value = urlParams.get("me1") ? decodeURI(urlParams.get("me1")) : "";

  const exp2 = document.getElementById("me2") as HTMLInputElement;
  exp2.value = urlParams.get("me2") ? decodeURI(urlParams.get("me2")) : "";

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const validationType = (
      document.getElementById("validation-type") as HTMLInputElement
    ).value;

    flags += "validation-type=" + encodeURI(validationType);

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
        flags += "&tzn=" + encodeURI(tzn.toString());
      }

      if (ignoreOrder) {
        opts.literal.ignoreOrder = true;
        flags += "&ign=" + encodeURI(ignoreOrder.toString());
      }
    }

    const firstExpression: string = (
      document.getElementById("me1") as HTMLInputElement
    ).value;
    console.log(firstExpression);

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
      encodeURI(firstExpression) +
      "&me2=" +
      encodeURI(secondExpression);

    window.history.replaceState(null, null, flags);

    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    form.classList.add("was-validated");

    // reset flags
    flags = "?";

    const response = document.getElementById("response") as HTMLInputElement;
    response.innerHTML = message;
  });
});
