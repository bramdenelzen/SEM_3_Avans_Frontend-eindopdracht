import config from "./config.js";
import Gui from "./gui/Gui.js";
import BaseModel from "./database/models/BaseModel.js";
import Router from "./services/Router.js";



Gui.setup(config.Gui.registeredGuiFiles);

BaseModel.configureDatabase(new config.db.handler());

const router = new Router(config.routes);
