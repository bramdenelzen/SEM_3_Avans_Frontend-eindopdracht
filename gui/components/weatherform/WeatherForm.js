import Weather from "../../../services/Weather.js";
import WebComponent from "../../Webcomponent.js";

export default class WeatherForm extends WebComponent {
  constructor() {
    super();
  }

  formSubmitHandlerBind = this._formSubmitHandler.bind(this);

  connectedCallback() {
    this.shadowRoot.getElementById("weather-form").addEventListener(
      "submit",
      this.formSubmitHandlerBind
    );
  }
  disconnectedCallback() {
    this.shadowRoot.getElementById("weather-form").removeEventListener(
      "submit",
      this.formSubmitHandlerBind
    );
  }

  async  _formSubmitHandler (e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const submitButton = this.shadowRoot.getElementById("submit-button");
        submitButton.disabled = true;
        try {
          await Weather.updateCurrentWeather(formData.get("city"));
        } catch (error) {
          this.shadowRoot.getElementById(
            "error"
          ).innerText = `** ${error.message} **`;
          return;
        }
        submitButton.disabled = false;
        this.shadowRoot.getElementById("weather-form").reset();
        this.hidePopover();
      }
}
