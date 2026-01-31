# RecipeBox - Project Context for Claude

**Last Updated:** January 29, 2026  
**Developer:** [Your Name]  
**Timeline:** 18 Days (Jan 29 - Feb 16, 2026)  
**Current Day:** Day 1 (Thursday, Jan 29)

---

## Project Overview

**RecipeBox** is a personal cookbook app that extracts recipes from blog URLs and organizes them with user-created boards.

**30-Second Pitch:**  
RecipeBox strips the clutter from recipe blogs. Paste any recipe URL and we extract just the ingredients and instructions—no ads, no life stories. Users organize recipes with custom boards (like "Weeknight Dinners" or "Mexican Food"), and one recipe can be in multiple boards. Clean design inspired by NYT Cooking.

---

## Tech Stack

**Backend:**
- Express.js
- PostgreSQL with JSONB columns
- JWT authentication
- bcrypt for passwords

**Frontend:**
- React (Vite)
- Tailwind CSS
- React Router
- Axios

**Deployment:**
- Backend: Railway or Render
- Frontend: Vercel or Netlify
- Database: Railway PostgreSQL

---

## Database Schema (4 Tables - SIMPLIFIED)

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

### recipes (WITH JSON COLUMNS - CRITICAL!)
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
  ingredients JSONB NOT NULL,      -- Array stored as JSON
  instructions JSONB NOT NULL,     -- Array stored as JSON
  created_at TIMESTAMP DEFAULT NOW()
);
```

**IMPORTANT:** Ingredients and instructions are stored as JSONB arrays, NOT separate tables!

Example data:
```json
{
  "ingredients": ["2 cups flour", "1 egg", "3 tbsp sugar"],
  "instructions": ["Mix ingredients", "Bake at 350°F for 30 minutes"]
}
```

### recipe_boards (many-to-many join table)
```sql
CREATE TABLE recipe_boards (
  recipe_id INTEGER REFERENCES recipes(id) ON DELETE CASCADE,
  board_id INTEGER REFERENCES boards(id) ON DELETE CASCADE,
  added_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (recipe_id, board_id)
);
```

---

## Key Design Decisions

### Why JSONB instead of separate tables?
- **Instructor's requirement:** ONE POST request to save recipe
- Simpler for bootcamp timeline (18 days)
- PostgreSQL handles JSON automatically
- Use `JSON.stringify()` to save, PostgreSQL parses on retrieval

### Why no nested boards in MVP?
- Simpler data model (removed `parent_board_id`)
- Can add later as 15-minute enhancement
- Boards are flat tags for now

### Why no `updated_at` column?
- Removed to simplify MVP
- Can add as stretch goal if needed

---

## API Endpoints (Planned)

### Auth
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login, get JWT
- `GET /api/auth/me` - Get current user

### Recipes
- `POST /api/recipes/import` - Import from URL (accepts `boards` array)
- `GET /api/recipes` - Get all user's recipes
- `GET /api/recipes/:id` - Get single recipe
- `PUT /api/recipes/:id` - Update recipe
- `DELETE /api/recipes/:id` - Delete recipe

### Boards
- `POST /api/boards` - Create board
- `GET /api/boards` - Get all boards
- `GET /api/boards/:id/recipes` - Get recipes in board
- `PUT /api/boards/:id` - Update board
- `DELETE /api/boards/:id` - Delete board

### Recipe-Board Assignment
- `POST /api/recipes/:id/boards` - Add to board(s)
- `DELETE /api/recipes/:id/boards/:boardId` - Remove from board

---

## Backend Folder Structure

```
backend/
├── api/
│   ├── auth.js          (Day 2)
│   ├── recipes.js       (Day 3)
│   └── boards.js        (Day 7)
├── db/
│   ├── queries/
│   │   ├── users.js     (Day 2)
│   │   ├── recipes.js   (Day 3)
│   │   └── boards.js    (Day 7)
│   ├── client.js        (Day 1)
│   └── schema.sql       (Day 1)
├── middleware/
│   └── requireUser.js   (Day 2)
├── utils/
│   ├── jwt.js           (Day 2)
│   └── recipeParser.js  (Day 5-6)
├── .env
├── .gitignore
├── example.env
├── app.js
├── server.js
└── package.json
```

---

## Frontend Folder Structure (Week 2)

```
frontend/
├── src/
│   ├── components/
│   │   ├── Navigation.jsx
│   │   ├── RecipeCard.jsx
│   │   ├── RecipeImportForm.jsx
│   │   └── CreateBoardModal.jsx
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   ├── RecipesGrid.jsx
│   │   ├── RecipeView.jsx
│   │   ├── BoardsList.jsx
│   │   └── BoardDetail.jsx
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── utils/
│   │   └── api.js
│   ├── App.jsx
│   └── main.jsx
└── package.json
```

---

## Recipe Extraction (Schema.org)

### How it works:
1. User pastes URL (e.g., Sally's Baking Addiction)
2. Backend fetches HTML
3. Find `<script type="application/ld+json">` tag
4. Parse JSON and extract Recipe object
5. Map to our database schema

### Example schema.org data:
```json
{
  "@type": "Recipe",
  "name": "Chocolate Chip Cookies",
  "recipeIngredient": ["2 cups flour", "1 egg"],
  "recipeInstructions": ["Mix ingredients", "Bake at 350°F"]
}
```

### Mapping to our database:
- `name` → `recipes.title`
- `prepTime` (e.g., "PT15M") → `recipes.prep_time` (convert to 15)
- `recipeIngredient` → `recipes.ingredients` (store as JSONB)
- `recipeInstructions` → `recipes.instructions` (store as JSONB)

### Files involved:
- `utils/recipeParser.js` - extraction logic
- `api/recipes.js` - POST /import endpoint

---

## Current Progress (Day 1 - Jan 29)

**Completed:**
- [ ] Backend folder structure created
- [ ] npm initialized
- [ ] Dependencies installed (express, pg, bcrypt, jsonwebtoken, cors, dotenv)
- [ ] .gitignore created
- [ ] example.env created

**Working on:**
- Issue 1: Project Setup & Dependencies
- Next: Issue 2: Database Setup & Schema

**Not started:**
- Database creation
- Schema.sql file
- Any actual code files

---

## Development Timeline

### Week 1 (Backend): Days 1-8
- **Day 1 (Jan 29):** Setup & database
- **Day 2 (Jan 30):** Auth backend
- **Day 3 (Jan 31):** Recipe CRUD
- **Day 5 (Feb 2):** Schema.org parser pt 1
- **Day 6 (Feb 3):** Schema.org parser pt 2
- **Day 7 (Feb 4):** Boards backend
- **Day 8 (Feb 5):** Backend complete + Frontend setup

### Week 2 (Frontend): Days 9-16
- **Day 9 (Feb 6):** Auth pages
- **Day 10 (Feb 7):** Nav + Import form
- **Day 12 (Feb 9):** Recipe grid
- **Day 13 (Feb 10):** Cook mode view
- **Day 14 (Feb 11):** Boards frontend
- **Day 15 (Feb 12):** Styling
- **Day 16 (Feb 13):** Bug fixes

### Week 3 (Deploy): Days 17-19
- **Day 17 (Feb 14):** Deploy everything
- **Day 19 (Feb 16):** Demo & presentation

---

## Important Constraints

1. **18-day timeline** - scope strictly to MVP
2. **Bootcamp capstone** - needs to demo well
3. **JSONB for ingredients/instructions** - instructor's requirement for simplicity
4. **No nested boards in MVP** - can add later (15 min enhancement)
5. **Schema.org extraction only** - AI fallback is stretch goal
6. **NYT Cooking aesthetic** - clean, minimal, elegant

---

## GitHub Issues Tracking

Using GitHub Projects with columns:
- **Backlog** - Future work
- **Ready** - Today's work
- **In Progress** - Currently working
- **Done** - Completed

Adding issues weekly:
- Week 1 issues added Jan 29
- Week 2 issues added Feb 8
- Week 3 issues added Feb 15

---

## Common Questions You Might Ask Me

### "How do I create the database?"
```bash
createdb recipebox_dev
psql recipebox_dev < db/schema.sql
```

### "How do I connect to PostgreSQL?"
See `db/client.js` - use pg Pool with DATABASE_URL from .env

### "How do I save ingredients as JSONB?"
```javascript
const ingredients = ["2 cups flour", "1 egg"];
await db.query(
  'INSERT INTO recipes (ingredients) VALUES ($1)',
  [JSON.stringify(ingredients)]
);
```

### "How do I retrieve ingredients?"
```javascript
const result = await db.query('SELECT * FROM recipes WHERE id = $1', [id]);
// result.rows[0].ingredients is already parsed as array!
console.log(result.rows[0].ingredients); // ["2 cups flour", "1 egg"]
```

### "How do I parse schema.org data?"
1. Fetch HTML with `fetch()` or `axios`
2. Use regex: `html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)`
3. Parse JSON
4. Extract fields and map to our schema

### "How does multi-board assignment work?"
When importing a recipe, user selects boards [1, 2, 5]:
```javascript
// After creating recipe with id 42:
for (let boardId of selectedBoards) {
  await db.query(
    'INSERT INTO recipe_boards (recipe_id, board_id) VALUES ($1, $2)',
    [42, boardId]
  );
}
```

---

## Key Files Reference

### .env
```
PORT=3000
DATABASE_URL=postgresql://localhost/recipebox_dev
JWT_SECRET=your-random-secret-here
```

### package.json dependencies
```json
{
  "dependencies": {
    "express": "^4.18.2",
    "pg": "^8.11.0",
    "bcrypt": "^5.1.0",
    "jsonwebtoken": "^9.0.0",
    "cors": "^2.8.5",
    "dotenv": "^16.0.3"
  }
}
```

---

## What to Help Me With

I'm a bootcamp student building this as my capstone. I need help with:

1. **Writing clean, working code** - following the schema and structure above
2. **Debugging errors** - when things don't work
3. **Understanding concepts** - explain things simply
4. **Best practices** - but keep it bootcamp-appropriate (not over-engineered)
5. **Staying on schedule** - remind me to keep it simple if I'm overcomplicating

---

## What NOT to Suggest

- ❌ Changing the schema (it's approved by instructor)
- ❌ Using separate tables for ingredients/instructions (JSONB is required)
- ❌ Adding nested boards to MVP (it's a stretch goal)
- ❌ Over-engineering (I have 18 days!)
- ❌ Adding features not in the MVP list

---

## MVP Features (What I'm Building)

**Must Have:**
- User signup/login with JWT
- Import recipe from URL via schema.org extraction
- Save recipes with ingredients/instructions as JSON
- Create boards (flat, no nesting)
- Assign recipes to multiple boards
- View all recipes in grid
- View single recipe in cook mode
- Edit/delete recipes
- Beautiful NYT Cooking-inspired design

**Stretch Goals (After MVP):**
- Nested boards
- AI extraction fallback
- Serving size scaling
- Search by ingredient
- PDF export

---

## Helpful Context

- I have a design background (graphic designer)
- I'm strongest at: UX/design thinking
- I'm learning: Backend development, PostgreSQL
- Timeline: Work 5-6 hrs Tue-Sat, 3 hrs Mon, Sundays off

---

## How to Help Me Best

1. **Assume I'm at bootcamp level** - explain things clearly
2. **Give me working code examples** - I learn by doing
3. **Keep it simple** - don't over-engineer
4. **Remind me of the schema** - if I start to deviate
5. **Celebrate progress** - I'm learning a lot in 18 days!

---

**Current Status:** Day 1 in progress, working on backend setup

**Next Up:** Create database and schema.sql file

**Let's build! 🚀**
