import { notifications } from "../../../services/State.js";
import WebComponent from "../../Webcomponent.js";

export default class Toast extends WebComponent {
  type;
  _type = "info"; // Default type

  constructor() {
    super(Toast.html, Toast.css);
  }

  connectedCallback() {
    this.shadowRoot.getElementById("message").innerText = this.message;
    this.shadowRoot
      .querySelector("div").classList.add(`${this.type}`);
  }

  set type(type) {
    if (!["info", "success", "warning", "error"].includes(type)) {
      throw new Error("Invalid toast type");
    }
    this._type = type;
  }
}
