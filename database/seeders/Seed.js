export default class Seed {
  constructor(seeders = []) {
    this.seeders = seeders;
  }

  addSeeder(seeder) {
    this.seeders.push(seeder);
  }

  async run() {
    for (const seeder of this.seeders) {
      await seeder.run();
    }
  }
}
