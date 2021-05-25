import { latexEqual } from "./index";
import { Opts } from "./latex-equal";

let opts: Opts = {};
let flags = "?";

const params = window.location.search;
const urlParams = new URLSearchParams(params);

window.addEventListener("DOMContentLoaded", (event) => {
  const form = <HTMLFormElement>document.getElementById("equality-form")!;

  const mode = document.getElementById("validation-type") as HTMLInputElement;
  mode.value = urlParams.get("validation-type")
    ? decodeURIComponent(urlParams.get("validation-type"))
    : "";

  const allowTraillingZeros = document.getElementById(
    "trailling-zeros"
  ) as HTMLInputElement;

  // @ts-ignore
  allowTraillingZeros.checked = urlParams.get("trailling-zeros")
    ? decodeURIComponent(urlParams.get("trailling-zeros"))
    : false;

  const ignoreOrderTrue = document.getElementById(
    "ignore-order"
  ) as HTMLInputElement;

  // @ts-ignore
  ignoreOrderTrue.checked = urlParams.get("ignore-order")
    ? decodeURIComponent(urlParams.get("ignore-order"))
    : false;

  const exppression1 = document.getElementById(
    "math-expression1"
  ) as HTMLInputElement;

  exppression1.value = urlParams.get("math-expression1")
    ? decodeURIComponent(urlParams.get("math-expression1"))
    : "";

  const exppression2 = document.getElementById(
    "math-expression2"
  ) as HTMLInputElement;

  exppression2.value = urlParams.get("math-expression2")
    ? decodeURIComponent(urlParams.get("math-expression2"))
    : "";

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const validationType = (
      document.getElementById("validation-type") as HTMLInputElement
    ).value;

    flags += "validation-type=" + encodeURIComponent(validationType);

    if (validationType == "literal" || validationType == "symbolic") {
      opts.mode = validationType;
    }

    const trailingZeros: boolean = (
      document.getElementById("trailling-zeros") as HTMLInputElement
    ).checked;

    const ignoreOrder: boolean = (
      document.getElementById("ignore-order") as HTMLInputElement
    ).checked;

    if (opts.mode == "literal") {
      opts.literal = {
        allowTrailingZeros: false,
        ignoreOrder: false,
      };

      if (trailingZeros) {
        opts.literal.allowTrailingZeros = true;
        flags +=
          "&trailling-zeros=" + encodeURIComponent(trailingZeros.toString());
      }

      if (ignoreOrder) {
        opts.literal.ignoreOrder = true;
        flags += "&ignore-order=" + encodeURIComponent(ignoreOrder.toString());
      }
    }

    const firstExpression: string = (
      document.getElementById("math-expression1") as HTMLInputElement
    ).value;

    const secondExpression: string = (
      document.getElementById("math-expression2") as HTMLInputElement
    ).value;

    const result = latexEqual(firstExpression, secondExpression, opts);

    let message: string;
    
    if (result) {
      message = `The entered expressions validate each other in ${validationType} mode`;
    } else {
      message = `The entered expressions does not validate each other in ${validationType} mode`;
    }

    flags +=
      "&math-expression1=" +
      encodeURIComponent(firstExpression) +
      "&math-expression2=" +
      encodeURIComponent(secondExpression);

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
