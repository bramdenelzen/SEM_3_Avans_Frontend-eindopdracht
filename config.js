import LocalStorageDB from "./database/handlers/LocalStorageDB.js";
import RuntimeDBStorage from "./database/handlers/RuntimeStorageDB.js";
import SessionStorageDB from "./database/handlers/SessionStorageDB.js";
import Home from "./gui/pages/home/Home.js";

export default {
  // Database configuration
  Db: {
    handler: SessionStorageDB,
  },
  Router: {
    routes: {
      "/": () => `<x-home></x-home>`,
      "/about": () => `<x-mixingroom>About</x-mixingroom>`,
      "/mixingroom/{id}": ({ id }) =>
        `<x-mixingroom id="${id}"></x-mixingroom>`,
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
      ],
      pages: ["Home", "Error", "MixingRoom"],
      layouts: ["Layout"],
    },
  },
  debug: true,
};
