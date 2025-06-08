import DatabaseInterface from "./DatabaseInterface.js";

export default class RuntimeStorageDB extends DatabaseInterface {

  constructor() {
    super();
    this.db = new Map(); // Map<modelName, Map<id, record>>
    this.idCounter = 1;
  }

  _getModelStore(modelName) {
    if (!this.db.has(modelName)) {
      this.db.set(modelName, new Map());
    }
    return this.db.get(modelName);
  }

  async create(modelName, data) {
    const store = this._getModelStore(modelName);
    const id = this.idCounter++;
    const newData = { ...data, id };
    store.set(id, newData);
    return { ...newData };
  }

  async read(modelName, query = {}) {
    const store = this._getModelStore(modelName);
    const all = Array.from(store.values());

    // Simple query filtering: match all key/value pairs
    const filtered = all.filter((record) =>
      Object.entries(query).every(([key, value]) => record[key] === value)
    );

    return filtered.map((record) => ({ ...record }));
  }

  async update(modelName, id, updates) {
    const store = this._getModelStore(modelName);
    if (!store.has(id)) {
      throw new Error(`Record with id ${id} not found`);
    }

    const existing = store.get(id);
    const updated = { ...existing, ...updates };
    store.set(id, updated);
    return { ...updated };
  }

  async delete(modelName, id) {
    const store = this._getModelStore(modelName);
    if (!store.has(id)) {
      throw new Error(`Record with id ${id} not found`);
    }
    store.delete(id);
    return true;
  }

  async reset(modelName) {
    if (!this.db.has(modelName)) {
      return true;
    }
    this._getModelStore(modelName).clear()
    this.idCounter = 1;
    return true;
  }
}
