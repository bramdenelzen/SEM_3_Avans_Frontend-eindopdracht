import DatabaseInterface from './DatabaseInterface.js';

export default class LocalStorageDB extends DatabaseInterface {
  constructor() {
    super();
    this.storage = window.localStorage;
  }

  _getCollection(modelName) {
    const raw = this.storage.getItem(modelName);
    return raw ? JSON.parse(raw) : [];
  }

  _setCollection(modelName, collection) {
    this.storage.setItem(modelName, JSON.stringify(collection));
  }

  async create(modelName, data) {
    const collection = this._getCollection(modelName);
    const newItem = {
      ...data,
      id: Date.now() + Math.floor(Math.random() * 10000)
    };
    collection.push(newItem);
    this._setCollection(modelName, collection);
    return newItem;
  }

  async read(modelName, query = {}) {
    const collection = this._getCollection(modelName);
    if (!query || Object.keys(query).length === 0) return collection;

    return collection.filter(item =>
      Object.entries(query).every(([key, value]) => item[key] === value)
    );
  }

  async update(modelName, id, updates) {
    const collection = this._getCollection(modelName);
    const index = collection.findIndex(item => item.id === id);
    if (index === -1) return null;

    const updatedItem = { ...collection[index], ...updates, id };
    collection[index] = updatedItem;
    this._setCollection(modelName, collection);
    return updatedItem;
  }

  async delete(modelName, id) {
    let collection = this._getCollection(modelName);
    const initialLength = collection.length;
    collection = collection.filter(item => item.id !== id);
    this._setCollection(modelName, collection);
    return collection.length < initialLength;
  }
}
