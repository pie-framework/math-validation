import { latexEqual } from "./index";

window.addEventListener("DOMContentLoaded", (event) => {
  console.log("DOM fully loaded and parsed");
  console.log(document.getElementById("equalityform"));

  const form = <HTMLFormElement>document.getElementById("equalityform")!;
  console.log(form);

  const me1 = document.getElementById("me1") as HTMLInputElement;
  me1.value = "123";

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const formData = new FormData(form);

    const text = formData.get("me1") as string;

    console.log(formData, "formdata");
    console.log(text, "text");
    const validationType = (<HTMLInputElement>(
      document.getElementById("validation-type")
    )).select();

    let firstExpression: string = (
      document.getElementById("me1") as HTMLInputElement
    ).value;

    let secondExpression: string = (
      document.getElementById("me1") as HTMLInputElement
    ).value;

    console.log("input value", validationType);

    latexEqual(firstExpression, secondExpression, {});
  });
});
