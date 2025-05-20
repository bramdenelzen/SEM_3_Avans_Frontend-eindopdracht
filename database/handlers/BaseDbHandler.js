import AbstractDbHandler from "./AbstractDbHandler.js";

class BaseDbHandler extends AbstractDbHandler {
  static #id = 0;

  constructor() {
    super();
    this.data = {};
  }

  create(tableName, value) {
    value.id = BaseDbHandler.#id++;

    if (this.data[tableName]) {
      this.data[tableName].push(value);
    } else {
      this.data[tableName] = [value];
    }

    return value;
  }

  update(tableName, id, key, value) {
    if (!this.data[tableName]) {
      throw new Error(`Table ${tableName} not found`);
    }
    const item = this.getSingle(tableName, id);
    if (item) {
      item[key] = value;
    } else {
      throw new Error(`Item with id ${id} not found in table ${tableName}`);
    }
    return item;
  }

  getAll(tableName) {
    if (!this.data[tableName]) {
      throw new Error(`Table ${tableName} not found`);
    }
    return this.data[tableName];
  }

  getSingle(tableName, id) {
    if (!this.data[tableName]) {
      throw new Error(`Table ${tableName} not found`);
    }
    const item = this.data[tableName].find((item) => item.id === id);

    if (!item) {
      throw new Error(`Item with id ${id} not found in table ${tableName}`);
    }

    return item;
  }

  getAllRecords() {
    return this.data;
  }
}

export default new BaseDbHandler();
