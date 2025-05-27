import WebComponent from "../../Webcomponent.js";

export default class Toast extends WebComponent {
  #type;

  constructor() {
    super(Toast.html, Toast.css);
  }

  connectedCallback() {
    this.shadowRoot.getElementById("message").innerText = this.message;
    this.shadowRoot.querySelector("div").classList.add(`${this.#type}`);
  }

  /**
   * @param {"info" | "success" | "warning" | "error"} type
   */
  set type(type) {

    if (!["info", "success", "warning", "error", undefined].includes(type)) {
      throw new Error("Invalid toast type", type);
    }
    this.#type = type;
  }
}
