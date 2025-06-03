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
      "/colortesting": `<x-colortesting></x-colortesting>`,
    },
  },
  Gui: {
    registeredGuiFiles: {
      components: [
        "Button",
        "IngredientsSection",
        "IngredientsForm",
        "IngredientListItem",
        "Jar",
        "Shelf",
        "Toast",
        "ToastList",
        "JarsSection",
        "MixerSection",
        "MixerForm",
        "Mixer",
        "EndResults",
        "ColorTestingCell",
      ],
      pages: ["Home", "Error", "MixingRoom", "ColorTesting"],
      layouts: ["Layout"],
    },
  },
  debug: true,
};
