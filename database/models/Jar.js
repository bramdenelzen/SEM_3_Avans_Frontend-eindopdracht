import Ingredient from "./Ingredient.js";
import Model from "./Model.js";

export default class Jar extends Model {
  static schema = {
    name: {
      type: "string",
    },
    description: {
      required: false,
      type: "string",
    },
    quantity: {
      required: true,
      type: "number",
    },
    amount: {
      required: true,
      type: "string",
    },
    ingredientId: {
      required: true,
      type: "number",
    },
  };

  constructor(data = {}) {
    super(Jar.schema, data);
  }
}
