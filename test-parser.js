// Test the actual recipeParser.js module

import { extractRecipeFromUrl } from './utils/recipeParser.js';

const url = 'https://sallysbakingaddiction.com/christmas-sugar-cookies/';

console.log('🔍 Testing recipeParser with:', url);
console.log('');

try {
  const recipe = await extractRecipeFromUrl(url);

  console.log('✅ Success! Extracted recipe:\n');
  console.log('Title:', recipe.title);
  console.log('Description:', recipe.description?.substring(0, 100) + '...');
  console.log('Prep Time:', recipe.prep_time, 'minutes');
  console.log('Cook Time:', recipe.cook_time, 'minutes');
  console.log('Servings:', recipe.servings);
  console.log('Image URL:', recipe.image_url);
  console.log('');
  console.log('Ingredients:', recipe.ingredients?.length, 'items');
  console.log('Instructions:', recipe.instructions?.length, 'steps');
  console.log('');
  console.log('Full recipe object:');
  console.log(JSON.stringify(recipe, null, 2));

} catch (error) {
  console.error('❌ Error:', error.message);
}
