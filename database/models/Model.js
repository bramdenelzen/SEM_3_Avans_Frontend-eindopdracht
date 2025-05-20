import Db from "../Db.js";

export default class Model {
  /**
   * @protected]
   */
  _data = {};

  constructor(schema, data) {
    this.schema = schema;
    this._checkSchema(data);
    this._data = Db.create(this.constructor.name, data);
  }

  get id() {
    return this._data.id;
  }
  set id(value) {
    throw new Error("ID is read-only");
  }

  get all() {
    return this._data;
  }
  set all(value) {
    throw new Error("All is read-only");
  }

  get tableName() {
    return this.constructor.name;
  }

  update(key, value) {
    if (this._data[key]) {
      this._checkField(key, this.schema[key], value);
      Db.update(this.constructor.name, this._data.id, key, value);
    } else {
      throw new Error(`Data with id ${key} not found`);
    }
  }

  /**
   * @protected
   * @param {string} key 
   * @param {object} field 
   * @param {*} value 
   */
  _checkField(key, field, value) {
    if (!this.schema.hasOwnProperty(key)) {
      throw new Error(`Unknown field "${key}" in root data`);
    }

    if (
      field.required &&
      (value === undefined || value === null || value === "")
    ) {
      throw new Error(`Field "${key}" is required`);
    }
    // If it's a Model subclass, validate recursively
    if (value == field.type) {
      console.log(value.model, field.type);
      console.log("Validating nested model");
      console.log(value);
      value.model.checkSchema(value);
    } else {
      // Fallback: primitive type check
        if (typeof value !== field.type) {
          throw new Error(`Field "${key}" should be of type "${field.type}"`);
        }
    }
  }

  /**
   * @protected
   */
  _checkSchema(data) {
    for (const key in this.schema) {
      this._checkField(key, this.schema[key], data[key]);
    }
  }
}
