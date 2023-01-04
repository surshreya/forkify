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
  bookmarks: [],
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

    if (state.bookmarks.some((bookmark) => bookmark.id === state.recipe.id)) {
      state.recipe.isBookmarked = true;
    } else {
      state.recipe.isBookmarked = false;
    }
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

    state.search.page = 1;
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

/**
 * Adds recipe as a bookmark
 * @param {Object} recipe
 */
export const addBookmark = (recipe) => {
  state.bookmarks.push(recipe);

  //Mark current recipe as a bookmark
  if (state.recipe.id === recipe.id) {
    state.recipe.isBookmarked = true;
  }
};

/**
 * Removes recipe as a bookmark
 * @param {String} id
 */
export const deleteBookmark = (id) => {
  const idx = state.bookmarks.findIndex((bookmark) => bookmark.id === id);
  state.bookmarks.splice(idx, 1);

  //Mark current recipe as NOT a bookmark
  if (state.recipe.id === id) {
    state.recipe.isBookmarked = false;
  }
};
