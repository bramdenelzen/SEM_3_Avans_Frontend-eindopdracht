import WebComponent from "../../Webcomponent.js";
import Ingredient from "../../../database/models/Ingredient.js";
import { Notification } from "../../../services/Notifications.js";

export default class MixerForm extends WebComponent {
  constructor() {
    super(MixerForm.html, MixerForm.css);

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
    console.log("submitHandler called");
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
      new Notification("Mixer created successfully", "success");
    } catch (error) {
      this.errorElement.innerText = `** ${error.message} **`;
    }
  }
}
