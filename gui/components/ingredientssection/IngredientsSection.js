import WebComponent from "../../Webcomponent.js";
import IngredientModel from "../../../database/models/Ingredient.js";
import IngredientListItem from "../ingredientListItem/IngredientListItem.js";
import Ingredient from "../../../database/models/Ingredient.js";
import MixingRoom from "../../../database/models/MixingRoom.js";
import Router from "../../../services/Router.js";

export default class IngredientsSection extends WebComponent {
  constructor() {
    super(IngredientsSection.html, IngredientsSection.css);
  }

  async connectedCallback() {
    const addButton = this.shadowRoot.getElementById("add-ingredient");

    const { mixingroomId } = new Router().getParams();

    const mixingroom = await MixingRoom.find({});

    if (mixingroom[0].id != Number(mixingroomId)) {
      addButton.remove()
    }

    this.ingredientListElement =
      this.shadowRoot.getElementById("ingredient-list");

    this.form = this.shadowRoot.querySelector("x-ingredientsform");

    this.seedList();

    this.form.addEventListener("submitSucces", (event) => {
      const ingredient = event.detail.data;

      const ingredientListItemElement = document.createElement(
        "x-ingredientlistitem"
      );
      ingredientListItemElement.ingredient = ingredient;

      this.ingredientListElement.prepend(ingredientListItemElement);

      this.form.hidePopover();
    });
  }

  disconnectedCallback() {
    this.form.removeEventListener("submitSucces", this.submitHandler);
  }

  async seedList() {
    const ingredients = await Ingredient.find({});

    for (const ingredient of ingredients) {
      const ingredientListItemElement = document.createElement(
        "x-ingredientlistitem"
      );

      ingredientListItemElement.ingredient = ingredient;

      this.ingredientListElement.prepend(ingredientListItemElement);
    }
  }
}
