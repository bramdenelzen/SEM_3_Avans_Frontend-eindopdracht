import  config  from "./config.js";
import BaseModel from "./database/models/BaseModel.js";

BaseModel.configureDatabase(new config.db.handler);
