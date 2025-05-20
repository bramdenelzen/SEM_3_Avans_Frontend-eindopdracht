/**
 * @abstract
 */
export default class AbstractDbHandler {
    
  constructor() {
    this.data = {};
  }

  /**
   * @abstract
   * @param {string} tableName 
   * @param {object} value 
   * @returns {object} with id
   */
  create(tableName, value) {
    return value;
  }

  /**
   * @abstract
   * @param {string} tableName 
   * @returns {object[]}
   */
  getAll(tableName) {
  }

  /**
   * @param {string} tableName 
   * @param {string | int} id 
   * @returns {object}
   */
  getSingle(tableName, id) {
  }

  // update(modelName, id, key, value) {
  //     if (!this.data[modelName]) {
  //         throw new Error(`Model ${modelName} not found`);
  //     }
  //     this.data[modelName].update(id, key, value);
  // }
  // getSingle(modelName, id) {
  //     if (!this.data[modelName]) {
  //         throw new Error(`Model ${modelName} not found`);
  //     }
  //     return this.data[modelName].getSingle(id);
  // }
  // getAll(modelName) {
  //     if (!this.data[modelName]) {
  //         throw new Error(`Model ${modelName} not found`);
  //     }
  //     return this.data[modelName].getAll();
  // }
  // delete(modelName, id) {
  //     if (!this.data[modelName]) {
  //         throw new Error(`Model ${modelName} not found`);
  //     }
  //     this.data[modelName].delete(id);
  // }
  // clearAll(modelName) {
  //     if (!this.data[modelName]) {
  //         throw new Error(`Model ${modelName} not found`);
  //     }
  //     this.data[modelName].clearAll();
  // }
}