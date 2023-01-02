"use strict";
import "core-js/stable";
import "regenerator-runtime";
import chalk from "chalk";

import * as model from "./model";
import recipeView from "./views/recipeView";

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

const init = () => {
  recipeView.addHandlerRender(controlRecipes); //SUBSCRIBER, reacting to the events
};

init();
