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

      if (this.#mixer.jarId) {
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
      this.#mixer.jarId = parseInt(dropEventJSON.jar.id);
      await this.#mixer.save();

      new Notification("Mixer started mixing", "info");

      const averageColor = this.getAverageColorHex(
        dropEventJSON.jar.ingredients.map(
          (ingredient) => ingredient.colorHexcode
        )
      );

      await new Promise(async (resolve, reject) => {
        setTimeout(async () => {
          resolve();
        }, dropEventJSON.jar.mixingTime * 100);
      });

      const resultDbRecord = new ResultColor({ colorHexcode: averageColor });
      await resultDbRecord.save();
      if (!resultDbRecord.id) {
        throw new Error("Failed to save result color to database");
      }

      const jar = await Jar.findById(dropEventJSON.jar.id);
      jar.delete();

      this.#isMixing = false;

      new Notification("Mixer finished mixing", "success");
      this.#mixer.jarId = null;
      await this.#mixer.save();
    } catch (error) {
      this.#mixer.jarId = null;
      await this.#mixer.save();

      throw new Error(`Something went wrong while mixing: ${error.message}`);
    }
  }

  getAverageColorHex(colors) {
    let totalR = 0,
      totalG = 0,
      totalB = 0;

    colors.forEach((hex) => {
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

    const count = colors.length;
    const avgR = Math.round(totalR / count);
    const avgG = Math.round(totalG / count);
    const avgB = Math.round(totalB / count);

    // Convert back to hex with padding
    return `#${avgR.toString(16).padStart(2, "0")}${avgG
      .toString(16)
      .padStart(2, "0")}${avgB.toString(16).padStart(2, "0")}`;
  }
}
