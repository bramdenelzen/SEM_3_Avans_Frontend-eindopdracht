
/**
 * @interface
 */
export default class DatabaseInterface {
  static async create(modelName, data) {
    throw new Error("create() not implemented");
  }

  static async read(modelName, query) {
    throw new Error("read() not implemented");
  }

  static async update(modelName, id, updates) {
    throw new Error("update() not implemented");
  }

  static async delete(modelName, id) {
    throw new Error("delete() not implemented");
  }

  static async reset(){
    throw new Error("reset() not implemented");
  }
}
