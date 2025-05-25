import Ingredient from "../../../database/models/Ingredient.js";
import WebComponent from "../../Webcomponent.js";

export default class IngredientListItem extends WebComponent {

  #ingredient;

  constructor() {
    super(IngredientListItem.html, IngredientListItem.css);
  }

  connectedCallback() {
    this.shadowRoot
      .getElementById("delete")
      .addEventListener("click", async () => {
        await this.#ingredient.delete();
        this.remove();
      });
  }

  /**
   * @type {Ingredient}
   * @param {Ingredient} ingredient
   */
  set ingredient(ingredient) {
    if (!(ingredient instanceof Ingredient)) {
      throw new Error("Ingredient must be of type ingredient");
    }
    this.#ingredient = ingredient;
    this.shadowRoot.getElementById("color-hexcode").innerText =
      ingredient.colorHexcode;
    this.shadowRoot.getElementById("color").style.backgroundColor =
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
