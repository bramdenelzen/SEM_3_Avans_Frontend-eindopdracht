import BaseModel from "./BaseModel.js";

export default class Ingredient extends BaseModel {
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

  get rgb() {
    const hex = this.colorCode.replace("#", "");
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return [r, g, b];
  }

  get hex() {
    return this.colorCode;
  }

  get hsl() {
    const hex = this.colorCode.replace("#", "");
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;

    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h,
      s,
      l = (max + min) / 2;

    if (max === min) {
      h = s = 0; // achromatic
    } else {
      const c = max - min;
      s = l > 0.5 ? c / (2 - max - min) : c / (max + min);

      switch (max) {
        case r:
          h = (g - b) / c + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / c + 2;
          break;
        case b:
          h = (r - g) / c + 4;
          break;
      }

      h /= 6;
    }

    return [h * 360, s * 100, l * 100];
  }
}
