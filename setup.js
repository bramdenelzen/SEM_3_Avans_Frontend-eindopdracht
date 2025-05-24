import config from "./config.js";
import Gui from "./gui/Gui.js";
import BaseModel from "./database/models/BaseModel.js";
import Router from "./services/Router.js";

const gui = new Gui(config.Gui);

while (!gui.loaded) {
  await new Promise((resolve) => {console.log("waiting");setTimeout(resolve, 1)});
}

console.log("Gui loaded successfully");
new Router(config.Router);
BaseModel.configureDatabase(new config.Db.handler());
