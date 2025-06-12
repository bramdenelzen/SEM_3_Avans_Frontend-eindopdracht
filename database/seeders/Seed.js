import BaseSeeder from "./BaseSeeder.js";

export default class Seed {
  constructor(seeders = []) {
    this._seeders = seeders;
  }

  addSeeder(seeder) {
    if (!(seeder instanceof BaseSeeder)) {
      throw new Error("Seeder must be an instance of BaseSeeder");
    }

    this._seeders.push(seeder);
  }

  async run() {
    for (const seeder of this._seeders) {
      await seeder.run();
    }
  }
}
