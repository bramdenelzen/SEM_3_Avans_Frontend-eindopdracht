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
   * @param {string|object}colorOrData
   * @param {string}displayName
   */
  constructor(colorOrData, displayName) {
    let data;

    if (typeof colorOrData === "object") {
      data = colorOrData;
    } else {
      data = {
        color: colorOrData,
        displayName
      };
    }

    super(MixingRoom.modelName, data, MixingRoom.schema);
  }
}
