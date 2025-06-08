import Weather from "../../../services/Weather.js";
import WebComponent from "../../Webcomponent.js";

export default class WeatherForm extends WebComponent {
  constructor() {
    super();
  }

  connectedCallback() {
    console.log("WeatherForm connected");
    this.shadowRoot.getElementById("weather-form").addEventListener(
      "submit",
      async function (e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        try {
          await Weather.updateCurrentWeather(formData.get("city"));
        } catch (error) {
          this.shadowRoot.getElementById(
            "error"
          ).innerText = `** ${error.message} **`;
          return;
        }
        this.shadowRoot.getElementById("weather-form").reset();
        this.hidePopover();
      }.bind(this)
    );
  }
}
