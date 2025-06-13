import Router from "../../../services/Router.js";
import MixingRoomModel from "../../../database/models/MixingRoom.js";
import Page from "../Page.js";

export default class MixingRoom extends Page {

  constructor() {
    super();
    this._initializemixingRoom()
  }

  async _initializemixingRoom() {
    const { mixingroomId } = new Router().getParams();
    const mixingRoomRecord = await MixingRoomModel.findById(parseInt(mixingroomId));


    if ( !mixingRoomRecord || mixingRoomRecord.id != mixingroomId) {
      this.shadowRoot.innerHTML = "<x-error status='404' message='Not found'></x-error>";
      return;
    }
  }
}
