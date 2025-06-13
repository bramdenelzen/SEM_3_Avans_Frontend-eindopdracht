import Ingredient from "../../../database/models/Ingredient.js";
import JarHasIngredient from "../../../database/models/JarHasIngredient.js";
import WebComponent from "../../Webcomponent.js";
import { Notification } from "../../../services/Notifications.js";
import JarModel from "../../../database/models/Jar.js";
import Mixer from "../../../database/models/Mixer.js";
import Weather from "../../../services/Weather.js";

export default class Jar extends WebComponent {
  #ingredients = [];

  #jar = null;
  #currentmixerId = null;

  #mixingSpeed = null;
  #minMixingTime = null;

  constructor() {
    super();

    Weather.weatherEffects.subscribe(this.#updateSpecs.bind(this));

    this.addEventListener("dragstart", this.#dragstartHandler.bind(this));
    this.addEventListener("drop", this.#dropHandler.bind(this));
    this.addEventListener("dragover", this.#dragoverHandler.bind(this));
  }

  connectedCallback() {
    this.draggable = true;
  }

  disconnectedCallback() {
    this.removeEventListener("dragstart", this.#dragstartHandler.bind(this));
    this.removeEventListener("drop", this.#dropHandler.bind(this));
    this.removeEventListener("dragover", this.#dragoverHandler.bind(this));
  }

  /**s
   * @param {JarModel} jar
   */
  set jar(jar) {
    if (!(jar instanceof JarModel)) {
      throw new Error("Jar must be of type Jar");
    }

    this.#jar = jar;

    this.#jar.subscribeToInstance(
      function (data, type) {
        if (type === "delete") {
          this.remove();
        }
        if (type === "update") {
          this.#jar = data;
        }
      }.bind(this)
    );

    Mixer.subscribeToModel(
      function (data, type) {
        if (this.#jar.id === data.jarId) {
          this.shadowRoot.getElementById("jar").classList.add("mixing");
          this.#currentmixerId = data.id;
        } else if (this.#currentmixerId == data.id && data.jarId === null) {
          this.shadowRoot.getElementById("jar").classList.remove("mixing");
          this.#currentmixerId = null;
        }
      }.bind(this)
    );

    this.#updateIngredients();
  }

  async #updateIngredients() {
    const ingredientPivotRecords = await JarHasIngredient.find({
      jarId: this.#jar.id,
    });

    this.#ingredients = [];

    for (const jarIngredientPivot of ingredientPivotRecords) {
      const ingredient = await Ingredient.findById(
        jarIngredientPivot.ingredientId
      );
      if (ingredient) {
        this.#addIngredient(ingredient);
      } else {
        console.error(
          `Ingredient with ID ${jarIngredientPivot.ingredientId} not found`
        );
      }
    }
  }

  #addIngredient(ingredient) {
    if (!(ingredient instanceof Ingredient)) {
      throw new Error("Ingredient must be of type Ingredient");
    }
    if (this.#ingredients.length >= 3) {
      throw new Error("Jar is full, cannot add more ingredients");
    }

    if (this.#mixingSpeed === null) {
      this.#mixingSpeed = ingredient.minMixingSpeed;
    }

    this.#ingredients.push(ingredient);

    this.#minMixingTime = this.#ingredients.reduce(
      (minTime, ingredient) =>
        minTime > ingredient.minMixingTime ? minTime : ingredient.minMixingTime,
      0
    );

    this.#updateUi();
  }

  #updateUi() {
    this.#updateSpecs();
    this.#updateLayers();
  }

  #updateSpecs() {
    const mixingSpeed = this.shadowRoot.getElementById("mixing-speed");
    const minMixingTime = this.shadowRoot.getElementById("min-mixing-time");

    if (this.#ingredients.length === 0) {
      return;
    }

    mixingSpeed.innerText = this.#mixingSpeed
      ? `Mixing Speed: ${this.#mixingSpeed} RPM`
      : "";

    let multiplierText = "";
    Weather.weatherEffects.state.mixingTimeMultiplier > 1
      ? (multiplierText = ` (x${Weather.weatherEffects.state.mixingTimeMultiplier})`)
      : "";

    minMixingTime.innerText = `Min mixing Time: ${
      this.#minMixingTime
    } sec ${multiplierText}`;
  }

  #updateLayers() {
    const layers = [];

    layers.push(this.shadowRoot.getElementById("layer-3"));
    layers.push(this.shadowRoot.getElementById("layer-2"));
    layers.push(this.shadowRoot.getElementById("layer-1"));

    layers.forEach((layer, index) => {
      layer.setAttribute(
        "fill",
        this.#ingredients[index]?.colorHexcode || "#ffffff"
      );
    });
  }

  async #dragstartHandler(event) {
    event.dataTransfer.setData(
      "text/plain",
      JSON.stringify({
        jar: {
          id: this.#jar.id,
          ingredients: this.#ingredients.map((ing) => {
            return {
              id: ing.id,
              name: ing.name,
              colorHexcode: ing.colorHexcode,
              minMixingSpeed: ing.minMixingSpeed,
              minMixingTime: ing.minMixingTime,
            };
          }),
          mixingSpeed: this.#mixingSpeed,
          mixingTime: this.#minMixingTime,
        },
      })
    );
  }

  async #dropHandler(event) {
    event.preventDefault();

    try {
      const dropEventJSON = JSON.parse(
        event.dataTransfer.getData("text/plain")
      );

      if (!dropEventJSON) {
        throw new Error("Invalid drop event data");
      } else if (!dropEventJSON.ingredientId) {
        throw new Error("Can only drop ingredients on a jar");
      }

      const ingredientId = dropEventJSON.ingredientId;
      const ingredient = await Ingredient.findById(ingredientId);

      if (!ingredient) {
        throw new Error(`Ingredient with ID ${ingredientId} not found`);
      } else if (this.#ingredients.length >= 3) {
        throw new Error("Jar is full, cannot add more ingredients");
      } else if (
        this.#mixingSpeed !== null &&
        ingredient.minMixingSpeed != this.#mixingSpeed
      ) {
        throw new Error(
          "Mixing speeds differ, jars mixing speed is: " + this.#mixingSpeed
        );
      }

      const jarIngredient = new JarHasIngredient({
        jarId: this.#jar.id,
        ingredientId: ingredient.id,
      });
      await jarIngredient.save();

      this.#addIngredient(ingredient);
    } catch (error) {
      new Notification(error.message, "error");
    }
  }

  #dragoverHandler(event) {
    event.preventDefault();
  }
}
