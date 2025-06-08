import WebComponent from "../../Webcomponent.js";
import MixerModel from "../../../database/models/Mixer.js";
import { Notification } from "../../../services/Notifications.js";
import Jar from "../../../database/models/Jar.js";
import ResultColor from "../../../database/models/ResultColor.js";
import Weather from "../../../services/Weather.js";

export default class Mixer extends WebComponent {
  #mixer;

  #dragoverHandler;
  #dropHandler;

  constructor() {
    super();

    this.#dragoverHandler = (event) => {
      event.preventDefault();
    };
    this.#dropHandler = this._drophandler.bind(this);
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
    this.shadowRoot.addEventListener("dragover", this.#dragoverHandler);
    this.shadowRoot.addEventListener("drop", this.#dropHandler);
    this.shadowRoot.querySelector("#mixingSpeed").textContent =
      this.#mixer.mixingSpeed + " RPM";

    if (!this.#mixer) {
      throw new Error("Mixer not set");
    }
  }

  disconnectedCallback() {
    this.shadowRoot.removeEventListener("dragover", this.#dragoverHandler);
    this.shadowRoot.removeEventListener("drop", this.#dropHandler);
  }

  async _drophandler(event) {
    event.preventDefault();

    if (Weather.weatherEffects.state.maxMixingMachines) {
      const allMixers = await MixerModel.find({
        mixingroomId: this.#mixer.mixingroomId,
      });

      const totalWorkingMixers = allMixers.filter(
        (mixer) => mixer.jarId != null && mixer.jarId != undefined
      ).length;

      if (
        totalWorkingMixers >= Weather.weatherEffects.state.maxMixingMachines
      ) {
        console.log(
          Weather.weatherEffects.state.maxMixingMachines,
          totalWorkingMixers,
          allMixers
        );
        new Notification(
          `You can only have ${Weather.weatherEffects.state.maxMixingMachines} mixers working at the same time due to the current weather conditions.`,
          "error"
        );
        return;
      }
    }

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
      }

      if (!dropEventJSON.jar) {
        throw new Error("You can only drop jars on a mixer");
      }
      if (dropEventJSON.jar.mixingSpeed !== this.#mixer.mixingSpeed) {
        throw new Error(
          `You can only drop jars with a mixing speed of ${
            this.#mixer.mixingSpeed
          } RPM`
        );
      }
      if (dropEventJSON.jar.ingredients.length === 0) {
        throw new Error("Jar is empty, please add ingredients before mixing");
      }

      await this._mix(dropEventJSON.jar);
    } catch (error) {
      new Notification(error.message, "error");
    }
  }

  async _mix(jar) {
    new Notification("Mixer started mixing", "info");
    try {
      this.#mixer.jarId = parseInt(jar.id);
      await this.#mixer.save();

      const averageColor = this._getAverageColorHex(
        jar.ingredients.map((ingredient) => ingredient.colorHexcode)
      );

      const duration = jar.mixingTime * 1000 * Weather.weatherEffects.state.mixingTimeMultiplier;
      const progressBarFill =
        this.shadowRoot.getElementById("progress-bar-fill");
      let start = Date.now();

      console.log(duration)

      this.style.animation = `mixing-speed ${
        duration / 1000
      }s linear infinite`;

      await new Promise((resolve) => {
        const interval = setInterval(() => {
          const elapsed = Date.now() - start;
          let progress = Math.min(elapsed / duration, 1);
          progressBarFill.style.width = progress * 100 + "%";

          if (progress >= 1) {
            clearInterval(interval);
            progressBarFill.style.width = "0%";
            resolve();
          }
        }, 50);
      });

      const resultDbRecord = new ResultColor({ colorHexcode: averageColor });
      this.style.animation = "none";

      await resultDbRecord.save();
      if (!resultDbRecord.id) {
        throw new Error("Failed to save result color to database");
      }

      const jarRecord = await Jar.findById(jar.id);
      jarRecord.delete();

      progressBarFill.style.animation = "none";
      this.style.animation = "none";

      new Notification("Mixer finished mixing", "success");
      this.#mixer.jarId = null;
      await this.#mixer.save();
    } catch (error) {
      this.#mixer.jarId = null;
      await this.#mixer.save();

      throw new Error(`Something went wrong while mixing: ${error.message}`);
    }
  }

  _getAverageColorHex(colors) {
    let totalR = 0,
      totalG = 0,
      totalB = 0;

    colors.forEach((hex) => {
      hex = hex.replace(/^#/, "");

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

    return `#${avgR.toString(16).padStart(2, "0")}${avgG
      .toString(16)
      .padStart(2, "0")}${avgB.toString(16).padStart(2, "0")}`;
  }
}
