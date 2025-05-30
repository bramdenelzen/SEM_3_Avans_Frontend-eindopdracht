import WebComponent from "../../Webcomponent.js";
import MixerModel from "../../../database/models/Mixer.js";
import { Notification } from "../../../services/Notifications.js";
import Jar from "../../../database/models/Jar.js";
import ResultColor from "../../../database/models/ResultColor.js";

export default class Mixer extends WebComponent {
  #mixer;

  #isMixing = false;

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

      if (this.#isMixing) {
        new Notification("Mixer is already mixing", "error");
        return;
      }

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

      await this._mix(dropEventJSON);
    } catch (error) {
      new Notification(error.message, "error");
    }
  }

  async _mix(dropEventJSON) {
    try {
      window.dispatchEvent(
        new CustomEvent("mixing-started", {
          detail: { jarId: dropEventJSON.jar.id },
        })
      );
      this.#isMixing = true;

      let totalR = 0,
        totalG = 0,
        totalB = 0;

      dropEventJSON.jar.ingredients
        .map((i) => i.colorHexcode)
        .forEach((hex) => {
          // Remove "#" if present
          hex = hex.replace(/^#/, "");

          // Parse R, G, B
          const r = parseInt(hex.substring(0, 2), 16);
          const g = parseInt(hex.substring(2, 4), 16);
          const b = parseInt(hex.substring(4, 6), 16);

          totalR += r;
          totalG += g;
          totalB += b;
        });

      const count = dropEventJSON.jar.ingredients.length;
      const avgR = Math.round(totalR / count);
      const avgG = Math.round(totalG / count);
      const avgB = Math.round(totalB / count);

      // Convert back to hex with padding
      const toHex = (val) => val.toString(16).padStart(2, "0");

      await new Promise((resolve, reject) =>
        setTimeout(async () => {
          const endResult = `#${toHex(avgR)}${toHex(avgG)}${toHex(avgB)}`;

          const resultDbRecord = new ResultColor({ colorHexcode: endResult });
          await resultDbRecord.save();

          if (!resultDbRecord.id) {
            reject("Failed to save result color to database");
          }
          resolve();
        }, dropEventJSON.jar.mixingTime * 100)
      );

      this.#isMixing = false;
      window.dispatchEvent(
        new CustomEvent("mixing-success", {
          detail: { jarId: dropEventJSON.jar.id },
        })
      );
      new Notification("Mixer finished mixing", "success");
    } catch (error) {
      window.dispatchEvent(
        new CustomEvent("mixing-failed", {
          detail: { jarId: dropEventJSON.jar.id },
        })
      );
      throw new Error(`Something went wrong while mixing: ${error.message}`);
    }
  }
}
