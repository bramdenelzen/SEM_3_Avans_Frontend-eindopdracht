import WebComponent from "../../Webcomponent.js";
import Router from "../../../services/Router.js";
import MixingRoomModel from "../../../database/models/MixingRoom.js";
import MixerSection from "../../components/mixersection/MixerSection.js";
import Page from "../Page.js";
import Error from "../error/Error.js";

export default class MixingRoom extends Page {

  constructor() {
    super();
    this._initializemixingRoom()
  }

  async _initializemixingRoom() {
    const { mixingroomId } = new Router().getParams();
    const mixingRoomRecord = await MixingRoomModel.findById(parseInt(mixingroomId));

    if (mixingRoomRecord.id != mixingroomId) {
      this.shadowRoot.innerHTML = "<x-error status='404' message='Not found'></x-error>";
      return;
    }
  }
}
