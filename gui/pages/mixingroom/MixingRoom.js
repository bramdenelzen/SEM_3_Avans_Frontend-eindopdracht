import WebComponent from "../../Webcomponent.js";
import Router from "../../../services/Router.js";
import MixingRoomModel from "../../../database/models/MixingRoom.js";
import MixerSection from "../../components/mixersection/MixerSection.js";

export default class MixingRoom extends WebComponent {
  constructor() {
    super(MixingRoom.html, MixingRoom.css);
    this._initializemixingRoom()
  }

  async _initializemixingRoom(){
      const { mixingroomId } = new Router().getParams();
    const mixingRoomRecord = await MixingRoomModel.findById(
      Number(mixingroomId)
    );

    if (!mixingRoomRecord) {
      this.shadowRoot.innerHTML = `<x-error status="404" message="Not found"></x-error>`;
      return;
    }

    const mixerSection = this.shadowRoot.getElementById("mixer-section");
    const cachedSection = MixerSection.getCachedInstance();
    if (cachedSection) {
      mixerSection.replaceWith(cachedSection);
    }
  }
}
