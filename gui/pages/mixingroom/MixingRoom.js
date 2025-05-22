import WebComponent from "../../Webcomponent.js";

export default class MixingRoom extends WebComponent {
  constructor() {
    super(MixingRoom.html, MixingRoom.css);
  }

  connectedCallback() {
    this.id = this.getAttribute("id");

    this.nameElement = this.shadowRoot.getElementById("name");

    this.nameElement.innerText = "Mixingroom: " + this.id;
  }
}
