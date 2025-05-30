import Mixer from "../../../database/models/Mixer.js";
import Router from "../../../services/Router.js";
import WebComponent from "../../Webcomponent.js";
import { Notification } from "../../../services/Notifications.js";

export default class MixerSection extends WebComponent {
  constructor() {
    super(MixerSection.html, MixerSection.css);
    this.form = this.shadowRoot.getElementById("mixer-form");
    this.formbutton = this.shadowRoot.getElementById("add-mixer-button");
    this.mixerListElement = this.shadowRoot.getElementById("mixer-list");
  }

  connectedCallback() {
    // this.seedList();
    this._initializemixerList();

    this.form.addEventListener("submitSucces", (event) => {
      const mixer = event.detail.data;
      console.log("mixer", mixer);
      this._addMixer(mixer);

      this.form.hidePopover();
      console.log(this.form);
    });
  }

  async _initializemixerList() {
    const { mixingroomId } = new Router().getParams();
    const mixers = await Mixer.find({ mixingroomId: Number(mixingroomId) });

    this.mixerListElement.innerHTML = "";

    for (const mixer of mixers) {
      this._addMixer(mixer);
    }

    console.log("mixers", mixers);
  }

  _addMixer(mixer) {
    if (!(mixer instanceof Mixer)) {
      throw new Error("Mixer must be an instance of Mixer model");
    }

    const mixerELement = document.createElement("x-mixer");
    mixerELement.mixer = mixer;
    this.mixerListElement.appendChild(mixerELement);

    if (this.mixerListElement.children.length >= 5 && this.formbutton.hasAttribute("popovertarget")) {
      this.formbutton.removeAttribute("popovertarget");
      this.formbutton.addEventListener("click", (event) => {
        new Notification("You can only have 5 mixers per mixing room", "error");
      });
    } else if (this.mixerListElement.children.length < 5) {
      this.formbutton.removeEventListener("click", (event) => {
        new Notification("You can only have 5 mixers per mixing room", "error");
      });
      this.formbutton.setAttribute("popovertarget", "mixer-form");
    }
  }
}
