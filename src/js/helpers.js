import { async } from "regenerator-runtime";
import { TIMEOUT_SEC } from "./config";

const timeout = (s) => {
  return new Promise(function (_, reject) {
    setTimeout(() => {
      reject(new Error(`Request took too long! Timeout after ${s} seconds.`));
    }, s * 1000);
  });
};

export const AJAX = async (url, uploadData = undefined) => {
  try {
    const fetchPrmse = uploadData
      ? fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(uploadData),
        })
      : fetch(url);

    const result = await Promise.race([fetchPrmse, timeout(TIMEOUT_SEC)]);
    const data = await result.json();

    if (!result.ok) throw new Error(`${data.message}`);
    return data;
  } catch (err) {
    throw err;
  }
};

export const createRecipeObject = (data) => {
  let { recipe } = data.data;

  return {
    id: recipe.id,
    title: recipe.title,
    cookingTime: recipe.cooking_time,
    servings: recipe.servings,
    sourceUrl: recipe.source_url,
    ingredients: recipe.ingredients,
    publisher: recipe.publisher,
    imageUrl: recipe.image_url,
    ...(recipe.key && { key: recipe.key }),
  };
};
