import WebComponent from "../../Webcomponent.js";
import MixerModel from "../../../database/models/Mixer.js";

export default class Mixer extends WebComponent {
  #mixer;
  constructor() {
    super(Mixer.html, Mixer.css);
  }

  /**
   * @param {MixerModel} mixer
   */
  set mixer(mixer) {
    if (!(mixer instanceof MixerModel)) {
      throw new Error("Mixer must be an instance of Mixer model");
    }
    this.#mixer = mixer;
  }

  connectedCallback() {
    if (!this.#mixer) {
      throw new Error("Mixer not set");
    }

    this.shadowRoot.querySelector("#mixingTime").textContent = this.#mixer.mixingTime;
    this.shadowRoot.querySelector("#mixingSpeed").textContent = this.#mixer.mixingSpeed;
    this.shadowRoot.querySelector("#mixingroomId").textContent = this.#mixer.mixingroomId;

  }

}
