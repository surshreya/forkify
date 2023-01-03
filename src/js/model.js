import { async } from "regenerator-runtime";
import chalk from "chalk";
import { API_URL, RES_PER_PAGE } from "./config";
import { getJSON } from "./helpers";

/**
 * STATE Object
 */
export const state = {
  recipe: {},
  search: {
    query: "",
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
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

/**
 * Load a list of recipes for a particular search from the API and populate it to the state data    object
 * @param {String} query
 */
export const loadSearchResults = async (query) => {
  try {
    state.search.query = query;
    const data = await getJSON(`${API_URL}?search=${query}`);
    state.search.results = data.data.recipes.map((recipe) => {
      return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        imageUrl: recipe.image_url,
      };
    });
  } catch (err) {
    console.log(chalk.red(err));
    throw err;
  }
};

/**
 * Returns a set of recipes based on the page number
 * @param {Number} page
 * @returns []
 */
export const getSearchResultPage = (page = state.search.page) => {
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;

  return state.search.results.slice(start, end);
};

/**
 * Updates the loaded recipe's ingredients quantity
 * @param {Number} newServings
 */
export const updateServings = (newServings) => {
  const { servings } = state.recipe;
  state.recipe.ingredients.forEach((ing) => {
    ing.quantity = (ing.quantity * newServings) / servings;
  });
  state.recipe.servings = newServings;
};
