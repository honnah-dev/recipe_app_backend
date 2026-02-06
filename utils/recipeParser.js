// This file extracts recipe data from URLs

/**
 * Main function: Takes a URL, returns recipe data
 * @param {string} url - Recipe URL (e.g., "https://sallysbaking.com/cookies")
 * @returns {object} - Recipe data matching our schema
 */
export async function extractRecipeFromUrl(url) {
  try {
    // STEP 1: Fetch the HTML from the URL
    const response = await fetch(url);

    // Check for HTTP errors
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

    // Helper: Check if item is a Recipe (handles both "@type": "Recipe" and "@type": ["Recipe"])
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

        // Find the Recipe object - can be in different formats
        if (Array.isArray(jsonLdData)) {
          recipe = jsonLdData.find(isRecipe);
        } else if (isRecipe(jsonLdData)) {
          recipe = jsonLdData;
        } else if (jsonLdData['@graph']) {
          recipe = jsonLdData['@graph'].find(isRecipe);
        }

        if (recipe) break; // Found it, stop searching
      } catch (parseError) {
        // This JSON block wasn't valid, try the next one
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
      sourceUrl: url,  // Include the original URL
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


/**
 * Parse ISO 8601 duration to minutes
 * @param {string} duration - e.g., "PT15M" or "PT1H30M"
 * @returns {number} - Minutes (e.g., 15 or 90)
 */
function parseTime(duration) {
  if (!duration) return null;
  
  // PT15M = 15 minutes
  // PT1H30M = 90 minutes
  // PT2H = 120 minutes
  
  // TODO: Parse the duration string
  // Hint: Use regex to extract hours (H) and minutes (M)
  // Example regex: /PT(?:(\d+)H)?(?:(\d+)M)?/
  
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
  if (!match) return null;
  
  const hours = parseInt(match[1] || 0);
  const minutes = parseInt(match[2] || 0);
  
  return hours * 60 + minutes;
}


/**
 * Parse servings/yield to a number
 * @param {string|number} yieldString - e.g., "24 cookies" or "4 servings" or just 4
 * @returns {number} - Just the number (e.g., 24 or 4)
 */
function parseServings(yieldValue) {
  if (!yieldValue) return null;

  // If it's already a number, return it
  if (typeof yieldValue === 'number') return yieldValue;

  // If it's an array, use the first element
  // e.g., ["24", "24 3-inch cookies"] → use "24"
  if (Array.isArray(yieldValue)) {
    yieldValue = yieldValue[0];
  }

  // If it's a string, extract the first number
  // "24 cookies" → 24
  // "Serves 4-6" → 4
  if (typeof yieldValue === 'string') {
    const match = yieldValue.match(/\d+/);
    return match ? parseInt(match[0]) : null;
  }

  return null;
}


/**
 * Parse ingredients array (they're usually already clean!)
 * @param {array} ingredients - Array of ingredient strings
 * @returns {array} - Cleaned array
 */
function parseIngredients(ingredients) {
  if (!Array.isArray(ingredients)) return [];
  
  // Most sites already give clean arrays like:
  // ["2 cups flour", "1 egg"]
  // So we just return them as-is!
  
  return ingredients.filter(ing => ing && ing.trim());
}


/**
 * Parse instructions - can be array of strings or array of objects
 * @param {array} instructions - Schema.org instructions
 * @returns {array} - Array of instruction strings
 */
function parseInstructions(instructions) {
  if (!Array.isArray(instructions)) {
    // Sometimes it's a single string - split by newlines
    return instructions.split('\n').filter(step => step.trim());
  }
  
  // Instructions can be:
  // 1. Array of strings: ["Mix flour", "Bake"]
  // 2. Array of objects: [{ "@type": "HowToStep", "text": "Mix flour" }]
  
  // Flatten nested sections (HowToSection contains itemListElement)
  const flattenedSteps = [];

  for (const step of instructions) {
    if (typeof step === 'string') {
      flattenedSteps.push(step);
    } else if (typeof step === 'object' && step !== null) {
      // Check if it's a HowToSection with nested steps
      if (step.itemListElement && Array.isArray(step.itemListElement)) {
        // Add section name as a header if it exists
        if (step.name) {
          flattenedSteps.push(`**${step.name}**`);
        }
        // Add all nested steps
        for (const nestedStep of step.itemListElement) {
          if (typeof nestedStep === 'string') {
            flattenedSteps.push(nestedStep);
          } else if (nestedStep.text) {
            flattenedSteps.push(nestedStep.text);
          }
        }
      } else {
        // Regular HowToStep - extract text
        flattenedSteps.push(step.text || step.name || '');
      }
    }
  }

  return flattenedSteps.filter(step => typeof step === 'string' && step.trim());
}


/**
 * Parse image URL (can be string, object, or array)
 * @param {string|object|array} image - Schema.org image data
 * @returns {string} - Image URL
 */
function parseImage(image) {
  if (!image) return null;
  
  // Can be:
  // 1. String: "https://example.com/image.jpg"
  // 2. Object: { "url": "https://..." }
  // 3. Array: ["https://...", "https://..."]
  
  if (typeof image === 'string') return image;
  
  if (typeof image === 'object' && image.url) return image.url;
  
  if (Array.isArray(image) && image.length > 0) {
    // Return first image
    return typeof image[0] === 'string' ? image[0] : image[0].url;
  }
  
  return null;
}