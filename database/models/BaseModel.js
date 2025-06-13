import DatabaseInterface from "../handlers/DatabaseInterface.js";

export default class BaseModel {
  static _db;

  /**
   * Setting the database on the Basemodel
   * @param {DatabaseInterface} databaseInstance
   */
  static async configureDatabase(databaseInstance) {
    this._db = databaseInstance;
  }

  /**
   * @param {string} modelName
   * @param {object} data
   */
  constructor(modelName, data = {}) {
    if (!this.constructor._db) {
      throw new Error("Database not configured.");
    }

    this.modelName = modelName;
    this.id = data.id || null;

    Object.assign(this, data);
  }

  /*
  Subscribing implementation
  */

  #instanceSubscribers = [];

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

  _notify(data, type) {
    this._notifyInstanceSubscribers(data, type);
    this._notifyModelSubscribers(data, type);
  }

  _notifyModelSubscribers(data, type) {
    if (this.constructor.modelSubscribers) {
      this.constructor.modelSubscribers.forEach(async (callback) => {
        await callback(data, type);
      });
    }
  }

  _notifyInstanceSubscribers(data, type) {
    if (this.constructor.instanceSubscribers) {
      const arr = this.constructor.instanceSubscribers[this.id] ?? [];
      arr.forEach(async (callback) => {
        await callback(data, type);
      });
    }
  }

  /*
  Database interactions
  */

  async save() {
    if (this.id) {
      return this.update();
    } else {
      this._validateSchema(this._getVisibleData());
      const saved = await this.constructor._db.create(
        this.modelName,
        this._getVisibleData()
      );
      this._notify(saved, "saved");
      Object.assign(this, saved); // Update instance with ID and any changes
      return this;
    }
  }

  async update() {
    if (!this.id) throw new Error("Cannot update unsaved instance.");
    this._validateSchema(this._getVisibleData());
    const updated = await this.constructor._db.update(
      this.modelName,
      this.id,
      this._getVisibleData()
    );
    this._notify(updated, "update");
    Object.assign(this, updated);
    return this;
  }

  async delete() {
    if (!this.id) throw new Error("Cannot delete unsaved instance.");
    await this.constructor._db.delete(this.modelName, this.id);
    this._notify({}, "delete");
    return true;
  }

  static async find(query = {}) {
    const rawRecords = await this._db.read(this.modelName, query);
    return rawRecords.map((data) => new this(data));
  }

  static async findById(id) {
    const rawRecords = await this._db.read(this.modelName, { id });
    if (rawRecords.length === 0) return null;
    return new this(rawRecords[0]);
  }

  static async reset() {
    if (!this._db) {
      throw new Error("Database not configured.");
    }
    await this._db.reset(this.modelName);

    if (!this.modelSubscribers) return;
    this.modelSubscribers.forEach((callback) => {
      callback({}, "reset");
    });
    return;
  }

  _getVisibleData() {
    const data = { ...this };
    delete data.modelName;
    return data;
  }

  _validateSchema(schema) {
    for (const key in this.constructor.schema) {
      const schemaField = this.constructor.schema[key];
      const value = schema[key];
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

    for (const key in schema) {
      if (key == "id") continue;
      const schemaField = this.constructor.schema[key];
      const value = schema[key];

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
}
