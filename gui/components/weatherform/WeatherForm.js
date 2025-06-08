import Weather from "../../../services/Weather.js";
import WebComponent from "../../Webcomponent.js";

export default class WeatherForm extends WebComponent{
    constructor() {
        super();
    }

    connectedCallback() {
        console.log("WeatherForm connected");
        this.shadowRoot.getElementById("weather-form").addEventListener("submit", (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            Weather.updateCurrentWeather(formData.get("city"))
            this.shadowRoot.getElementById("weather-form").reset();
            this.hidePopover();
        });
    }
}