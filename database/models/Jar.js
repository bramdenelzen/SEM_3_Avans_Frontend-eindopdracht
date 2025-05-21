import Ingredient from "./Ingredient.js";
import BaseModel from "./BaseModel.js";

export default class Jar extends BaseModel {
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
