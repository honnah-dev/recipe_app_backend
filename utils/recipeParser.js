// Scrapes recipe websites by extracting Schema.org JSON-LD structured data

export async function extractRecipeFromUrl(url) {
  try {
    // STEP 1: Fetch the HTML from the URL
    const response = await fetch(url);

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Recipe page not found. Please check the URL.');
      } else if (response.status === 403) {
        throw new Error('This site blocked our request. Try entering the recipe manually.');
      } else {
        throw new Error(`Could not access the recipe page (Error ${response.status}).`);
      }
    }

    const html = await response.text();
    
    // STEP 2: Find ALL schema.org JSON-LD script tags
    // Handles: type="...", type='...', and type=... (no quotes)

    const scriptMatches = [...html.matchAll(/<script[^>]*type\s*=\s*["']?application\/ld\+json["']?[^>]*>(.*?)<\/script>/gis)];

    if (scriptMatches.length === 0) {
      throw new Error('This site doesn\'t support automatic import yet. Support for more sites coming soon! Try a different recipe site or enter the recipe manually.');
    }

    console.log(`Found ${scriptMatches.length} JSON-LD block(s)`);

    // Handles both "@type": "Recipe" and "@type": ["Thing", "Recipe"]
    const isRecipe = (item) => {
      if (!item || !item['@type']) return false;
      const type = item['@type'];
      return type === 'Recipe' || (Array.isArray(type) && type.includes('Recipe'));
    };


    // STEP 3: Parse each JSON block and find the Recipe
    let recipe = null;

    for (const match of scriptMatches) {
      try {
        const jsonLdData = JSON.parse(match[1]);

        if (Array.isArray(jsonLdData)) {
          recipe = jsonLdData.find(isRecipe);
        } else if (isRecipe(jsonLdData)) {
          recipe = jsonLdData;
        } else if (jsonLdData['@graph']) {
          recipe = jsonLdData['@graph'].find(isRecipe);
        }

        if (recipe) break;
      } catch (parseError) {
        console.log('Skipping invalid JSON block');
        continue;
      }
    }

    if (!recipe) {
      throw new Error('Could not find recipe data on this page. The page may not contain a recipe, or uses an unsupported format. Support for more formats coming soon!');
    }



    // STEP 4: Extract and clean the data (camelCase to match API)

    return {
      title: recipe.name || 'Untitled Recipe',
      description: recipe.description || '',
      sourceUrl: url,
      imageUrl: parseImage(recipe.image),
      prepTime: parseTime(recipe.prepTime),
      cookTime: parseTime(recipe.cookTime),
      servings: parseServings(recipe.recipeYield),
      ingredients: parseIngredients(recipe.recipeIngredient || []),
      instructions: parseInstructions(recipe.recipeInstructions || [])
    };

  } catch (error) {
    console.error('Error extracting recipe:', error);
    throw new Error(`Failed to extract recipe: ${error.message}`);
  }
}


















//Converts ISO 8601 duration (e.g. "PT1H30M") to minutes

function parseTime(duration) {
  if (!duration) return null;

  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
  if (!match) return null;

  const hours = parseInt(match[1] || 0);
  const minutes = parseInt(match[2] || 0);

  return hours * 60 + minutes;
}






// Extracts a numeric serving count from various formats (string, number, array)
function parseServings(yieldValue) {
  if (!yieldValue) return null;

  if (typeof yieldValue === 'number') return yieldValue;

  if (Array.isArray(yieldValue)) {
    yieldValue = yieldValue[0];
  }

  if (typeof yieldValue === 'string') {
    const match = yieldValue.match(/\d+/);
    return match ? parseInt(match[0]) : null;
  }

  return null;
}


function parseIngredients(ingredients) {
  if (!Array.isArray(ingredients)) return [];
  return ingredients.filter(ingredient => ingredient && ingredient.trim());
}









// Handles string arrays, HowToStep objects, and nested HowToSection groups
function parseInstructions(instructions) {
  if (!Array.isArray(instructions)) {
    return instructions.split('\n').filter(step => step.trim());
  }

  const flattenedSteps = [];

  for (const step of instructions) {
    if (typeof step === 'string') {
      flattenedSteps.push(step);
    } else if (typeof step === 'object' && step !== null) {
      if (step.itemListElement && Array.isArray(step.itemListElement)) {
        if (step.name) {
          flattenedSteps.push(`**${step.name}**`);
        }
        for (const nestedStep of step.itemListElement) {
          if (typeof nestedStep === 'string') {
            flattenedSteps.push(nestedStep);
          } else if (nestedStep.text) {
            flattenedSteps.push(nestedStep.text);
          }
        }
      } else {
        flattenedSteps.push(step.text || step.name || '');
      }
    }
  }

  return flattenedSteps.filter(step => typeof step === 'string' && step.trim());
}











// Schema.org image can be a string, object with url, or array
function parseImage(image) {
  if (!image) return null;

  if (typeof image === 'string') return image;
  if (typeof image === 'object' && image.url) return image.url;

  if (Array.isArray(image) && image.length > 0) {
    return typeof image[0] === 'string' ? image[0] : image[0].url;
  }

  return null;
}
