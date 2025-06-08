import { Notification } from "../../../services/Notifications.js";
import WebComponent from "../../Webcomponent.js";

export default class Shelf extends WebComponent {
  constructor() {
    super();
  }

  connectedCallback() {
    let itteration = 0;
    this.shadowRoot.getElementById("test").addEventListener("click", () => {
      new Notification("Test Notification " + itteration++, "info");
    });
  }
}
