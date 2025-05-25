import config from "./config.js";
import Gui from "./gui/Gui.js";
import BaseModel from "./database/models/BaseModel.js";
import Router from "./services/Router.js";


const gui = new Gui(config.Gui);

while (!gui.loaded) {
  await new Promise((resolve) => {console.log("waiting");setTimeout(resolve, 100)});
}

BaseModel.configureDatabase(new config.Db.handler());

new Router(config.Router);