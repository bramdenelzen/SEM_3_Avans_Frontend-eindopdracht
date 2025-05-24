import WebComponent from "../../Webcomponent.js";
import Ingredient from "../../../database/models/Ingredient.js";

export default class IngredientsForm extends WebComponent {
  constructor() {
    super(IngredientsForm.html, IngredientsForm.css);

    this.formElement = this.shadowRoot.querySelector("form");
    this.errorElement = this.shadowRoot.getElementById("error");
  }

  connectedCallback() {
    this.formElement.addEventListener("submit", this.submitHandler.bind(this));

    console.log(this.formElement);
  }

  /**
   *
   * @param {SubmitEvent} event
   */
  async submitHandler(event) {
    event.preventDefault();
    this.errorElement.innerText = "";
    const formData = new FormData(this.formElement);

    try {
      const ingredient = new Ingredient({
        minMixingTime: Number(formData.get("minMixingTime")),
        minMixingSpeed: Number(formData.get("minMixingSpeed")),
        colorHexcode: formData.get("color"),
        texture: formData.get("texture"),
      });

      await ingredient.save();
      this.dispatchEvent(
        new CustomEvent("submitSucces", { detail: { data: ingredient } })
      );
      this.formElement.reset();
    } catch (error) {
      console.log(Number(undefined));
      console.log(error.message);
      this.errorElement.innerText = `** ${error.message} **`;
    }

    console.log(formData);
  }
}
