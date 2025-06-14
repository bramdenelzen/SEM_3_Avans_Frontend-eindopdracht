import config from "./config.js";
import Gui from "./gui/Gui.js";
import BaseModel from "./database/models/BaseModel.js";
import Router from "./services/Router.js";
import Seed from "./database/seeders/Seed.js";
import Weather from "./services/Weather.js";
import ENV from "./env.js";

await Weather.configure(ENV.WEATHER_API_KEY);

await BaseModel.configureDatabase(config.Db.handler);

const seeder = new Seed(config.Db.seeders);
await seeder.run(config.Db.handler);

await Gui.configure(config.Gui);

new Router(config.Router);
