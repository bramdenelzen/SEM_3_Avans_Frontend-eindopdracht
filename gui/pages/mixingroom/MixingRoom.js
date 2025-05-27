import WebComponent from "../../Webcomponent.js";
import Router from "../../../services/Router.js";
import MixingRoomModel from "../../../database/models/MixingRoom.js";

export default class MixingRoom extends WebComponent {
  constructor() {
    super(MixingRoom.html, MixingRoom.css);
  }

  async connectedCallback() {
    const { mixingroomId } = new Router().getParams();
    const mixingRoomRecord = await MixingRoomModel.findById(
      Number(mixingroomId)
    );

    if (!mixingRoomRecord) {
      this.shadowRoot.innerHTML = `<x-error status="404" message="Not found"></x-error>`;
      return;
    }

    this.nameElement = this.shadowRoot.getElementById("name");

    this.nameElement.innerText = "Mixingroom: " + mixingroomId;
  }
}
