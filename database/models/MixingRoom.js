import BaseModel from "./BaseModel.js";

export default class MixingRoom extends BaseModel {
  static modelName = "mixingroom";

  static schema = {
    color: {
      type: "string",
      required: true,
    },
    displayName: {
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
  constructor(colorOrData) {
    // Support both `new User({ id, name, age })` and `new User(name, age)`
    let data;
    if (typeof colorOrData === "object") {
      data = colorOrData;
    } else {
      data = {
        color: colorOrData,
      };
    }

    super(MixingRoom.modelName, data, MixingRoom.schema);
  }
}
