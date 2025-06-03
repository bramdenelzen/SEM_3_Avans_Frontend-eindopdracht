import DatabaseInterface from "../handlers/DatabaseInterface.js";

export default class BaseModel {
  static db = null;

  /**
   * @param {DatabaseInterface} databaseInstance
   */
  static configureDatabase(databaseInstance) {
    this.db = databaseInstance;
  }

  #instanceSubscribers = [];

  constructor(modelName, data = {}) {
    if (!this.constructor.db) {
      throw new Error("Database not configured.");
    }

    this.modelName = modelName;
    this.id = data.id || null;

    // Assign all properties from data to the instance
    Object.assign(this, data);
  }

  subscribeToInstance(callback) {
    if (!this.id) throw new Error("Instance must have an id to subscribe.");

    console.log(this.id);
    if (!this.constructor.instanceSubscribers) {
      this.constructor.instanceSubscribers = {};
    }

    if (!this.constructor.instanceSubscribers[this.id]) {
      this.constructor.instanceSubscribers[this.id] = [];
    }
    this.constructor.instanceSubscribers[this.id].push(callback);

    console.log(this.constructor.instanceSubscribers);
  }

  unSubscribeFromInstance(callback) {
    const placeInList = this.#instanceSubscribers.indexOf(callback);
    if (placeInList !== -1) {
      this.#instanceSubscribers.splice(placeInList, 1);
    }
  }

  notifyInstanceSubscribers(data, type) {
    if (this.constructor.instanceSubscribers) {
      const arr = this.constructor.instanceSubscribers[this.id] ?? [];
      console.log(type);
      arr.forEach((callback) => {
        callback(data, type);
      });
    }
  }

  notify(data, type) {
    this.notifyInstanceSubscribers(data, type);
  }
  // Save = create or update
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
      if (key.required && (!data[key] || data[key] == "" || data[key] == NaN)) {
        throw new Error(`Field ${key} is required`);
      }
    }

    for (const key in data) {
      if (key == "id") continue; // Skip ID validation
      if (this.constructor.schema[key]) {
        if (this.constructor.schema[key].type == typeof data[key]) {
          this[key] = data[key];
        } else {
          throw new Error(
            `Invalid type for property ${key}. Expected ${
              this.constructor.schema[key].type
            }, got ${typeof data[key]}`
          );
        }
      } else {
        throw new Error(`Invalid property ${key} for model ${this.modelName}`);
      }
    }
  }
}
