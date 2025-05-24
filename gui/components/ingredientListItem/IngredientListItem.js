import Ingredient from "../../../database/models/Ingredient.js";
import WebComponent from "../../Webcomponent.js";

export default class IngredientListItem extends WebComponent {

    #ingredient;

  constructor() {
    super(IngredientListItem.html, IngredientListItem.css);
  }

  /**
   * @type {Ingredient}
   * @param {Ingredient} ingredient
   */
  set ingredient(ingredient) {
    this.#ingredient = ingredient;
    this.shadowRoot.getElementById("color").innerText =
      ingredient.colorHexcode;
    this.shadowRoot.getElementById(
      "min-mixing-time"
    ).innerText = `${ingredient.minMixingTime} min`;
    this.shadowRoot.getElementById(
      "min-mixing-speed"
    ).innerText = `${ingredient.minMixingSpeed} rpm`;
    this.shadowRoot.getElementById("texture").innerText = ingredient.texture;
  }
}
