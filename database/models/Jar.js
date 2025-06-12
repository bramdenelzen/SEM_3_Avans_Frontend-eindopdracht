import BaseModel from "./BaseModel.js";

export default class Jar extends BaseModel {
  static modelName = "jar";

  static schema = {
    name: {
      type: "string",
      required: true,
    },
  };

  /**
   * @param {string|object} nameOrData
   */
  constructor(nameOrData) {
    let data;

    if (typeof nameOrData === "object") {
      data = nameOrData;
    } else {
      data = {
        name: nameOrData,
      };
    }

    super(Jar.modelName, data, Jar.schema);
  }
}
