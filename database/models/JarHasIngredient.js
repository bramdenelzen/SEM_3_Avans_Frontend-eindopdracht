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
   *
   * @param {number} minMixingTimeOrData
   * @param {number} minMixingSpeed
   * @param {string} colorCode
   * @param {string} texture
   */
  constructor(jarIdOrData) {
    // Support both `new User({ id, name, age })` and `new User(name, age)`
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
