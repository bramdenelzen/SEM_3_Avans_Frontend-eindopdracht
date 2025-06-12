import BaseModel from "./BaseModel.js";

export default class ResultColor extends BaseModel {
  static modelName = "resultcolor";

  static schema = {
    colorHexcode: {
      type: "string",
      required: true,
    },
  };

  /**
   * @param {string|object} colorHexcodeOrData
   */
  constructor(colorHexcodeOrData) {
    let data;
    if (typeof colorHexcodeOrData === "object") {
      data = colorHexcodeOrData;
    } else {
      data = {
        colorHexcode: colorHexcodeOrData,
      };
    }

    super(ResultColor.modelName, data, ResultColor.schema);
  }
}
