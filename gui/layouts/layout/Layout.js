import MixingRoom from "../../../database/models/MixingRoom.js";
import Router from "../../../services/Router.js";
import Weather from "../../../services/Weather.js";
import WebComponent from "../../Webcomponent.js";

export default class Layout extends WebComponent {
  constructor() {
    super();
    this._initializeLayout();
  }

  async _initializeLayout() {
    const location = Weather.location;
    if (location) {
      const locationElement = this.shadowRoot.getElementById("location");
      locationElement.innerText = `${location.city}, ${location.country}`;
    }

    const weather = Weather.currentWeather;

    if (weather) {

      console.log("weather", weather);
      const weatherElement = this.shadowRoot.getElementById("weather");
      weatherElement.innerText = `${weather.temp_c}°C, ${weather.condition.text}`

      const icon = document.createElement("img");
      icon.src = weather.condition.icon;
      weatherElement.appendChild(
        icon
      );
    }


    const mixingRooms = await MixingRoom.find({});

    const nav = this.shadowRoot.querySelector("nav");

    const currentPath = new Router().getCurrentPath();
    if (currentPath === "/") {
      this.shadowRoot.getElementById("home-link").classList.add("active");
    } else if (currentPath === "/colortesting") {
      this.shadowRoot
        .getElementById("colortesting-link")
        .classList.add("active");
    }

    for (const mixingRoom of mixingRooms) {
      if (this.shadowRoot.getElementById(mixingRoom.id)) {
        continue;
      }
      const mixingRoomLink = document.createElement("a");
      mixingRoomLink.href = `#/mixingroom/${mixingRoom.id}`;
      mixingRoomLink.innerText = mixingRoom.displayName;
      mixingRoomLink.id = mixingRoom.id;

      if ("/mixingroom/" + mixingRoom.id === currentPath) {
        mixingRoomLink.classList.add("active");
      }
      nav.appendChild(mixingRoomLink);
    }
  }
}
