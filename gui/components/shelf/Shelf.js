import { notifications } from "../../../services/State.js";
import WebComponent from "../../Webcomponent.js";

export default class Shelf extends WebComponent {
  constructor() {
    super(Shelf.html, Shelf.css);
  }

  connectedCallback() {
    let itteration = 0;
    this.shadowRoot.getElementById("test").addEventListener("click", () => {

        const toastElement = document.createElement("x-toast");
        toastElement.message = `Test notification ${itteration++}`;
        toastElement.type = "error";

        notifications.push(toastElement);
    });
  }
}
