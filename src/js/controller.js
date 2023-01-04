"use strict";
import "core-js/stable";
import "regenerator-runtime";
import chalk from "chalk";

import * as model from "./model";
import recipeView from "./views/recipeView";
import searchView from "./views/searchView";
import resultsView from "./views/resultsView";
import paginationView from "./views/paginationView";

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
    resultsView.renderSpinner();
    // Get Search Query

    const query = searchView.getQuery();
    if (!query) return;

    // Loading the Search Results
    await model.loadSearchResults(query);

    // Render the result
    resultsView.render(model.getSearchResultPage());

    // Render initialize pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(chalk.red(err));
  }
};

const controlPagination = (goToPage) => {
  // Render the paginated result
  resultsView.render(model.getSearchResultPage(goToPage));

  // Render NEW pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = (newServings) => {
  //Update the recipe's servings quantity
  model.updateServings(newServings);

  // Rendering the recipe
  recipeView.update(model.state.recipe);
};

const init = () => {
  recipeView.addHandlerRender(controlRecipes); //SUBSCRIBER, reacting to the events
  recipeView.addHandlerUpdateServings(controlServings);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
};

init();
