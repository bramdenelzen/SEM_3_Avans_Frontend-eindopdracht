import WebComponent from "../../Webcomponent.js";
import IngredientModel from "../../../database/models/Ingredient.js";
import Ingredient from "../../../database/models/Ingredient.js";
import MixingRoom from "../../../database/models/MixingRoom.js";
import Router from "../../../services/Router.js";
import { Notification } from "../../../services/Notifications.js";

export default class IngredientsSection extends WebComponent {
  constructor() {
    super();

    this.ingredientListElement =
      this.shadowRoot.getElementById("ingredient-list");

    this._seedList();
    IngredientModel.subscribeToModel(this._seedList.bind(this));
    this._updateDisableFormButton();
  }

  disconnectedCallback() {
    const form = this.shadowRoot.querySelector("x-ingredientsform");
    form.removeEventListener("submitSucces", this.submitHandler);
  }

  async _seedList() {
    this.ingredientListElement.innerHTML = "";
    const ingredients = await Ingredient.find({});

    for (const ingredient of ingredients) {
      console.log(ingredients);
      const ingredientListItemElement = document.createElement(
        "x-ingredientlistitem"
      );

      ingredientListItemElement.ingredient = ingredient;

      this.ingredientListElement.prepend(ingredientListItemElement);
    }
  }

  async _updateDisableFormButton() {
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
