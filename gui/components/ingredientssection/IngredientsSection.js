import WebComponent from "../../Webcomponent.js";
import IngredientModel from "../../../database/models/Ingredient.js";
import IngredientListItem from "../ingredientListItem/IngredientListItem.js";
import Ingredient from "../../../database/models/Ingredient.js";
import MixingRoom from "../../../database/models/MixingRoom.js";
import Router from "../../../services/Router.js";
import { Notification } from "../../../services/Notifications.js";

export default class IngredientsSection extends WebComponent {
  constructor() {
    super(IngredientsSection.html, IngredientsSection.css);
  }

  async connectedCallback() {
    const addButton = this.shadowRoot.getElementById("add-ingredient");

    const { mixingroomId } = new Router().getParams();

    const mixingroom = await MixingRoom.find({});

    if (mixingroom[0].id != Number(mixingroomId)) {
      addButton.removeAttribute("popovertarget");
      addButton.addEventListener("click", (event) => {
        new Notification(
          `You can only add ingredients inside of ${mixingroom[0].displayName}`,
          "error"
        );
      });
    }

    this.ingredientListElement =
      this.shadowRoot.getElementById("ingredient-list");

    this.form = this.shadowRoot.querySelector("x-ingredientsform");

    this.seedList();
    
    IngredientModel.subscribeToModel(
      async function (data, type) {
        if (type !== "create") {
          const ingredient = await IngredientModel.findById(data.id); // Use the data argument directly

          const ingredientListItemElement = document.createElement(
            "x-ingredientlistitem"
          );
          ingredientListItemElement.ingredient = ingredient;

          this.ingredientListElement.prepend(ingredientListItemElement);
          return;
        }
        this.seedList()
      }.bind(this)
    );
  }

  disconnectedCallback() {
    this.form.removeEventListener("submitSucces", this.submitHandler);
  }

  async seedList() {
    this.ingredientListElement.innerHTML = "";
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
