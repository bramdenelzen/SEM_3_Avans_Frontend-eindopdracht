import WebComponent from "../../Webcomponent.js";
import IngredientModel from "../../../database/models/Ingredient.js";
import IngredientListItem from "../ingredientListItem/IngredientListItem.js";
import Ingredient from "../../../database/models/Ingredient.js";

export default class IngredientsSection extends WebComponent {
  constructor() {
    super(IngredientsSection.html, IngredientsSection.css);
  }

  connectedCallback() {
    this.ingredientListElement =
      this.shadowRoot.getElementById("ingredient-list");

      const form =this.shadowRoot.querySelector("x-ingredientsform");

    this.seedList();

    
      form.addEventListener("submitSucces", (event) => {
        const ingredient = event.detail.data;

        const ingredientListItemElement = document.createElement(
          "x-ingredientlistitem"
        );
        ingredientListItemElement.ingredient = ingredient;

        // Add the new ingredient to the top of the list
        this.ingredientListElement.prepend(ingredientListItemElement);
        // this.ingredientListElement.appendChild(ingredientListItemElement);

        form.hidePopover();
      });
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
