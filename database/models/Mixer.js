import BaseModel from "./BaseModel.js";

export default class Mixer extends BaseModel {
  static modelName = "mixer";

  static schema = {
    test: {
      type: "string",
      required: true,
    },
    mixingRoomId: {
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
