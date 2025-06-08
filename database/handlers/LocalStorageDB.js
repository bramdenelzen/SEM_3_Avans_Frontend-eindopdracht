import DatabaseInterface from "./DatabaseInterface.js";

export default class LocalStorageDB extends DatabaseInterface {
  static storage = window.localStorage;

  constructor() {
    throw new Error("LocalStorageDB is a static class and cannot be instantiated.");
  }

  static _getCollection(modelName) {
    const raw = LocalStorageDB.storage.getItem(modelName);
    return raw ? JSON.parse(raw) : [];
  }

  static _setCollection(modelName, collection) {
    LocalStorageDB.storage.setItem(modelName, JSON.stringify(collection));
  }

  static async create(modelName, data) {
    const collection = LocalStorageDB._getCollection(modelName);
    const newItem = {
      ...data,
      id: data.id ?? Date.now() + Math.floor(Math.random() * 10000),
    };
    collection.push(newItem);
    LocalStorageDB._setCollection(modelName, collection);
    return newItem;
  }

  static async read(modelName, query = {}) {
    const collection = LocalStorageDB._getCollection(modelName);
    if (!query || Object.keys(query).length === 0) return collection;

    return collection.filter((item) =>
      Object.entries(query).every(([key, value]) => item[key] === value)
    );
  }

  static async update(modelName, id, updates) {
    const collection = LocalStorageDB._getCollection(modelName);
    const index = collection.findIndex((item) => item.id === id);
    if (index === -1) return null;

    const updatedItem = { ...collection[index], ...updates, id };
    collection[index] = updatedItem;
    LocalStorageDB._setCollection(modelName, collection);
    return updatedItem;
  }

  static async delete(modelName, id) {
    let collection = LocalStorageDB._getCollection(modelName);
    const initialLength = collection.length;
    collection = collection.filter((item) => item.id !== id);
    LocalStorageDB._setCollection(modelName, collection);
    return collection.length < initialLength;
  }

  static async reset(modelName) {
    LocalStorageDB.storage.removeItem(modelName);
    
    return true;
  }
}
