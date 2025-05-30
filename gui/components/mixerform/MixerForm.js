import WebComponent from "../../Webcomponent.js";
import Ingredient from "../../../database/models/Ingredient.js";
import { Notification } from "../../../services/Notifications.js";
import Mixer from "../../../database/models/Mixer.js";
import Router from "../../../services/Router.js";

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
    event.preventDefault();
    this.errorElement.innerText = "";

    try {
          const formData = new FormData(this.formElement);

      const { mixingroomId } = new Router().getParams();

      const mixers = await Mixer.find({ mixingroomId: Number(mixingroomId) });
      if (mixers.length >= 5) {
        throw new Error("You can only have 5 mixers per mixing room");
      }
      const mixer = new Mixer({
        mixingTime: Number(formData.get("mixingTime")),
        mixingSpeed: Number(formData.get("mixingSpeed")),
        mixingroomId: Number(mixingroomId),
      });

      await mixer.save();

      this.dispatchEvent(
        new CustomEvent("submitSucces", { detail: { data: mixer } })
      );
      this.formElement.reset();
      new Notification("Mixer created successfully", "success");
    } catch (error) {
      this.errorElement.innerText = `** ${error.message} **`;
      console.error("Error creating mixer:", error);
    }
  }
}
