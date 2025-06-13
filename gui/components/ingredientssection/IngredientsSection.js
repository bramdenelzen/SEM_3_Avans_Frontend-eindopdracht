import WebComponent from "../../Webcomponent.js";
import IngredientModel from "../../../database/models/Ingredient.js";
import Ingredient from "../../../database/models/Ingredient.js";
import MixingRoom from "../../../database/models/MixingRoom.js";
import Router from "../../../services/Router.js";
import { Notification } from "../../../services/Notifications.js";

export default class IngredientsSection extends WebComponent {
  constructor() {
    super();

    this.#seedList();
    this.#updateDisableFormButton();

    IngredientModel.subscribeToModel(this.#seedList.bind(this));
  }

  async #seedList() {
    const ingredientList = this.shadowRoot.getElementById("ingredient-list");
    ingredientList.innerHTML = "";
    const ingredients = await Ingredient.find({});

    for (const ingredient of ingredients) {
      const ingredientListItemElement = document.createElement(
        "x-ingredientlistitem"
      );

      ingredientListItemElement.ingredient = ingredient;
      ingredientList.prepend(ingredientListItemElement);
    }
  }

  //Button should only be enabled in the first mixingroom
  async #updateDisableFormButton() {
    const { mixingroomId } = new Router().getParams();
    const mixingroom = await MixingRoom.find({});
    const addButton = this.shadowRoot.getElementById("add-ingredient");

    if (mixingroom[0].id != Number(mixingroomId)) {
      addButton.removeAttribute("popovertarget");
      addButton.addEventListener("click", (event) => {
        new Notification(
          `You can only add ingredients inside of ${mixingroom[0].displayName}`,
          "error"
        );
      });
    }
  }
}
