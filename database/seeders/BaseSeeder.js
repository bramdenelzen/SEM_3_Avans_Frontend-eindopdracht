export default class BaseSeeder {

  static async run() {
    throw new Error('run method must be implemented in subclass');
  }
}