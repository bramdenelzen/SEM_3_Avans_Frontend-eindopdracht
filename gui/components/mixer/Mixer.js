import WebComponent from "../../Webcomponent.js";
import MixerModel from "../../../database/models/Mixer.js";
import { Notification } from "../../../services/Notifications.js";
import Jar from "../../../database/models/Jar.js";

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

    this.shadowRoot.querySelector("#mixingSpeed").textContent =
      this.#mixer.mixingSpeed + " RPM";

    this.shadowRoot.addEventListener("dragover", (event) => {
      event.preventDefault();
    });
    this.shadowRoot.addEventListener("drop", this._drophandler.bind(this));
  }

  async _drophandler(event) {
    event.preventDefault();

    try {
      const dropEventJSON = JSON.parse(
        event.dataTransfer.getData("text/plain")
      );

      if (!dropEventJSON) {
        throw new Error("Something went wrong with the drop event");
      } else if (!dropEventJSON.jar) {
        throw new Error("You can only drop jars on a mixer");
      }
      if (dropEventJSON.jar.mixingSpeed !== this.#mixer.mixingSpeed) {
        console.log(dropEventJSON.jar, this.#mixer);
        throw new Error(
          `You can only drop jars with a mixing speed of ${
            this.#mixer.mixingSpeed
          } RPM`
        );
      }
      if (dropEventJSON.jar.ingredients.length === 0) {
        throw new Error("Jar is empty, please add ingredients before mixing");
      }

      console.log("dropEventJSON", dropEventJSON);

      const jar = await Jar.findById(dropEventJSON.jar.id);
      if (!jar) {
        throw new Error("Jar not found");
      }

      const deleted = await jar.delete();
      if (!deleted) {
        throw new Error("Failed to delete jar");
      }

      window.dispatchEvent(
        new CustomEvent("jarDeleted", {
          detail: { jarId: jar.id },
        })
      );
    } catch (error) {
      new Notification(error.message, "error");
    }
  }

  _mix() {}
}
