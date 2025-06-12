import BaseModel from "./BaseModel.js";

export default class Jar extends BaseModel {
  static modelName = "jarhasingredient";

  static schema = {
    jarId: {
      type: "number",
      required: true,
    },
    ingredientId: {
      type: "number",
      required: true,
    },
  };

  /**
   * @param {number|object} jarIdOrData
   * @param {number|object} ingredientId
   */
  constructor(jarIdOrData, ingredientId) {
    let data;

    if (typeof jarIdOrData === "object") {
      data = jarIdOrData;
    } else {
      data = {
        jarId: jarIdOrData,
        ingredientId,
      };
    }

    super(Jar.modelName, data, Jar.schema);
  }
}
