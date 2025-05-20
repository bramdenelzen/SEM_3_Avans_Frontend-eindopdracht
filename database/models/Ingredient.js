import Model from "./Model.js";

export default class Ingredient extends Model {
  static schema = {
    name: {
      type: "string",
    },
    description: {
      required: true,
      type: "string",
    },
    quantity: {
      required: true,
      type: "number",
    },
    unit: {
      required: true,
      type: "string",
    },
  };

  constructor(data = {}) {
    super(Ingredient.schema, data);
  }

  get name() {
    return this._data.name;
  }
  set name(value) {
    this.update("name", value);
  }
  get description() {
    return this._data.description;
  }
  set description(value) {
    this.update("description", value);
  }
  get quantity() {
    return this._data.quantity;
  }
  set quantity(value) {
    this.update("quantity", value);
  }
  get unit() {
    return this._data.unit;
  }
  set unit(value) {
    this.update("unit", value);
  }
}
