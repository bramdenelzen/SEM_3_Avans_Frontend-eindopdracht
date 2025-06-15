import LocalStorageDB from "./database/handlers/LocalStorageDB.js";
import Mixer from "./database/models/Mixer.js";
import MixingRoom from "./database/models/MixingRoom.js";
import MixingRoomPage from "./gui/pages/mixingroom/MixingRoom.js";
import Jar from "./database/models/Jar.js";
import JarHasIngredient from "./database/models/JarHasIngredient.js";
import IngredientSeeder from "./database/seeders/IngredientSeeder.js";
import JarSeeder from "./database/seeders/JarSeeder.js";
import MixerSeeder from "./database/seeders/MixerSeeder.js";
import MixingRoomSeeder from "./database/seeders/MixingRoomSeeder.js";
import ResultColor from "./database/models/ResultColor.js";
import Ingredient from "./database/models/Ingredient.js";
import Home from "./gui/pages/home/Home.js";
import ColorTesting from "./gui/pages/colortesting/ColorTesting.js";
import RuntimeStorageDB from "./database/handlers/RuntimeStorageDB.js";

export default {
  Router: {
    routes: {
      "/":Home,
      "/mixingroom/{mixingroomId}": MixingRoomPage,
      "/colortesting": ColorTesting,
    },
  },
  Gui: {
    registeredGuiFiles: {
      components: [
        "IngredientsSection",
        "WeatherForm",
        "IngredientsForm",
        "IngredientListItem",
        "Jar",
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
  Db: {
    handler: LocalStorageDB,
    seeders: [MixingRoomSeeder, MixerSeeder, JarSeeder, IngredientSeeder],
    models: [
      MixingRoom,
      Mixer,
      Jar,
      JarHasIngredient,
      Mixer,
      ResultColor,
      Ingredient,
    ],
  },
};
