import BaseSeeder from "./BaseSeeder.js";

export default class Seed {
  constructor(seeders = []) {
    this.seeders = seeders;
  }

  addSeeder(seeder) {
    if (!(seeder instanceof BaseSeeder)) {
      throw new Error("Seeder must be an instance of BaseSeeder");
    }

    this.seeders.push(seeder);
  }

  async run() {
    for (const seeder of this.seeders) {
      await seeder.run();
    }
  }
}
