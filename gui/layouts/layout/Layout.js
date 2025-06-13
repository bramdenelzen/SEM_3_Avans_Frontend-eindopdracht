import MixingRoom from "../../../database/models/MixingRoom.js";
import Router from "../../../services/Router.js";
import Weather from "../../../services/Weather.js";
import WebComponent from "../../Webcomponent.js";

export default class Layout extends WebComponent {
  constructor() {
    super();
    this.#initializeLayout();
  }

  async #initializeLayout() {
    Weather.location.subscribe(this.#updateLocation.bind(this));
    Weather.currentWeather.subscribe(this.#updateWeather.bind(this));
    MixingRoom.subscribeToModel(this.#updateMixingRooms.bind(this));

    this.#updateLocation();
    this.#updateWeather();
    this.#updateMixingRooms();

    const currentPath = new Router().getCurrentPath();
    if (currentPath === "/") {
      this.shadowRoot.getElementById("home-link").classList.add("active");
    } else if (currentPath === "/colortesting") {
      this.shadowRoot
        .getElementById("colortesting-link")
        .classList.add("active");
    }
  }

  async #updateMixingRooms() {
    const mixingRooms = await MixingRoom.find({});
    const nav = this.shadowRoot.querySelector("nav");
    const currentPath = new Router().getCurrentPath();

    for (const child of nav.children) {
      if (child.id.startsWith("mixingroom-")) {
        child.remove();
      }
    }

    for (const mixingRoom of mixingRooms) {
      if (this.shadowRoot.getElementById(mixingRoom.id)) {
        continue;
      }

      if (this.shadowRoot.getElementById("mixingroom-" + mixingRoom.id)) {
        continue; // Skip if the link already exists
      }
      
      const mixingRoomLink = document.createElement("a");
      mixingRoomLink.href = `#/mixingroom/${mixingRoom.id}`;
      mixingRoomLink.innerText = mixingRoom.displayName;
      mixingRoomLink.id = "mixingroom-" + mixingRoom.id;

      if ("/mixingroom/" + mixingRoom.id === currentPath) {
        mixingRoomLink.classList.add("active");
      }
      nav.appendChild(mixingRoomLink);
    }
  }

  #updateLocation() {
    const location = Weather.location.state;
    if (location) {
      const locationElement = this.shadowRoot.getElementById("location");
      locationElement.innerText = `${location.city}, ${location.country}`;
    }
  }

  #updateWeather() {
    const weather = Weather.currentWeather.state;

    if (weather) {
      const weatherElement = this.shadowRoot.getElementById("weather");
      weatherElement.innerText = `${weather.temp_c}°C, ${weather.condition.text}`;

      const icon = document.createElement("img");
      icon.src = weather.condition.icon;
      weatherElement.appendChild(icon);
    }
  }
}
