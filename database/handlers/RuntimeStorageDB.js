import DatabaseInterface from "./DatabaseInterface.js";

export default class RuntimeStorageDB extends DatabaseInterface {
  static #storage = {};

  constructor() {
    throw new Error("RuntimeStorageDB is a static class and cannot be instantiated.");
  }

  static #getCollection(modelName) {
    return this.#storage[modelName] ? [...this.#storage[modelName]] : [];
  }

  static _setCollection(modelName, collection) {
    this.#storage[modelName] = [...collection];
  }

  static async create(modelName, data) {
    const collection = this.#getCollection(modelName);
    const newItem = {
      ...data,
      id: data.id ?? Date.now() + Math.floor(Math.random() * 10000),
    };
    collection.push(newItem);
    this._setCollection(modelName, collection);
    return newItem;
  }

  static async read(modelName, query = {}) {
    const collection = this.#getCollection(modelName);
    if (!query || Object.keys(query).length === 0) return collection;

    return collection.filter((item) =>
      Object.entries(query).every(([key, value]) => item[key] === value)
    );
  }

  static async update(modelName, id, updates) {
    const collection = this.#getCollection(modelName);
    const index = collection.findIndex((item) => item.id === id);
    if (index === -1) return null;

    const updatedItem = { ...collection[index], ...updates, id };
    collection[index] = updatedItem;
    this._setCollection(modelName, collection);
    return updatedItem;
  }

  static async delete(modelName, id) {
    let collection = this.#getCollection(modelName);
    const initialLength = collection.length;
    collection = collection.filter((item) => item.id !== id);
    this._setCollection(modelName, collection);
    return collection.length < initialLength;
  }

  static async reset(modelName) {
    delete this.#storage[modelName];
    return !(modelName in this.#storage);
  }
}