import { async } from "regenerator-runtime";

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
    const result = await fetch(
      `https://forkify-api.herokuapp.com/api/v2/recipes/${id}`
    );
    const data = await result.json();

    if (!result.ok) throw new Error(`${data.message}`);

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
    alert(err);
  }
};
