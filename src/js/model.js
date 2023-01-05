import { async } from "regenerator-runtime";
import chalk from "chalk";
import { API_URL, RES_PER_PAGE, KEY } from "./config";
import { AJAX, createRecipeObject } from "./helpers";
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
    const data = await AJAX(`${API_URL}/${id}?key=${KEY}`);

    state.recipe = createRecipeObject(data);

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
    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);
    state.search.results = data.data.recipes.map((recipe) => {
      return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        imageUrl: recipe.image_url,
        ...(recipe.key && { key: recipe.key }),
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
  //Add bookmark
  state.bookmarks.push(recipe);

  //Mark current recipe as a bookmark
  if (state.recipe.id === recipe.id) {
    state.recipe.isBookmarked = true;
  }

  persistBookmarks();
};

/**
 * Removes recipe as a bookmark
 * @param {String} id
 */
export const deleteBookmark = (id) => {
  //Delete bookmark
  const idx = state.bookmarks.findIndex((bookmark) => bookmark.id === id);
  state.bookmarks.splice(idx, 1);

  //Mark current recipe as NOT a bookmark
  if (state.recipe.id === id) {
    state.recipe.isBookmarked = false;
  }

  persistBookmarks();
};

const persistBookmarks = () => {
  // Load data into the local storage
  localStorage.setItem("bookmarks", JSON.stringify(state.bookmarks));
};

/**
 * Uploads the user's recipe via the API
 * @param {Object} newRecipe
 */
export const uploadRecipe = async (newRecipe) => {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter((entry) => entry[0].startsWith("ingredient") && entry[1] !== "")
      .map((ing) => {
        const ingArr = ing[1].replaceAll(" ", "").split(",");
        if (ingArr.length !== 3) {
          throw new Error(
            "Wrong ingredient format! Please use the correct format :)"
          );
        }
        const [quantity, unit, description] = ingArr;
        return { quantity: quantity ? +quantity : null, unit, description };
      });

    const recipe = {
      title: newRecipe.title,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      source_url: newRecipe.sourceUrl,
      publisher: newRecipe.publisher,
      image_url: newRecipe.image,
      ingredients,
    };

    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};

const init = () => {
  // Load data from the local storage
  const storage = localStorage.getItem("bookmarks");
  if (storage) {
    state.bookmarks = JSON.parse(storage);
  }
};

init();
