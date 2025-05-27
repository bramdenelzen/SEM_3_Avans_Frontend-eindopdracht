import Ingredient from "../../../database/models/Ingredient.js";
import Router from "../../../services/Router.js";
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

    this.render();
  }

  render() {
    if (!this.#ingredient) {
      throw new Error("Ingredient is not set");
    }

    this.shadowRoot.getElementById("color-hexcode").innerText =
      this.#ingredient.colorHexcode;

    const colorField = this.shadowRoot.getElementById("color");
    colorField.style.backgroundColor = this.#ingredient.colorHexcode;
    colorField.classList.add("texture-"+this.#ingredient.texture)
    this.shadowRoot.getElementById("min-mixing-time").innerText = `${
      this.#ingredient.minMixingTime
    } min`;
    this.shadowRoot.getElementById("min-mixing-speed").innerText = `${
      this.#ingredient.minMixingSpeed
    } rpm`;
    this.shadowRoot.getElementById("texture").innerText =
      this.#ingredient.texture;
  }
}
