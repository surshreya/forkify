"use strict";
import "core-js/stable";
import "regenerator-runtime";
import chalk from "chalk";

import * as model from "./model";
import recipeView from "./views/recipeView";
import searchView from "./views/searchView";
import { async } from "regenerator-runtime";

const controlRecipes = async function () {
  try {
    // Loading the Recipe
    const id = window.location.hash.slice(1);

    if (!id) return;
    // Render Spinner while response is fetched
    recipeView.renderSpinner();

    await model.loadRecipe(id);
    const { recipe } = model.state;

    // Rendering the recipe
    recipeView.render(recipe);
  } catch (err) {
    console.log(chalk.red(err));
    recipeView.renderError();
  }
};

const controlSearchResults = async () => {
  try {
    // Get Search Query
    const query = searchView.getQuery();
    if (!query) return;

    // Loading the Search Results
    await model.loadSearchResults(query);

    // Render the result
    console.log(model.state);
  } catch (err) {
    console.log(chalk.red(err));
  }
};

const init = () => {
  recipeView.addHandlerRender(controlRecipes); //SUBSCRIBER, reacting to the events
  searchView.addHandlerSearch(controlSearchResults);
};

init();
