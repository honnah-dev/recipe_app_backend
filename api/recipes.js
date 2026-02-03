import express from 'express';
const router = express.Router();

import { getAllUserRecipes, getRecipeById, createRecipe, updateRecipe, deleteRecipe, assignRecipeToBoard } from '#db/queries/recipes';
import requireUser from '#middleware/requireUser';
import { extractRecipeFromUrl } from '#utils/recipeParser';


router.use(requireUser);

router.post("/", async (req, res) => {
  const { 
    title, description, sourceUrl, imageUrl, 
    prepTime, cookTime, servings, ingredients, instructions,
    boards  
  } = req.body;
  
  // Create recipe
  const recipe = await createRecipe(
    req.user.id,
    title,
    description,
    sourceUrl,
    imageUrl,
    prepTime,
    cookTime,
    servings,
    ingredients,
    instructions
  );
  
  // Assign to whatver boards they want!
  if (boards && boards.length > 0) {
    for (let boardId of boards) {
      await assignRecipeToBoard(recipe.id, boardId);  // You'll create this function
    }
  }
  
  res.status(201).json(recipe);
});





router.get("/", async (req, res) => {
  const recipes = await getAllUserRecipes(req.user.id);
  res.json(recipes);
});

router.param("id", async (req, res, next, id) => {
  const recipe = await getRecipeById(id, req.user.id);
  if (!recipe) return res.status(404).send("Recipe not found");
  req.recipe = recipe;
  next();
});

router.get("/:id", async (req, res) => {
  res.json(req.recipe);
});

router.put("/:id", async (req, res) => {
  const { title, description, sourceUrl, imageUrl, prepTime, cookTime, servings, ingredients, instructions } = req.body;
  const updatedRecipe = await updateRecipe(
    req.recipe.id,
    req.user.id,
    title,
    description,
    sourceUrl,
    imageUrl,
    prepTime,
    cookTime,
    servings,
    ingredients,
    instructions
  );
  res.json(updatedRecipe);
});

router.delete("/:id", async (req, res) => {
  await deleteRecipe(req.recipe.id, req.user.id);
  res.status(204).send();
});

router.post("/import", async (req, res) => {
  const { url } = req.body;
  try {
    const recipeData = await extractRecipeFromUrl(url);
    res.json(recipeData);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});   

export default router;