import WebComponent from "../../Webcomponent.js";
import MixerModel from "../../../database/models/Mixer.js";
import { Notification } from "../../../services/Notifications.js";
import Jar from "../../../database/models/Jar.js";
import ResultColor from "../../../database/models/ResultColor.js";
import Weather from "../../../services/Weather.js";

export default class Mixer extends WebComponent {
  #mixer;

  constructor() {
    super();
    this.addEventListener("dragover", this.#dragoverHandler.bind(this));
    this.addEventListener("drop", this.#drophandler.bind(this));
  }

  connectedCallback() {}

  disconnectedCallback() {
    this.removeEventListener("dragover", this.#dragoverHandler.bind(this));
    this.removeEventListener("drop", this.#drophandler.bind(this));
  }

  /**
   * @param {MixerModel} mixer
   */
  set mixer(mixer) {
    if (!(mixer instanceof MixerModel)) {
      throw new Error("Mixer must be an instance of Mixer model");
    }
    this.#mixer = mixer;
    this.#updateGui();
  }

  #updateGui() {
    this.shadowRoot.getElementById("mixingSpeed").textContent =
      this.#mixer.mixingSpeed + " RPM";
  }

  #drophandler = async function (event) {
    event.preventDefault();

    if (Weather.weatherEffects.state.maxMixingMachines) {
      if (
        (await this.#getTotalWorkingMixers()) >=
        Weather.weatherEffects.state.maxMixingMachines
      ) {
        new Notification(
          `You can only have ${Weather.weatherEffects.state.maxMixingMachines} mixers working at the same time due to the current weather conditions.`,
          "error"
        );
        return;
      }
    }
    if (this.#mixer.jarId) {
      new Notification("Mixer is already mixing", "error");
      return;
    }

    try {
      const dropEventJSON = JSON.parse(
        event.dataTransfer.getData("text/plain")
      );

      if (!dropEventJSON) {
        throw new Error("Something went wrong with the drop event");
      }
      if (!dropEventJSON.jar) {
        throw new Error("You can only drop jars on a mixer");
      }

      const jar = dropEventJSON.jar;

      if (jar.mixingSpeed !== this.#mixer.mixingSpeed) {
        throw new Error(
          `You can only drop jars with a mixing speed of ${
            this.#mixer.mixingSpeed
          } RPM`
        );
      }
      if (jar.ingredients.length === 0) {
        throw new Error("Jar is empty, please add ingredients before mixing");
      }

      await this.#mix(jar);
    } catch (error) {
      new Notification(error.message, "error");
    }
  };

  async #getTotalWorkingMixers() {
    const allMixers = await MixerModel.find({
      mixingroomId: this.#mixer.mixingroomId,
    });

    const totalWorkingMixers = allMixers.filter(
      (mixer) => mixer.jarId != null && mixer.jarId != undefined
    ).length;

    return totalWorkingMixers;
  }

  async #mix(jar) {
    new Notification("Mixer started mixing", "info");

    const progressBarFill = this.shadowRoot.getElementById("progress-bar-fill");

    try {
      const duration =
        jar.mixingTime * Weather.weatherEffects.state.mixingTimeMultiplier;

      this.style.animation = `mixing-speed ${
        (1 / jar.mixingSpeed) * 100
      }s linear infinite`;

      this.#mixer.jarId = parseInt(jar.id);
      await this.#mixer.save();

      const averageColor = this.#getAverageColorHex(
        jar.ingredients.map((ingredient) => ingredient.colorHexcode)
      );

      await new Promise((resolve) => {
        const start = Date.now();

        const interval = setInterval(async () => {
          const elapsed = Date.now() - start;

          let progress = Math.min(elapsed / (duration * 1000), 1);
          progressBarFill.style.width = progress * 100 + "%";

          if (progress >= 1) {
            const resultDbRecord = new ResultColor({
              colorHexcode: averageColor,
            });
            await resultDbRecord.save();

            if (!resultDbRecord.id) {
              throw new Error("Failed to save result color to database");
            }

            try {
              const jarRecord = await Jar.findById(jar.id);
              await jarRecord.delete();
            } catch (error) {
              await resultDbRecord.delete();
              throw new Error(
                `Failed to delete jar from database: ${error.message}`
              );
            }
            this.#mixer.jarId = null;
            await this.#mixer.save();
            progressBarFill.style.width = "0%";
            new Notification("Mixer finished mixing", "success");
            clearInterval(interval);
            resolve();
          }
        }, 50);
      });
    } catch (error) {
      this.#mixer.jarId = null;
      await this.#mixer.save();

      throw new Error(`Something went wrong while mixing: ${error.message}`);
    } finally {
      progressBarFill.style.animation = "none";
      this.style.animation = "none";
    }
  }

  #getAverageColorHex(colors) {
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

  #dragoverHandler = function (event) {
    event.preventDefault();
  };
}
