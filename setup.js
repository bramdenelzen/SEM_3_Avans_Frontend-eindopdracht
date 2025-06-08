import config from "./config.js";
import Gui from "./gui/Gui.js";
import BaseModel from "./database/models/BaseModel.js";
import Router from "./services/Router.js";
import Seed from "./database/seeders/Seed.js";
import Weather from "./services/Weather.js";
import { ENV } from "./env.js";

await Weather.configure(ENV.WEATHER_API_KEY);

const db = new config.Db.handler();
const gui = new Gui(config.Gui);


while (!gui.loaded) {
  await new Promise((resolve) => {
    setTimeout(resolve, 100);
  });
}


BaseModel.configureDatabase(db);

const seeder = new Seed(config.Db.seeders);

await seeder.run();

new Router(config.Router);
