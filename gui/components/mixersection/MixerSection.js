import Mixer from "../../../database/models/Mixer.js";
import Router from "../../../services/Router.js";
import WebComponent from "../../Webcomponent.js";
import { Notification } from "../../../services/Notifications.js";
import Weather from "../../../services/Weather.js";

export default class MixerSection extends WebComponent {
  constructor() {
    super();
    this.form = this.shadowRoot.getElementById("mixer-form");
    this.formbutton = this.shadowRoot.getElementById("add-mixer-button");
    this.mixerListElement = this.shadowRoot.getElementById("mixer-list");
    this._initializemixerList();
    console.log("MixerSection initialized");
    Weather.weatherEffects.subscribe(this._updateWarning.bind(this));
  }
  static cacheInstances = [];

  #formSubmitHandler = function (event) {
    const mixer = event.detail.data;
    console.log("mixer", mixer);
    this._addMixer(mixer);

    this.form.hidePopover();
    console.log(this.form);
  }.bind(this);

  static getCachedInstance() {
    const { mixingroomId } = new Router().getParams();
    if (MixerSection.cacheInstances[mixingroomId]) {
      return MixerSection.cacheInstances[mixingroomId];
    }
    const section = document.createElement("x-mixersection");
    MixerSection.cacheInstances[mixingroomId] = section;
    return section;
  }

  connectedCallback() {
    this.form.addEventListener("submitSucces", this.#formSubmitHandler);
  }

  disconnectedCallback() {
    this.form.removeEventListener("submitSucces", this.#formSubmitHandler);
  }

  async _initializemixerList() {
    const { mixingroomId } = new Router().getParams();

    const mixers = await Mixer.find({ mixingroomId: Number(mixingroomId) });

    this.mixerListElement.innerHTML = "";

    for (const mixer of mixers) {
      this._addMixer(mixer);
    }
  }

  _addMixer(mixer) {
    if (!(mixer instanceof Mixer)) {
      throw new Error("Mixer must be an instance of Mixer model");
    }

    const mixerELement = document.createElement("x-mixer");
    mixerELement.mixer = mixer;
    this.mixerListElement.appendChild(mixerELement);

    if (
      this.mixerListElement.children.length >= 5 &&
      this.formbutton.hasAttribute("popovertarget")
    ) {
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
    this._updateWarning();
  }

  async _updateWarning() {
    const { mixingroomId } = new Router().getParams();
    const mixers = await Mixer.find({ mixingroomId: Number(mixingroomId) });
    const warningElement = this.shadowRoot.getElementById("warning");

    console.log(
      "Weather.maxMixingMachines",
      Weather.weatherEffects.state.maxMixingMachines
    );

    if (Weather.weatherEffects.state.maxMixingMachines >= mixers.length) {
      warningElement.style.display = "none";
      warningElement.textContent = "";
    } else {
      warningElement.style.display = "block";
      warningElement.textContent = `You can only have ${
        Weather.weatherEffects.state.maxMixingMachines
      } mixer${
        Weather.weatherEffects.state.maxMixingMachines !== 1 ? "s" : ""
      } working in this mixing room due to weather effects.`;
    }
  }
}
