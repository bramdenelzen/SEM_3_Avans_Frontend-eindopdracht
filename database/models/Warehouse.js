import BaseModel from "./BaseModel.js";

export default class Warehouse extends BaseModel {
  static modelName = "ingredients";

  static schema = {
    minMixingTime: {
      type: "number",
      required: true,
    },
    minMixingSpeed: {
      type: "number",
      required: true,
    },
    colorHexcode: {
      type: "string",
      required: true,
    },
    texture: {
      type: "string",
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
  constructor(minMixingTimeOrData, minMixingSpeed, colorHexcode, texture) {
    // Support both `new User({ id, name, age })` and `new User(name, age)`
    let data;
    if (typeof minMixingTimeOrData === "object") {
      data = minMixingTimeOrData;
    } else {
      data = {
        minMixingTime: minMixingTimeOrData,
        minMixingSpeed,
        colorHexcode,
        texture,
      };
    }

    super(Ingredient.modelName, data, Ingredient.schema);
  }
}
