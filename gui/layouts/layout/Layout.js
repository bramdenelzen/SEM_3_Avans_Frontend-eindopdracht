import MixingRoom from "../../../database/models/MixingRoom.js";
import WebComponent from "../../Webcomponent.js";

export default class Layout extends WebComponent {
  constructor() {
    super(Layout.html, Layout.css);
  }

  async connectedCallback() {
    const mixingRooms = await MixingRoom.find({});

    const nav = this.shadowRoot.querySelector("nav");

    for (const mixingRoom of mixingRooms) {
      const mixingRoomLink = document.createElement("a");
      mixingRoomLink.href = `#/mixingroom/${mixingRoom.id}`;
      mixingRoomLink.innerText = mixingRoom.displayName;
      nav.appendChild(mixingRoomLink);
    }
  }
}
