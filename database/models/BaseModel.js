import DatabaseInterface from "../handlers/DatabaseInterface.js";

export default class BaseModel {
  static db = null;

  /**
   * @param {DatabaseInterface} databaseInstance
   */
  static async configureDatabase(databaseInstance) {
    this.db = databaseInstance;
  }

  #instanceSubscribers = [];

  constructor(modelName, data = {}) {
    if (!this.constructor.db) {
      throw new Error("Database not configured.");
    }

    this.modelName = modelName;
    this.id = data.id || null;

    Object.assign(this, data);
  }

  static subscribeToModel(callback) {
    if (!this.modelSubscribers) {
      this.modelSubscribers = [];
    }
    this.modelSubscribers.push(callback);
  }

  static unSubscribeFromModel(callback) {
    if (!this.modelSubscribers) return;
    const placeInList = this.modelSubscribers.indexOf(callback);
    if (placeInList !== -1) {
      this.modelSubscribers.splice(placeInList, 1);
    }
  }

  subscribeToInstance(callback) {
    if (!this.id) throw new Error("Instance must have an id to subscribe.");

    if (!this.constructor.instanceSubscribers) {
      this.constructor.instanceSubscribers = {};
    }

    if (!this.constructor.instanceSubscribers[this.id]) {
      this.constructor.instanceSubscribers[this.id] = [];
    }
    this.constructor.instanceSubscribers[this.id].push(callback);
  }

  unSubscribeFromInstance(callback) {
    const placeInList = this.#instanceSubscribers.indexOf(callback);
    if (placeInList !== -1) {
      this.#instanceSubscribers.splice(placeInList, 1);
    }
  }

  notify(data, type) {
    this.notifyInstanceSubscribers(data, type);
    this.notifyModelSubscribers(data, type);
  }

  notifyModelSubscribers(data, type) {
    if (this.constructor.modelSubscribers) {
      this.constructor.modelSubscribers.forEach((callback) => {
        callback(data, type);
      });
    }
  }

  notifyInstanceSubscribers(data, type) {
    if (this.constructor.instanceSubscribers) {
      const arr = this.constructor.instanceSubscribers[this.id] ?? [];
      arr.forEach((callback) => {
        callback(data, type);
      });
    }
  }

  async save() {
    if (this.id) {
      return this.update();
    } else {
      this._validate(this._getData());
      const saved = await this.constructor.db.create(
        this.modelName,
        this._getData()
      );
      this.notify(saved, "saved");
      Object.assign(this, saved); // Update instance with ID and any changes
      return this;
    }
  }

  async update() {
    if (!this.id) throw new Error("Cannot update unsaved instance.");
    this._validate(this._getData());
    const updated = await this.constructor.db.update(
      this.modelName,
      this.id,
      this._getData()
    );
    this.notify(updated, "update");
    Object.assign(this, updated);
    return this;
  }

  async delete() {
    if (!this.id) throw new Error("Cannot delete unsaved instance.");
    await this.constructor.db.delete(this.modelName, this.id);
    this.notify({}, "delete");
    return true;
  }

  // Get plain data object (excluding DB/config fields)
  _getData() {
    const data = { ...this };
    delete data.modelName;
    return data;
  }

  // Static method to find and return instances
  static async find(query = {}) {
    const rawRecords = await this.db.read(this.modelName, query);
    return rawRecords.map((data) => new this(data)); // return class instances
  }

  static async findById(id) {
    const rawRecords = await this.db.read(this.modelName, { id });
    if (rawRecords.length === 0) return null;
    return new this(rawRecords[0]); // return class instance
  }

  _validate(data) {
    for (const key in this.constructor.schema) {
      const schemaField = this.constructor.schema[key];
      const value = data[key];

      // Required check
      if (
        schemaField.required &&
        (value === undefined ||
          value === null ||
          value === "" ||
          Number.isNaN(value))
      ) {
        throw new Error(`Field ${key} is required`);
      }
    }

    for (const key in data) {
      if (key == "id") continue; // Skip ID validation
      const schemaField = this.constructor.schema[key];
      const value = data[key];

      // Only type check if value is not null or undefined
      if (schemaField) {
        if (value !== undefined && value !== null) {
          if (typeof value !== schemaField.type) {
            throw new Error(
              `Invalid type for property ${key}. Expected ${
                schemaField.type
              }, got ${typeof value}`
            );
          }
          this[key] = value;
        }
      } else {
        throw new Error(`Invalid property ${key} for model ${this.modelName}`);
      }
    }
  }

  static async reset() {
    if (!this.db) {
      throw new Error("Database not configured.");
    }
    await this.db.reset(this.modelName);

    this.modelSubscribers.forEach((callback) => {
      callback({}, "reset");
    });
  }
}
