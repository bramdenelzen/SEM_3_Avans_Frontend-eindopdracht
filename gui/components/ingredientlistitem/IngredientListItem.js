import Ingredient from "../../../database/models/Ingredient.js";
import Color from "../../../services/Color.js";
import { Notification } from "../../../services/Notifications.js";
import WebComponent from "../../Webcomponent.js";

export default class IngredientListItem extends WebComponent {
  #ingredient;

  constructor() {
    super(IngredientListItem.html, IngredientListItem.css);

    this.shadowRoot
      .querySelector("div")
      .addEventListener("dragstart", (event) => {
        event.dataTransfer.setData(
          "text/plain",
          JSON.stringify({
            ingredientId: this.#ingredient.id,
          })
        );
      });
  }

  /**
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
    colorField.classList.add("texture-" + this.#ingredient.texture);
    this.shadowRoot.getElementById("min-mixing-time").innerText = `${
      this.#ingredient.minMixingTime
    } sec`;
    this.shadowRoot.getElementById("min-mixing-speed").innerText = `${
      this.#ingredient.minMixingSpeed
    } rpm`;
    this.shadowRoot.getElementById("texture").innerText =
      this.#ingredient.texture;
  }
}
