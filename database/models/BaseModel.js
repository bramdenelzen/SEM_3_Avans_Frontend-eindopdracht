import DatabaseInterface from "../handlers/DatabaseInterface.js";

export default class BaseModel {
  static db = null;

  /**
   * @param {DatabaseInterface} databaseInstance 
   */
  static configureDatabase(databaseInstance) {
    this.db = databaseInstance;
  }

  constructor(modelName, data = {}) {
    if (!this.constructor.db) {
      throw new Error("Database not configured.");
    }

    this.modelName = modelName;
    this.id = data.id || null;

    // Assign all properties from data to the instance
    Object.assign(this, data);
  }

  // Save = create or update
  async save() {
    if (this.id) {
      return this.update();
    } else {
      const saved = await this.constructor.db.create(this.modelName, this._getData());
      Object.assign(this, saved); // Update instance with ID and any changes
      return this;
    }
  }

  async update() {
    if (!this.id) throw new Error("Cannot update unsaved instance.");
    const updated = await this.constructor.db.update(this.modelName, this.id, this._getData());
    Object.assign(this, updated);
    return this;
  }

  async delete() {
    if (!this.id) throw new Error("Cannot delete unsaved instance.");
    await this.constructor.db.delete(this.modelName, this.id);
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
    return rawRecords.map(data => new this(data)); // return class instances
  }

  static async findById(id){
    const rawRecords = await this.db.read(this.modelName, { id });
    if (rawRecords.length === 0) return null;
    return new this(rawRecords[0]); // return class instance
  }
}
