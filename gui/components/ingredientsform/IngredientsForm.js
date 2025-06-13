import WebComponent from "../../Webcomponent.js";
import Ingredient from "../../../database/models/Ingredient.js";
import { Notification } from "../../../services/Notifications.js";

export default class IngredientsForm extends WebComponent {
  #submitHandler;
  #formElement;
  #errorElement;

  constructor() {
    super();

    this.#formElement = this.shadowRoot.querySelector("form");
    this.#errorElement = this.shadowRoot.getElementById("error");
    this.setAttribute("popover", "");
    this.classList.add("popover");

    this.#submitHandler = this.submitHandler.bind(this);
  }

  connectedCallback() {
    this.#formElement.addEventListener("submit", this.#submitHandler);
  }

  disconnectedCallback() {
    this.#formElement.removeEventListener("submit", this.#submitHandler);
  }

  /**
   *
   * @param {SubmitEvent} event
   */
  async submitHandler(event) {
    event.preventDefault();

    this.#errorElement.innerText = "";

    const formData = new FormData(this.#formElement);

    try {
      const ingredient = new Ingredient({
        minMixingTime: Number(formData.get("minMixingTime")),
        minMixingSpeed: Number(formData.get("minMixingSpeed")),
        colorHexcode: formData.get("color"),
        texture: formData.get("texture"),
      });

      await ingredient.save();

      this.hidePopover();

      this.dispatchEvent(
        new CustomEvent("submitSucces", { detail: { data: ingredient } })
      );

      this.#formElement.reset();

      new Notification("Ingredient created successfully", "success");
    } catch (error) {
      this.#errorElement.innerText = `** ${error.message} **`;
    }
  }
}
