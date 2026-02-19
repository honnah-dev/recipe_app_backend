import db from "#db/client";

export async function createRecipe(userId, title, description, sourceUrl, imageUrl, prepTime, cookTime, servings, ingredients, instructions) {
  const sql = `
    INSERT INTO recipes
      (user_id, title, description, source_url, image_url, prep_time, cook_time, servings, ingredients, instructions)
    VALUES
      ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    RETURNING *
  `;
  const { rows: [recipe] } = await db.query(sql, [
    userId, title, description, sourceUrl, imageUrl, prepTime, cookTime, servings,
    JSON.stringify(ingredients),
    JSON.stringify(instructions)
  ]);
  return recipe;
}

export async function getAllUserRecipes(userId) {
  const sql = `
    SELECT *
    FROM recipes
    WHERE user_id = $1
    ORDER BY created_at DESC
  `;
  const { rows: recipes } = await db.query(sql, [userId]);
  return recipes;
}

export async function getRecipeById(recipeId, userId) {
  const sql = `
    SELECT *
    FROM recipes
    WHERE id = $1 AND user_id = $2
  `;
  const { rows: [recipe] } = await db.query(sql, [recipeId, userId]);
  return recipe;
}

export async function updateRecipe(recipeId, userId, title, description, sourceUrl, imageUrl, prepTime, cookTime, servings, ingredients, instructions) {
  const sql = `
    UPDATE recipes
    SET title = $3,
        description = $4,
        source_url = $5,
        image_url = $6,
        prep_time = $7,
        cook_time = $8,
        servings = $9,
        ingredients = $10,
        instructions = $11
    WHERE id = $1 AND user_id = $2
    RETURNING *
  `;
  const { rows: [recipe] } = await db.query(sql, [
    recipeId, userId, title, description, sourceUrl, imageUrl, prepTime, cookTime, servings,
    JSON.stringify(ingredients),
    JSON.stringify(instructions)
  ]);
  return recipe;
}

export async function deleteRecipe(recipeId, userId) {
  const sql = `
    DELETE FROM recipes
    WHERE id = $1 AND user_id = $2
    RETURNING *
  `;
  const { rows: [recipe] } = await db.query(sql, [recipeId, userId]);
  return recipe;
}

export async function assignRecipeToBoard(recipeId, boardId) {
  await db.query(
    `INSERT INTO recipe_boards (recipe_id, board_id)
     VALUES ($1, $2)
     ON CONFLICT DO NOTHING`,
    [recipeId, boardId]
  );
}

export async function getRecipesByBoard(boardId, userId) {
  const sql = `
    SELECT r.*
    FROM recipes r
    JOIN recipe_boards rb ON r.id = rb.recipe_id
    JOIN boards b ON rb.board_id = b.id
    WHERE b.id = $1 AND b.user_id = $2
    ORDER BY r.created_at DESC
  `;
  const { rows: recipes } = await db.query(sql, [boardId, userId]);
  return recipes;
}

export async function removeRecipeFromBoard(recipeId, boardId) {
  const sql = `
    DELETE FROM recipe_boards
    WHERE recipe_id = $1 AND board_id = $2
    RETURNING *
  `;
  const { rows: [entry] } = await db.query(sql, [recipeId, boardId]);
  return entry;
}
