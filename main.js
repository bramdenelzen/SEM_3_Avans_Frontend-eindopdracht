import Gui from "./gui/Gui.js";
import Ingredient from "./database/models/Ingredient.js";
import Jar from "./database/models/Jar.js";
import Model from "./database/models/Model.js";
import Db from "./database/Db.js";

new Gui();

const ingredientmodel = new Ingredient({
  name: "ingredeitt",
  description: "test",
  quantity: 1,
  unit: "kg",
});

new Ingredient({
  name: "ingredeitt",
  description: "test",
  quantity: 1,
  unit: "kg",
});

new Ingredient({
  name: "ingredeitt",
  description: "test",
  quantity: 1,
  unit: "kg",
});

const jarModel = new Jar({
  name: "jar",
  description: "test",
  quantity: 1,
  amount: "kg",
  ingredientId: ingredientmodel.id,
});

console.log((ingredientmodel.description = "asdas"));

console.log(ingredientmodel.all);

console.log(jarModel.all)

console.log(Db.getAllRecords())