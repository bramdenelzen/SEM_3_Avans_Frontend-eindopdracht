import Ingredient from "../../../database/models/Ingredient.js";
import JarHasIngredient from "../../../database/models/JarHasIngredient.js";
import WebComponent from "../../Webcomponent.js";
import { Notification } from "../../../services/Notifications.js";
import JarModel from "../../../database/models/Jar.js";
import Mixer from "../../../database/models/Mixer.js";

export default class Jar extends WebComponent {
  #layers = [];

  #ingredients = [];

  #jar = null;
  #currentMixer = null;

  #mixingSpeed = null;
  #minMixingTime = null;

  constructor() {
    super(Jar.html, Jar.css);

    this.#layers.push(this.shadowRoot.getElementById("layer-3"));
    this.#layers.push(this.shadowRoot.getElementById("layer-2"));
    this.#layers.push(this.shadowRoot.getElementById("layer-1"));
  }

  connectedCallback() {
    this.draggable = true;
    this.addEventListener("dragstart", this._dragstartHandler.bind(this));

    this.shadowRoot.addEventListener("drop", this._dropHandler.bind(this));
    this.shadowRoot.addEventListener(
      "dragover",
      this._dragoverHandler.bind(this)
    );

    this.updateLayers();
  }

  disconnectedCallback() {
    this.removeEventListener("dragstart", this._dragstartHandler.bind(this));
    this.shadowRoot.removeEventListener("drop", this._dropHandler.bind(this));
    this.shadowRoot.removeEventListener(
      "dragover",
      this._dragoverHandler.bind(this)
    );
  }

  /**
   * @param {JarModel} jar
   */
  set jar(jar) {
    if (!(jar instanceof JarModel)) {
      throw new Error("Jar must be of type Jar");
    }

    this.#jar = jar;
    this.__getIngredients();
    this.#jar.subscribeToInstance(this.update.bind(this));

    Mixer.subscribeToModel((data, type) => {
      if (this.#jar.id === data.jarId) {
        this.shadowRoot.getElementById("jar").classList.add("mixing");
        this.#currentMixer = data.id;
      } else if (this.#currentMixer == data.id && data.jarId === null) {
        this.shadowRoot.getElementById("jar").classList.remove("mixing");
        this.#currentMixer = null;
      }
    });
  }

  update(data, type) {
    if (type === "delete") {
      console.log("Jar deleted:", this.#jar.id);
      this.remove();
    }
    if (type === "update") {
      this.#jar = data;
      this.__getIngredients();
      this.updateSpecs();
      this.updateLayers();
    }
  }

  async __getIngredients() {
    const ingredients = await JarHasIngredient.find({ jarId: this.#jar.id });

    this.#ingredients = [];
    for (const jarIngredient of ingredients) {
      const ingredient = await Ingredient.findById(jarIngredient.ingredientId);
      if (ingredient) {
        this._addIngredient(ingredient);
      } else {
        console.error(
          `Ingredient with ID ${jarIngredient.ingredientId} not found`
        );
      }
    }
  }

  _addIngredient(ingredient) {
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

    const minMixingTimeValue = this.#ingredients.reduce(
      (minTime, ingredient) =>
        minTime > ingredient.minMixingTime ? minTime : ingredient.minMixingTime,
      0
    );

    this.#minMixingTime = minMixingTimeValue;
    this.updateSpecs();
    this.updateLayers();
  }

  updateSpecs() {
    const mixingSpeed = this.shadowRoot.getElementById("mixing-speed");
    const minMixingTime = this.shadowRoot.getElementById("min-mixing-time");

    mixingSpeed.innerText = this.#mixingSpeed
      ? `Mixing Speed: ${this.#mixingSpeed} RPM`
      : "";

    minMixingTime.innerText = `Min mixing Time: ${this.#minMixingTime} sec`;
  }

  updateLayers() {
    this.#layers.forEach((layer, index) => {
      layer.setAttribute(
        "fill",
        this.#ingredients[index]?.colorHexcode || "#ffffff"
      );
    });
  }

  async _dragstartHandler(event) {
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
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.dropEffect = "move";
  }

  async _dropHandler(event) {
    event.preventDefault();
    try {
      const dropEventJSON = JSON.parse(
        event.dataTransfer.getData("text/plain")
      );

      if (!dropEventJSON) {
        throw new Error("Invalid drop event data");
      }

      if (!dropEventJSON.ingredientId) {
        throw new Error("Can only drop ingredients on a jar");
      }

      const ingredientId = dropEventJSON.ingredientId;

      const ingredient = await Ingredient.findById(ingredientId);

      if (!ingredient) {
        throw new Error(`Ingredient with ID ${ingredientId} not found`);
      }

      if (this.#ingredients.length >= 3) {
        throw new Error("Jar is full, cannot add more ingredients");
      }

      if (
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

      this._addIngredient(ingredient);
    } catch (error) {
      console.error("Error handling drop event:", error);
      new Notification(error.message, "error");
    }
  }

  _dragoverHandler(event) {
    event.preventDefault();
  }
}
