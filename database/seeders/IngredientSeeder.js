import BaseSeeder from "./BaseSeeder.js";
import Ingredient from "../models/Ingredient.js";

export default class IngredientSeeder extends BaseSeeder {
  static async run() {
    let ingredients = await Ingredient.find({});
    const minIngredients = 3 

    if (ingredients.length < minIngredients) {
      const ingredientsToAdd = minIngredients - ingredients.length;

      for (let i = 0; i < ingredientsToAdd; i++) {
        const ingredient = new Ingredient({
          texture: "smooth", 
          colorHexcode: "#FF5733",
          minMixingTime: 5 * (i + 1), 
          minMixingSpeed: 10 * (i+1), 

        });
        await ingredient.save();
      }

    }
  }
}