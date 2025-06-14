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
   * @param {number|object} mixingSpeedOrData
   * @param {number} mixingroomId
   * @param {number} jarId
   */
  constructor(mixingSpeedOrData,  mixingroomId, jarId = null) {
    let data;

    if (typeof mixingSpeedOrData === "object") {
      data = mixingSpeedOrData;
    } else {
      data = {
        mixingSpeed: mixingSpeedOrData,
        mixingroomId,
        jarId
      };
    }

    super(Mixer.modelName, data, Mixer.schema);
  }
}
