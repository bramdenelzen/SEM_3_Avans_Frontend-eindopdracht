import BaseModel from "./BaseModel.js";

export default class Mixer extends BaseModel {
  static modelName = "mixer";

  static schema = {
    mixingSpeed: {
      type: "number",
      required: true,
    },
    jarId: {
      type: "number",
    },
    mixingroomId: {
      type: "number",
      required: true,
    },
  };

  /**
   * @param {number} minMixingTimeOrData
   * @param {number} minMixingSpeed
   * @param {string} colorCode
   * @param {string} texture
   */
  constructor(mixingSpeedOrData, mixingroomId) {
    // Support both `new User({ id, name, age })` and `new User(name, age)`
    let data;
    if (typeof mixingSpeedOrData === "object") {
      data = mixingSpeedOrData;
    } else {
      data = {
        mixingSpeed: mixingSpeedOrData,
        mixingroomId: mixingroomId,
      };
    }

    super(Mixer.modelName, data, Mixer.schema);
  }
}
