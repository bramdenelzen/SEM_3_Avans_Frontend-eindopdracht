import BaseModel from "./BaseModel.js";

export default class Ingredient extends BaseModel {
  static modelName = "ingredient";

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
   * @param {number} minMixingTimeOrData
   * @param {number} minMixingSpeed
   * @param {string} colorCode
   * @param {string} texture
   */
  constructor(minMixingTimeOrData, minMixingSpeed, colorHexcode, texture) {
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
