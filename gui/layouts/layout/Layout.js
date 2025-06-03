import MixingRoom from "../../../database/models/MixingRoom.js";
import Router from "../../../services/Router.js";
import WebComponent from "../../Webcomponent.js";

export default class Layout extends WebComponent {
  constructor() {
    super(Layout.html, Layout.css);
  }

  async connectedCallback() {
    const mixingRooms = await MixingRoom.find({});

    const nav = this.shadowRoot.querySelector("nav");

    const currentPath = new Router().getCurrentPath();
    console.log(currentPath);
    if (currentPath === "/"){
      this.shadowRoot.getElementById("home-link").classList.add("active");
    }else if (currentPath === "/colortesting"){
      this.shadowRoot.getElementById("colortesting-link").classList.add("active");
    }

    for (const mixingRoom of mixingRooms) {
      const mixingRoomLink = document.createElement("a");
      mixingRoomLink.href = `#/mixingroom/${mixingRoom.id}`;
      mixingRoomLink.innerText = mixingRoom.displayName;

      if ("/mixingroom/" + mixingRoom.id === currentPath) {
        mixingRoomLink.classList.add("active");
      }

      nav.appendChild(mixingRoomLink);
    }
  }
}
