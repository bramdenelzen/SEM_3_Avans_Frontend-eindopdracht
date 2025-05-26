import config from "./config.js";
import Gui from "./gui/Gui.js";
import BaseModel from "./database/models/BaseModel.js";
import Router from "./services/Router.js";
import MixingRoom from "./database/models/MixingRoom.js";
import Seed from "./database/seeders/Seed.js";

const db = new config.Db.handler();
const gui = new Gui(config.Gui);

while (!gui.loaded) {
  await new Promise((resolve) => {
    setTimeout(resolve, 100);
  });
}

BaseModel.configureDatabase(db);

const seeder = new Seed(config.Db.seeders);

await seeder.run()

new Router(config.Router);