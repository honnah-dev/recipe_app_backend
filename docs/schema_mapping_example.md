# How Recipe Schema.org Data Maps to Your Database

## What's hiding in recipe websites

Most recipe blogs (like Sally's Baking Addiction) include hidden structured data in a format called **schema.org Recipe**. This is JSON data embedded in the HTML specifically for machines (like Google) to read.

Here's what it looks like (this is REAL data structure, just with Sally's recipe values):

```json
{
  "@context": "https://schema.org",
  "@type": "Recipe",
  "name": "Christmas Sugar Cookies Recipe with Easy Icing",
  "description": "Cut-out Christmas sugar cookies with crisp edges and soft centers. This icing recipe is so simple, making decorating hassle-free!",
  "image": "https://sallysbakingaddiction.com/wp-content/uploads/2014/12/decorated-christmas-sugar-cookies-with-icing.jpg",
  "author": {
    "@type": "Person",
    "name": "Sally McKenney"
  },
  "prepTime": "PT2H",
  "cookTime": "PT12M",
  "totalTime": "PT2H10M",
  "recipeYield": "24 cookies",
  "recipeIngredient": [
    "2 and 1/4 cups (281g) all-purpose flour",
    "1/2 teaspoon baking powder",
    "1/4 teaspoon salt",
    "3/4 cup (12 Tbsp; 170g) unsalted butter, softened to room temperature",
    "3/4 cup (150g) granulated sugar",
    "1 large egg, at room temperature",
    "2 teaspoons pure vanilla extract",
    "1/4 or 1/2 teaspoon almond extract"
  ],
  "recipeInstructions": [
    {
      "@type": "HowToStep",
      "text": "Whisk the flour, baking powder, and salt together in a medium bowl. Set aside."
    },
    {
      "@type": "HowToStep",
      "text": "In a large bowl using a handheld or a stand mixer fitted with a paddle attachment, beat the butter and sugar together on high speed until completely smooth and creamy, about 3 minutes."
    },
    {
      "@type": "HowToStep",
      "text": "Add the egg, vanilla, and almond extract (if using), and beat on high speed until combined, about 1 minute."
    }
    // ... more steps
  ]
}
```

---

## How this PERFECTLY maps to your database schema

### 1. RECIPES table:
```sql
INSERT INTO recipes (
  user_id,
  title,              -- ← FROM: "name"
  description,        -- ← FROM: "description"
  source_url,         -- ← The URL you pasted
  image_url,          -- ← FROM: "image"
  prep_time,          -- ← FROM: "prepTime" (converted from PT2H = 120 minutes)
  cook_time,          -- ← FROM: "cookTime" (converted from PT12M = 12 minutes)
  servings            -- ← FROM: "recipeYield" (parsed "24 cookies" → 24)
) VALUES (
  7,                           -- current user
  'Christmas Sugar Cookies',   -- from schema
  'Cut-out Christmas sugar...',-- from schema
  'https://sallysbaking...',   -- the URL user pasted
  'https://sallysbaking.../img.jpg', -- from schema
  120,                         -- from schema (2 hours = 120 min)
  12,                          -- from schema
  24                           -- from schema (parsed from "24 cookies")
) RETURNING id;  -- Let's say this returns id = 42
```

---

### 2. INGREDIENTS table:
The schema has an array called `recipeIngredient`. You loop through it:

```javascript
// From schema.org data:
const ingredients = [
  "2 and 1/4 cups (281g) all-purpose flour",
  "1/2 teaspoon baking powder",
  "1/4 teaspoon salt",
  // ... etc
];

// For each ingredient string, you can either:
// Option A: Store as-is (simple, works great for MVP)
for (let i = 0; i < ingredients.length; i++) {
  await db.query(
    'INSERT INTO ingredients (recipe_id, ingredient_name, order_index) VALUES ($1, $2, $3)',
    [42, ingredients[i], i]
  );
}

// Result in database:
// id | recipe_id | amount | unit | ingredient_name                              | order_index
// 1  | 42        | NULL   | NULL | "2 and 1/4 cups (281g) all-purpose flour"   | 0
// 2  | 42        | NULL   | NULL | "1/2 teaspoon baking powder"                | 1
// 3  | 42        | NULL   | NULL | "1/4 teaspoon salt"                         | 2
```

**Option B (advanced - later):** Use AI to parse each ingredient string into amount/unit/name:
- "2 and 1/4 cups all-purpose flour" → amount: "2 1/4", unit: "cups", name: "all-purpose flour"

---

### 3. INSTRUCTIONS table:
The schema has an array called `recipeInstructions`:

```javascript
// From schema.org data:
const instructions = [
  { "@type": "HowToStep", "text": "Whisk the flour, baking powder..." },
  { "@type": "HowToStep", "text": "In a large bowl using a handheld..." },
  { "@type": "HowToStep", "text": "Add the egg, vanilla..." }
];

// Insert each step:
for (let i = 0; i < instructions.length; i++) {
  await db.query(
    'INSERT INTO instructions (recipe_id, step_number, instruction_text) VALUES ($1, $2, $3)',
    [42, i + 1, instructions[i].text]
  );
}

// Result in database:
// id | recipe_id | step_number | instruction_text
// 1  | 42        | 1           | "Whisk the flour, baking powder..."
// 2  | 42        | 2           | "In a large bowl using a handheld..."
// 3  | 42        | 3           | "Add the egg, vanilla..."
```

---

## Real code example (your import endpoint):

```javascript
// POST /api/recipes/import
// Body: { url: "https://sallysbakingaddiction.com/christmas-sugar-cookies/" }

const importRecipe = async (req, res) => {
  const { url } = req.body;
  const userId = req.user.id; // from auth middleware
  
  // Step 1: Fetch the HTML
  const response = await fetch(url);
  const html = await response.text();
  
  // Step 2: Find the schema.org JSON-LD
  const schemaMatch = html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s);
  
  if (!schemaMatch) {
    return res.status(400).json({ error: "No recipe schema found" });
  }
  
  const schema = JSON.parse(schemaMatch[1]);
  
  // Step 3: Extract data
  const title = schema.name;
  const description = schema.description;
  const imageUrl = schema.image;
  const prepTime = parseISO8601Duration(schema.prepTime); // "PT2H" → 120
  const cookTime = parseISO8601Duration(schema.cookTime); // "PT12M" → 12
  const servings = parseInt(schema.recipeYield); // "24 cookies" → 24
  
  // Step 4: Save recipe
  const recipeResult = await db.query(
    `INSERT INTO recipes (user_id, title, description, source_url, image_url, prep_time, cook_time, servings)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
    [userId, title, description, url, imageUrl, prepTime, cookTime, servings]
  );
  
  const recipeId = recipeResult.rows[0].id;
  
  // Step 5: Save ingredients
  for (let i = 0; i < schema.recipeIngredient.length; i++) {
    await db.query(
      'INSERT INTO ingredients (recipe_id, ingredient_name, order_index) VALUES ($1, $2, $3)',
      [recipeId, schema.recipeIngredient[i], i]
    );
  }
  
  // Step 6: Save instructions
  for (let i = 0; i < schema.recipeInstructions.length; i++) {
    const step = schema.recipeInstructions[i];
    await db.query(
      'INSERT INTO instructions (recipe_id, step_number, instruction_text) VALUES ($1, $2, $3)',
      [recipeId, i + 1, step.text]
    );
  }
  
  res.json({ success: true, recipeId });
};
```

---

## Why this works for "most recipes"

Schema.org Recipe is an **industry standard**. Recipe sites use it because:
1. Google requires it for recipe search results
2. Pinterest uses it
3. Other recipe aggregators use it

**Estimated coverage:** 70-80% of recipe blogs have this data.

**Sites that definitely have it:**
- Sally's Baking Addiction ✅
- All Recipes ✅
- Food Network ✅
- Bon Appétit ✅
- Serious Eats ✅
- NYT Cooking ✅

---

## Your schema was designed FOR this

Look at the perfect 1:1 mapping:

| Schema.org field | Your DB field |
|-----------------|--------------|
| name | recipes.title |
| description | recipes.description |
| image | recipes.image_url |
| prepTime | recipes.prep_time |
| cookTime | recipes.cook_time |
| recipeYield | recipes.servings |
| recipeIngredient[] | ingredients table |
| recipeInstructions[] | instructions table |

**This is not a coincidence.** Everyone building recipe apps uses this same structure because it matches how schema.org works.

---

## What if schema.org is missing?

That's when you fall back to:
1. HTML parsing (look for `<h2>Ingredients</h2>` sections)
2. AI extraction (send cleaned HTML to AI, ask for JSON)

But for MVP, **schema.org extraction alone will work for 70-80% of recipes**, which is plenty to prove your concept.

---

## Next steps:

1. ✅ Your schema is perfect for this
2. ✅ You understand the mapping now
3. 🔄 Next: Learn how to extract schema.org from HTML (I'll show you the code)
4. 🔄 Then: Handle the fallback cases (HTML/AI)

Want me to show you the actual JavaScript/Node code to extract schema.org from a URL?
