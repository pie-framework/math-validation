import { latexEqual } from "./index.js";
import { Opts } from "./latex-equal";

export const demo = () => {
  let opts: Opts = {};
  let flags = "?";

  const params = window.location.search;
  const urlParams = new URLSearchParams(params);

  let mode: HTMLInputElement;
  let allowTrailingZeros: HTMLInputElement;
  let ignoreOrder: HTMLInputElement;

  const getOptions = (mode, allowTrailingZeros, ignoreOrder) => {
    if (mode == "literal" || mode == "symbolic") {
      opts.mode = mode;
    }

    if (opts.mode == "literal") {
      opts.literal = {
        allowTrailingZeros: false,
        ignoreOrder: false,
      };

      if (allowTrailingZeros) {
        opts.literal.allowTrailingZeros = true;
      }

      if (ignoreOrder) {
        opts.literal.ignoreOrder = true;
      }
    }
  };

  const showAndHideLiteralOptions = (mode) => {
    const literalOptions = document.querySelector("#literal-options");

    if (mode.value == "literal") {
      literalOptions.classList.remove("d-none");
    } else {
      literalOptions.classList.add("d-none");
    }
  };

  const formSubmit = (
    submit,
    expression1,
    expression2,
    opts,
    validationType
  ) => {
    const response = document.getElementById("response") as HTMLInputElement;
    const equalityResult = document.getElementById(
      "equality-result"
    ) as HTMLInputElement;

    let message: string;
    let sign: string = "?";
    let result: boolean;

    if (submit === false) {
      message = "Please complete all fields ";
      sign = "!";
      equalityResult.classList.remove(
        "text-danger",
        "text-success",
        "alert-dark"
      );

      equalityResult.classList.add("text-warning");

      response.classList.remove("alert-success", "alert-danger");
      response.classList.add("alert-warning");
    } else {
      try {
        result = latexEqual(expression1, expression2, opts);
      } catch (e) {
        message = "something went wrong when parsing expressions";
        response.classList.remove(
          "alert-warning",
          "alert-success",
          "alert-danger"
        );
        response.classList.add("alert-dark");
      }

      if (result) {
        message = `The entered expressions validate each other in ${validationType} mode`;
        sign = "=";

        equalityResult.classList.remove(
          "text-warning",
          "text-danger",
          "alert-dark"
        );
        equalityResult.classList.add("text-success");

        response.classList.remove(
          "alert-warning",
          "alert-danger",
          "alert-dark"
        );
        response.classList.add("alert-success");
      } else if (!message) {
        message = `The entered expressions does not validate each other in ${validationType} mode`;
        sign = "≠";
        equalityResult.classList.remove("text-success", "text-warning");
        equalityResult.classList.add("text-danger");

        response.classList.remove(
          "alert-warning",
          "alert-success",
          "alert-dark"
        );
        response.classList.add("alert-danger");
      }
    }

    equalityResult.innerHTML = sign;
    response.innerHTML = message;
  };

  window.addEventListener("DOMContentLoaded", (event) => {
    const form = <HTMLFormElement>document.getElementById("equality-form")!;

    const response = document.getElementById("response") as HTMLInputElement;
    response.innerHTML = "";

    let submit: boolean = false;

    const equalityResult = document.getElementById(
      "equality-result"
    ) as HTMLInputElement;

    let sign: string = "?";

    equalityResult.classList.add("text-warning");
    equalityResult.innerHTML = sign;

    mode = document.getElementById("validation-type") as HTMLInputElement;

    mode.value = urlParams.get("validation-type")
      ? decodeURIComponent(urlParams.get("validation-type"))
      : "";

    if (mode.value) {
      showAndHideLiteralOptions(mode);
      submit = true;
    }
    // @ts-ignore
    document.querySelector("#validation-type").onchange = (event) => {
      showAndHideLiteralOptions(event.target);
    };

    allowTrailingZeros = document.getElementById(
      "trailing-zeros"
    ) as HTMLInputElement;

    // @ts-ignore
    allowTrailingZeros.checked = urlParams.get("trailing-zeros")
      ? decodeURIComponent(urlParams.get("trailing-zeros"))
      : false;

    ignoreOrder = document.getElementById("ignore-order") as HTMLInputElement;

    // @ts-ignore
    ignoreOrder.checked = urlParams.get("ignore-order")
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

    if (exppression1.value === "" || exppression2.value === "") {
      submit = false;
    } else {
      getOptions(mode.value, allowTrailingZeros, ignoreOrder);
    }

    if (submit) {
      formSubmit(
        submit,
        exppression1.value,
        exppression2.value,
        opts,
        mode.value
      );
    }

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      let submitButton: boolean = false;

      const validationType = (
        document.getElementById("validation-type") as HTMLInputElement
      ).value;

      const trailingZeros: boolean = (
        document.getElementById("trailing-zeros") as HTMLInputElement
      ).checked;

      const ignoreOrder: boolean = (
        document.getElementById("ignore-order") as HTMLInputElement
      ).checked;

      if (validationType) {
        getOptions(validationType, trailingZeros, ignoreOrder);
        flags += "validation-type=" + encodeURIComponent(validationType);
        submitButton = true;

        if (trailingZeros) {
          flags +=
            "&trailing-zeros=" + encodeURIComponent(trailingZeros.toString());
        }

        if (ignoreOrder) {
          flags +=
            "&ignore-order=" + encodeURIComponent(ignoreOrder.toString());
        }
      }

      const firstExpression: string = (
        document.getElementById("math-expression1") as HTMLInputElement
      ).value;

      const secondExpression: string = (
        document.getElementById("math-expression2") as HTMLInputElement
      ).value;

      if (!firstExpression || !secondExpression) {
        submitButton = false;
      } else {
        flags +=
          "&math-expression1=" +
          encodeURIComponent(firstExpression) +
          "&math-expression2=" +
          encodeURIComponent(secondExpression);
      }

      formSubmit(
        submitButton,
        firstExpression,
        secondExpression,
        opts,
        validationType
      );

      window.history.replaceState(null, null, flags);

      // reset flags
      flags = "?";
    });
  });
};
