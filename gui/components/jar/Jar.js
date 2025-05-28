import Ingredient from "../../../database/models/Ingredient.js";
import JarHasIngredient from "../../../database/models/JarHasIngredient.js";
import WebComponent from "../../Webcomponent.js";
import { Notification } from "../../../services/Notifications.js";
import JarModel from "../../../database/models/Jar.js";

export default class Jar extends WebComponent {
  #layers = [];

  #ingredients = [];

  #jar = null;

  constructor() {
    super(Jar.html, Jar.css);

    this.#layers.push(this.shadowRoot.getElementById("layer-3"));
    this.#layers.push(this.shadowRoot.getElementById("layer-2"));
    this.#layers.push(this.shadowRoot.getElementById("layer-1"));
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
  }

  async __getIngredients() {
    const ingredients = await JarHasIngredient.find({ jarId: this.#jar.id });
    if (ingredients.length > 3) {
      await ingredients[0].delete();
    }
    for (const jarIngredient of ingredients) {
      const ingredient = await Ingredient.findById(jarIngredient.ingredientId);
      if (ingredient) {
        this.#ingredients.push(ingredient);
      } else {
        console.error(
          `Ingredient with ID ${jarIngredient.ingredientId} not found`
        );
      }
    }
    this.updateLayers();
  }

  connectedCallback() {
    this.shadowRoot.addEventListener("drop", this._dropHandler.bind(this));

    this.shadowRoot.addEventListener(
      "dragover",
      this._dragoverHandler.bind(this)
    );

    this.updateLayers();
  }

  disconnectedCallback() {
    this.shadowRoot.removeEventListener("drop", this._dropHandler.bind(this));
    this.shadowRoot.removeEventListener(
      "dragover",
      this._dragoverHandler.bind(this)
    );
  }

  _dragoverHandler(event) {
    event.preventDefault();
  }

  async _dropHandler(event) {
    event.preventDefault();

    try {
      const dataJSON = event.dataTransfer.getData("text/plain");

      if (!dataJSON) {
        throw new Error("No ingredient ID found in drop event");
      }

      const ingredientData = JSON.parse(dataJSON);
      if (!ingredientData || !ingredientData.ingredientId) {
        throw new Error("Invalid ingredient data in drop event");
      }

      const ingredientId = ingredientData.ingredientId;
      const ingredient = await Ingredient.findById(ingredientId);

      if (!ingredient) {
        throw new Error(`Ingredient with ID ${ingredientId} not found`);
      }

      const jarIngredients = await JarHasIngredient.find({
        jarId: this.#jar.id,
      });

      if (jarIngredients.length >= 3) {
        throw new Error("Jar is full, cannot add more ingredients");
      }

      const jarIngredient = new JarHasIngredient({
        jarId: this.#jar.id,
        ingredientId: ingredient.id,
      });

      await jarIngredient.save();

      this.#ingredients.push(ingredient);

      this.updateLayers();
    } catch (error) {
      console.error("Error handling drop event:", error);
      new Notification(error.message, "error");
    }
  }

  updateLayers() {
    this.#layers.forEach((layer, index) => {
      layer.setAttribute(
        "fill",
        this.#ingredients[index]?.colorHexcode || "#ffffff"
      );
    });
  }
}
