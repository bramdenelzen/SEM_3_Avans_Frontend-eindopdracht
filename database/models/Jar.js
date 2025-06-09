import BaseModel from "./BaseModel.js";

export default class Jar extends BaseModel {
  static modelName = "jaasdsr";

  static schema = {
    name: {
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
  constructor(nameOrData) {
    // Support both `new User({ id, name, age })` and `new User(name, age)`
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
