"use strict";
import "core-js/stable";
import "regenerator-runtime";

import * as model from "./model";
import recipeView from "./views/recipeView";

const showRecipe = async function () {
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
    alert(err);
  }
};

["load", "hashchange"].forEach((ev) => window.addEventListener(ev, showRecipe));
