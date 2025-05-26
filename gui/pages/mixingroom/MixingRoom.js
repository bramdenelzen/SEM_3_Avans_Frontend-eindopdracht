import WebComponent from "../../Webcomponent.js";
import Router from "../../../services/Router.js";
import MixingRoomModel from "../../../database/models/MixingRoom.js";

export default class MixingRoom extends WebComponent {
  constructor() {
    super(MixingRoom.html, MixingRoom.css);
  }

  async connectedCallback() {
    const { mixingroomId } = new Router().getParams();

    console.log(mixingroomId);

    const mixingRoomRecord = await MixingRoomModel.findById(
      Number(mixingroomId)
    );
    console.log(mixingRoomRecord);

    if (!mixingRoomRecord) {
      this.shadowRoot.innerHTML = `<x-error status="404" message="Not found"></x-error>`;
      return;
    }

    console.log(mixingRoomRecord);

    this.nameElement = this.shadowRoot.getElementById("name");

    this.nameElement.innerText = "Mixingroom: " + mixingroomId;
  }
}
