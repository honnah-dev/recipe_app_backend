# RecipeBox - Capstone Pitch

**Developer:** [Your Name]  
**Timeline:** 18 Days (Jan 29 - Feb 15, 2026)  
**Stack:** React, Express, PostgreSQL, Node.js

---

## 30-Second Pitch

RecipeBox strips the clutter from recipe blogs. Paste any recipe URL and we extract just the ingredients and instructions—no ads, no life stories. Users organize recipes with custom boards (like "Weeknight Dinners" or "Mexican Food"), and one recipe can be in multiple boards. Clean design inspired by NYT Cooking. Built for home cooks tired of scrolling through ads.

---

## The Problem

- Recipe blogs: excessive ads, long intros, cluttered layouts
- No easy way to organize favorites across sites
- Can't find saved recipes when needed

**Existing solutions** (Paprika, AnyList) are clunky and don't prioritize beautiful UX.

---

## The Solution

1. One-click recipe import from any URL
2. Automatic extraction using schema.org (70-80% of recipe sites)
3. User-created boards for organization
4. Multi-board tagging (one recipe in multiple boards)
5. Beautiful, calm, cook-friendly design

---

## MVP Features

**Auth:** Signup, login, JWT authentication

**Recipe Import:**
- Paste URL in persistent nav bar
- Auto-extract ingredients & instructions
- Preview & edit before saving
- Assign to boards during import

**Boards:**
- Create/edit/delete custom boards
- View recipes by board
- Simple flat structure (no nesting for MVP)

**Recipe Library:**
- Grid view of all recipes
- Click card → full recipe view
- Search by title

**Recipe View (Cook Mode):**
- Large text, clean layout
- Ingredients list + step-by-step instructions
- Prep/cook time, servings
- Edit & delete

---

## Stretch Goals

- Nested boards (add "Mexican" under "Lunch")
- AI fallback for sites without schema.org
- Serving size scaling
- Search by ingredient
- PDF export
- Grocery list generator
- "Last cooked" tracking with updated_at timestamp

---

## Database Schema (4 Tables)

### users
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### boards
```sql
CREATE TABLE boards (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### recipes (with JSON columns)
```sql
CREATE TABLE recipes (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  source_url TEXT NOT NULL,
  image_url TEXT,
  prep_time INTEGER,
  cook_time INTEGER,
  servings INTEGER,
  ingredients JSONB NOT NULL,
  instructions JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### recipe_boards (many-to-many)
```sql
CREATE TABLE recipe_boards (
  recipe_id INTEGER REFERENCES recipes(id) ON DELETE CASCADE,
  board_id INTEGER REFERENCES boards(id) ON DELETE CASCADE,
  added_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (recipe_id, board_id)
);
```

**Why JSON columns?** Keeps it simple - ONE POST request to save recipe with all ingredients and instructions. PostgreSQL handles JSON automatically.

**Note:** `updated_at` removed from MVP - can be added later as stretch goal if needed for "last modified" tracking.

---

## Complete Schema File (schema.sql)

```sql
-- Drop tables in reverse order (children first, parents last)
DROP TABLE IF EXISTS recipe_boards;
DROP TABLE IF EXISTS recipes;
DROP TABLE IF EXISTS boards;
DROP TABLE IF EXISTS users;

-- USERS TABLE
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- BOARDS TABLE
CREATE TABLE boards (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- RECIPES TABLE (with JSONB columns for ingredients/instructions)
CREATE TABLE recipes (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  source_url TEXT NOT NULL,
  image_url TEXT,
  prep_time INTEGER,
  cook_time INTEGER,
  servings INTEGER,
  ingredients JSONB NOT NULL,
  instructions JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- RECIPE_BOARDS JOIN TABLE (many-to-many)
CREATE TABLE recipe_boards (
  recipe_id INTEGER REFERENCES recipes(id) ON DELETE CASCADE,
  board_id INTEGER REFERENCES boards(id) ON DELETE CASCADE,
  added_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (recipe_id, board_id)
);
```

---

## Schema Diagram (for dbdiagram.io)

```sql
Table users {
  id int [pk]
  username varchar [unique, not null]
  email varchar [unique, not null]
  password_hash varchar [not null]
  created_at timestamp
}

Table boards {
  id int [pk]
  user_id int [not null, ref: > users.id]
  name varchar [not null]
  created_at timestamp
}

Table recipes {
  id int [pk]
  user_id int [not null, ref: > users.id]
  title varchar [not null]
  description text
  source_url text [not null]
  image_url text
  prep_time int
  cook_time int
  servings int
  ingredients jsonb [not null]
  instructions jsonb [not null]
  created_at timestamp
}

Table recipe_boards {
  recipe_id int [ref: > recipes.id]
  board_id int [ref: > boards.id]
  added_at timestamp
  
  indexes {
    (recipe_id, board_id) [pk]
  }
}
```

---

## API Endpoints

**Auth:**
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login, get JWT
- `GET /api/auth/me` - Get current user

**Recipes:**
- `POST /api/recipes/import` - Import from URL
- `GET /api/recipes` - Get all user's recipes
- `GET /api/recipes/:id` - Get single recipe
- `PUT /api/recipes/:id` - Update recipe
- `DELETE /api/recipes/:id` - Delete recipe

**Boards:**
- `POST /api/boards` - Create board
- `GET /api/boards` - Get all boards
- `GET /api/boards/:id/recipes` - Get recipes in board
- `PUT /api/boards/:id` - Update board
- `DELETE /api/boards/:id` - Delete board

**Recipe-Board Assignment:**
- `POST /api/recipes/:id/boards` - Add to board(s)
- `DELETE /api/recipes/:id/boards/:boardId` - Remove from board

---

## How Recipe Import Works

**Schema.org Standard:** Most recipe blogs embed structured JSON:

```json
{
  "@type": "Recipe",
  "name": "Chocolate Chip Cookies",
  "recipeIngredient": ["2 cups flour", "1 egg"],
  "recipeInstructions": ["Mix ingredients", "Bake at 350°F"]
}
```

**Our Process:**
1. User pastes URL
2. Backend fetches HTML
3. Extract schema.org JSON-LD data
4. Parse arrays for ingredients/instructions
5. ONE INSERT saves everything to recipes table

**Example Backend Code:**
```javascript
router.post('/import', requireUser, async (req, res) => {
  const { url, boards } = req.body;
  
  // Extract recipe data from URL
  const data = await extractRecipeFromUrl(url);
  
  // ONE INSERT - save recipe with JSON arrays
  const result = await db.query(
    `INSERT INTO recipes 
     (user_id, title, description, source_url, image_url, 
      prep_time, cook_time, servings, ingredients, instructions)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
     RETURNING id`,
    [
      req.user.id,
      data.title,
      data.description,
      url,
      data.image_url,
      data.prep_time,
      data.cook_time,
      data.servings,
      JSON.stringify(data.ingredients),    // Convert to JSON
      JSON.stringify(data.instructions)    // Convert to JSON
    ]
  );
  
  // Save board assignments
  const recipeId = result.rows[0].id;
  for (let boardId of boards) {
    await db.query(
      'INSERT INTO recipe_boards (recipe_id, board_id) VALUES ($1, $2)',
      [recipeId, boardId]
    );
  }
  
  res.json({ success: true, recipeId });
});
```

**Getting recipe back:**
```javascript
const result = await db.query('SELECT * FROM recipes WHERE id = $1', [id]);
const recipe = result.rows[0];

// PostgreSQL automatically parses JSONB back to arrays
console.log(recipe.ingredients);  // ["2 cups flour", "1 egg"]
console.log(recipe.instructions); // ["Mix ingredients", "Bake"]
```

---

## User Stories

**Auth:**
- As a user, I can create an account to save recipes privately
- As a user, I can log in and stay logged in across sessions

**Import:**
- As a user, I can paste a URL and see a preview of the extracted recipe
- As a user, I can edit fields before saving if extraction isn't perfect
- As a user, I can assign the recipe to multiple boards during import

**Organization:**
- As a user, I can create custom boards to organize my recipes
- As a user, I can add one recipe to multiple boards
- As a user, I can view all recipes within a specific board

**Viewing:**
- As a user, I can browse all my recipes in a grid layout
- As a user, I can click a recipe card to view the full recipe in cook mode

**Management:**
- As a user, I can edit recipe details if I need to make changes
- As a user, I can delete recipes I no longer want
- As a user, I can rename or delete boards

---

## Wireframes (Key Screens)

**1. Login/Signup**
```
┌─────────────────────┐
│   🍳 RecipeBox      │
│   [Email]           │
│   [Password]        │
│   [Login]           │
│   [Register link]   │
└─────────────────────┘
```

**2. Navigation (persistent)**
```
┌────────────────────────────────────┐
│ 🍳 RecipeBox            [Logout]   │
│ [Paste URL...] [+ Import Recipe]  │
│ My Boards | All Recipes            │
└────────────────────────────────────┘
```

**3. Import Preview**
```
┌─────────────────────┐
│ Import Recipe       │
│ [Image]             │
│ Title: [...]        │
│ Prep: [30] Cook: 45 │
│ Ingredients:        │
│ • [...]             │
│ Instructions:       │
│ 1. [...]            │
│ Add to Boards:      │
│ ☐ Weeknight         │
│ ☐ Mexican           │
│ [Save Recipe]       │
└─────────────────────┘
```

**4. Recipe Grid**
```
┌─────────────────────┐
│ All Recipes         │
│ ┌───┐ ┌───┐ ┌───┐  │
│ │img│ │img│ │img│  │
│ └───┘ └───┘ └───┘  │
└─────────────────────┘
```

**5. Cook Mode**
```
┌─────────────────────┐
│ [← Back] [Edit]     │
│ Recipe Title        │
│ [Image]             │
│ ⏱ 30m | 🍽 4        │
│ Ingredients:        │
│ • 2 cups flour      │
│ Instructions:       │
│ 1. Mix              │
│ 2. Bake             │
│ Boards: Mexican     │
└─────────────────────┘
```

---

## Project Timeline

**Days 1-2:** Pitch approval, database setup  
**Days 3-5:** Backend (auth + recipe import + boards)  
**Days 6-7:** Frontend setup (auth pages, routing)  
**Days 8-10:** Recipe import & library UI  
**Days 11-12:** Boards management UI  
**Days 13-14:** Styling & polish (NYT Cooking aesthetic)  
**Days 15-16:** Testing & bug fixes  
**Days 17-18:** Deploy & presentation prep

---

## GitHub Projects Setup

**Columns:** Backlog | To Do | In Progress | Testing | Done

**Key Tickets:**
- **Backend:** Database schema, auth endpoints, recipe import (with schema.org parser), board CRUD, recipe-board assignments
- **Frontend:** Auth pages, import form with preview, recipe grid, single recipe view, board management UI
- **Polish:** Tailwind styling (NYT Cooking inspired), responsive design, loading states, empty states
- **Deploy:** Railway/Render backend, Vercel/Netlify frontend

---

## Tech Stack Rationale

**React:** Component-based, bootcamp standard, great for recipe cards/boards  
**Express:** Simple, flexible, works great with PostgreSQL  
**PostgreSQL:** Relational model fits perfectly, JSONB support for arrays  
**Tailwind:** Rapid styling, consistent design system, responsive utilities

---

## Risk Mitigation

**Risk:** Schema.org extraction fails on some sites  
**Solution:** Manual entry fallback, focus on popular sites (70-80% coverage), AI extraction as stretch goal

**Risk:** Running out of time for polish  
**Solution:** Strict MVP scope, Tailwind for fast styling, stretch goals truly optional

**Risk:** Complex data relationships  
**Solution:** Simplified to 4 tables with JSONB, removed `updated_at` for MVP

---

## Success Metrics

**MVP Complete When:**
- ✅ User can register/login
- ✅ User can import recipe from popular recipe site (Sally's Baking Addiction)
- ✅ User can create boards & assign recipes to multiple boards
- ✅ User can view recipes in clean cook mode
- ✅ User can edit & delete recipes
- ✅ App is deployed and accessible online

---

## Why This Project?

**Personal:** Recipe blogs are unusable due to ads. I cook regularly and this solves a daily frustration.

**Technical:** Full-stack CRUD, data extraction/parsing, JWT auth, many-to-many relationships, JSON data handling, clean UX design.

**Portfolio:** Solves real problem, demonstrates data modeling, highlights design thinking, shows ability to scope appropriately, extensible for future features.

---

## Legal & Ethical

- **Private storage** - recipes not redistributed publicly
- **Attribution** - source_url maintains link to original
- **User-initiated** - no automated scraping
- **Personal use only** - clear in terms of service
- **Respectful** - will honor takedown requests

---

## Questions for Instructor

1. Is 18 days realistic for this scope?
2. JSONB approach for ingredients/instructions acceptable?
3. Concerns with schema.org extraction method?
4. Schema structure (4 tables) appropriate for MVP?

---

**Ready to build!** 🚀
