import config from "./config.js";
import Gui from "./gui/Gui.js";
import BaseModel from "./database/models/BaseModel.js";
import Router from "./services/Router.js";

new Gui(config.Gui.registeredGuiFiles);
new Router(config.Router.routes);
BaseModel.configureDatabase(new config.Db.handler());
