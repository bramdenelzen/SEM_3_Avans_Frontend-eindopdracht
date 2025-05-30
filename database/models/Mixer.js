import BaseModel from "./BaseModel.js";

export default class Mixer extends BaseModel {
  static modelName = "mixer";

  static schema = {
    mixingTime: {
      type: "number",
      required: true,
    },
    mixingSpeed: {
      type: "number",
      required: true,
    },
    mixingroomId: {
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
  constructor(mixingTimeOrData, mixingSpeed, mixingroomId) {
    // Support both `new User({ id, name, age })` and `new User(name, age)`
    let data;
    if (typeof mixingTimeOrData === "object") {
      data = mixingTimeOrData;
    } else {
      data = {
        mixingTime: mixingTimeOrData,
        mixingSpeed: mixingSpeed,
        mixingroomId: mixingroomId, 
      };
    }

    super(Mixer.modelName, data, Mixer.schema);
  }
}
