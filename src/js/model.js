import { async } from "regenerator-runtime";
import chalk from "chalk";
import { API_URL } from "./config";
import { getJSON } from "./helpers";

/**
 * STATE Object
 */
export const state = {
  recipe: {},
};

/**
 * Load a Recipe from the API and populate it to the state data object
 * @param {String} id
 */
export const loadRecipe = async (id) => {
  try {
    const data = await getJSON(`${API_URL}/${id}`);

    let { recipe } = data.data;

    state.recipe = {
      id: recipe.id,
      title: recipe.title,
      cookingTime: recipe.cooking_time,
      servings: recipe.servings,
      sourceUrl: recipe.source_url,
      ingredients: recipe.ingredients,
      publisher: recipe.publisher,
      imageUrl: recipe.image_url,
    };
  } catch (err) {
    console.log(chalk.red(err));
    throw err;
  }
};
