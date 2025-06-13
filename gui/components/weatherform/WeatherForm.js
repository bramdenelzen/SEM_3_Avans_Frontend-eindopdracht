import Weather from "../../../services/Weather.js";
import WebComponent from "../../Webcomponent.js";

export default class WeatherForm extends WebComponent {
  constructor() {
    super();
  }

  formSubmitHandlerBind = this.#formSubmitHandler.bind(this);

  connectedCallback() {
    this.shadowRoot
      .getElementById("weather-form")
      .addEventListener("submit", this.formSubmitHandlerBind);
  }
  disconnectedCallback() {
    this.shadowRoot
      .getElementById("weather-form")
      .removeEventListener("submit", this.formSubmitHandlerBind);
  }

  async #formSubmitHandler(e) {
    e.preventDefault();
    const formData = new FormData(e.target);

    const submitButton = this.shadowRoot.getElementById("submit-button");
    submitButton.disabled = true;
    submitButton.classList.add("loading");

    try {
      await Weather.updateCurrentWeather(formData.get("city"));
    } catch (error) {
      this.shadowRoot.getElementById(
        "error"
      ).innerText = `** ${error.message} **`;
      return;
    } finally {
      submitButton.disabled = false;
      submitButton.classList.remove("loading");
    }

    this.shadowRoot.getElementById("weather-form").reset();
    this.hidePopover();
  }
}
