import LocalStorageDB from "./database/handlers/LocalStorageDB.js";
import RuntimeDBStorage from "./database/handlers/RuntimeStorageDB.js";
import SessionStorageDB from "./database/handlers/SessionStorageDB.js";
import MixingRoomSeeder from "./database/seeders/MixingRoomSeeder.js";
import Home from "./gui/pages/home/Home.js";

export default {
  // Database configuration
  Db: {
    handler: LocalStorageDB,
    seeders: [
      MixingRoomSeeder
    ]
  },
  Router: {
    routes: {
      "/": `<x-home></x-home>`,
      "/about": `<x-mixingroom></x-mixingroom>`,
      "/mixingroom/{mixingroomId}": `<x-mixingroom></x-mixingroom>`,
    },
  },
  Gui: {
    registeredGuiFiles: {
      components: [
        "Button",
        "IngredientsSection",
        "Header",
        "InputField",
        "IngredientsForm",
        "IngredientListItem",
        "Jar",
        "Shelf",
        "Toast",
        "ToastList"
      ],
      pages: ["Home", "Error", "MixingRoom"],
      layouts: ["Layout"],
    },
  },
  debug: true,
};
