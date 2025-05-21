/**
 * @interface
 */
export default class DatabaseInterface {
  async create(modelName, data) {
    throw new Error('create() not implemented');
  }

  async read(modelName, query) {
    throw new Error('read() not implemented');
  }

  async update(modelName, id, updates) {
    throw new Error('update() not implemented');
  }

  async delete(modelName, id) {
    throw new Error('delete() not implemented');
  }
}