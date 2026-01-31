# RecipeBox - Week 1 GitHub Issues

Copy these into your GitHub Project as "Add item" (Draft issues work great!)

---

## Day 1 - Thursday, Jan 29 (Setup & Database)
**Labels:** `day-1`, `backend`, `database`

### Issue 1: Project Setup & Dependencies
**Status:** Ready

**Tasks:**
- [ ] Create backend folder structure
- [ ] Run `npm init -y`
- [ ] Install dependencies: `express pg bcrypt jsonwebtoken cors dotenv`
- [ ] Create `.gitignore` (include `node_modules`, `.env`)
- [ ] Create `example.env` with template variables

**Acceptance Criteria:**
- Backend folder initialized
- Dependencies installed
- Ready to write code

---

### Issue 2: Database Setup & Schema
**Status:** Ready

**Tasks:**
- [ ] Install PostgreSQL locally (if not already)
- [ ] Create database: `createdb recipebox_dev`
- [ ] Create `db/schema.sql` file with all 4 tables
- [ ] Run schema: `psql recipebox_dev < db/schema.sql`
- [ ] Verify tables exist: `psql recipebox_dev -c "\dt"`

**Acceptance Criteria:**
- Database exists with 4 tables: users, boards, recipes, recipe_boards
- Can connect to database

---

### Issue 3: Test Database Connection
**Status:** Ready

**Tasks:**
- [ ] Create `db/client.js` with pg Pool connection
- [ ] Create simple test file to query database
- [ ] Run test and verify connection works

**Acceptance Criteria:**
- Can successfully query database from Node.js
- No connection errors

---

## Day 2 - Friday, Jan 30 (Auth Backend)
**Labels:** `day-2`, `backend`

### Issue 4: JWT Utils & User Queries
**Status:** Backlog

**Tasks:**
- [ ] Create `utils/jwt.js` with `createToken()` and `verifyToken()` functions
- [ ] Create `db/queries/users.js` with:
  - `createUser(username, email, password_hash)`
  - `getUserByEmail(email)`
  - `getUserById(id)`

**Acceptance Criteria:**
- Can generate and verify JWT tokens
- Can query users table

---

### Issue 5: Auth API Endpoints
**Status:** Backlog

**Tasks:**
- [ ] Create `api/auth.js` router
- [ ] POST `/api/auth/register` endpoint (hash password with bcrypt)
- [ ] POST `/api/auth/login` endpoint (verify password, return JWT)
- [ ] GET `/api/auth/me` endpoint (return current user)
- [ ] Create `middleware/requireUser.js` to verify JWT

**Acceptance Criteria:**
- Can register new user via Thunder Client/Postman
- Can login and receive JWT token
- Can get current user with valid token

---

## Day 3 - Saturday, Jan 31 (Recipe CRUD)
**Labels:** `day-3`, `backend`

### Issue 6: Recipe Database Queries
**Status:** Backlog

**Tasks:**
- [ ] Create `db/queries/recipes.js` with:
  - `createRecipe(userId, recipeData)` - handles JSONB for ingredients/instructions
  - `getAllUserRecipes(userId)`
  - `getRecipeById(recipeId, userId)`
  - `updateRecipe(recipeId, userId, updates)`
  - `deleteRecipe(recipeId, userId)`

**Acceptance Criteria:**
- All recipe queries work
- JSONB columns properly handled with JSON.stringify()

---

### Issue 7: Recipe API Endpoints
**Status:** Backlog

**Tasks:**
- [ ] Create `api/recipes.js` router
- [ ] POST `/api/recipes/import` (manual data for now, no URL parsing yet)
- [ ] GET `/api/recipes` (all user recipes)
- [ ] GET `/api/recipes/:id` (single recipe)
- [ ] PUT `/api/recipes/:id` (update recipe)
- [ ] DELETE `/api/recipes/:id` (delete recipe)

**Acceptance Criteria:**
- Can manually create recipe with JSON arrays
- Can retrieve, update, delete recipes
- All endpoints tested with Thunder Client

---

## Day 5 - Monday, Feb 2 (Schema.org Parser - Part 1)
**Labels:** `day-5`, `backend`

### Issue 8: Recipe Parser Foundation
**Status:** Backlog

**Tasks:**
- [ ] Create `utils/recipeParser.js`
- [ ] Write `extractRecipeFromUrl(url)` function:
  - Fetch HTML from URL
  - Find `<script type="application/ld+json">` tags
  - Parse JSON and find Recipe object
- [ ] Write helper functions:
  - `parseTime(duration)` - convert "PT15M" to 15
  - `parseServings(yieldString)` - extract number from "24 cookies"

**Acceptance Criteria:**
- Can fetch a URL and find schema.org data
- Returns structured recipe object

---

## Day 6 - Tuesday, Feb 3 (Schema.org Parser - Part 2)
**Labels:** `day-6`, `backend`

### Issue 9: Recipe Parser Testing & Integration
**Status:** Backlog

**Tasks:**
- [ ] Update POST `/api/recipes/import` to use `extractRecipeFromUrl()`
- [ ] Test with real URLs:
  - https://sallysbakingaddiction.com/christmas-sugar-cookies/
  - https://www.allrecipes.com/ (any recipe)
  - https://www.foodnetwork.com/ (any recipe)
- [ ] Handle edge cases (missing data, different formats)
- [ ] Add error handling for failed extractions

**Acceptance Criteria:**
- Can import real recipes from popular sites
- Gracefully handles extraction failures
- Returns clean error messages

---

## Day 7 - Wednesday, Feb 4 (Boards Backend)
**Labels:** `day-7`, `backend`

### Issue 10: Board Queries
**Status:** Backlog

**Tasks:**
- [ ] Create `db/queries/boards.js` with:
  - `createBoard(userId, name)`
  - `getAllUserBoards(userId)`
  - `updateBoard(boardId, userId, name)`
  - `deleteBoard(boardId, userId)`

**Acceptance Criteria:**
- All board queries work
- Can CRUD boards

---

### Issue 11: Board API Endpoints
**Status:** Backlog

**Tasks:**
- [ ] Create `api/boards.js` router
- [ ] POST `/api/boards` (create board)
- [ ] GET `/api/boards` (all user boards)
- [ ] PUT `/api/boards/:id` (update board name)
- [ ] DELETE `/api/boards/:id` (delete board)

**Acceptance Criteria:**
- Can manage boards via API
- Tested with Thunder Client

---

## Day 8 - Thursday, Feb 5 (Recipe-Board Assignment & Frontend Setup)
**Labels:** `day-8`, `backend`, `frontend`

### Issue 12: Recipe-Board Assignment
**Status:** Backlog

**Tasks:**
- [ ] Add to `db/queries/recipes.js`:
  - `assignRecipeToBoards(recipeId, boardIds)` - insert into recipe_boards
  - `getRecipesByBoard(boardId, userId)`
  - `removeRecipeFromBoard(recipeId, boardId)`
- [ ] Update POST `/api/recipes/import` to accept `boards: [1, 2, 3]` array
- [ ] Create GET `/api/boards/:id/recipes` endpoint

**Acceptance Criteria:**
- Can assign recipe to multiple boards during import
- Can view recipes filtered by board
- Full backend MVP complete!

---

### Issue 13: Frontend Project Setup
**Status:** Backlog

**Tasks:**
- [ ] Create React app: `npm create vite@latest frontend -- --template react`
- [ ] Install dependencies: `npm install react-router-dom axios`
- [ ] Install Tailwind: `npm install -D tailwindcss postcss autoprefixer`
- [ ] Configure Tailwind (`tailwind.config.js`)
- [ ] Create folder structure:
  ```
  src/
    components/
    pages/
    context/
    utils/
    App.jsx
  ```

**Acceptance Criteria:**
- React app runs
- Tailwind working
- Folder structure ready

---

# Week 1 Summary

**Total Issues:** 13  
**Days Covered:** 1, 2, 3, 5, 6, 7, 8 (skips Day 4 Sunday off)

**How to use:**
1. Add all 13 issues to your project TODAY
2. Move Issue 1-3 to "Ready" column (Day 1 tasks)
3. Keep rest in "Backlog"
4. Each morning, move that day's issues to "Ready"
5. As you work, drag to "In Progress"
6. When done, drag to "Done"

---

# When to Add Week 2 Issues?

**Add Week 2 issues on Sunday, Feb 8** (your day off)

Spend 30 minutes creating issues for Days 9-16 (frontend week)

---

# When to Add Week 3 Issues?

**Add Week 3 issues on Sunday, Feb 15** (your day off)

Create issues for Days 17-19 (deployment & presentation)

---

# Pro Tips:

1. **Use Draft Issues** - GitHub Projects lets you add quick drafts without full issue creation
2. **Copy these descriptions** - paste directly into GitHub issue description
3. **Check off tasks** - as you complete each checkbox in the issue
4. **Close issues** - when fully done (moves to "Done" automatically if configured)
5. **Add notes** - comment on issues if you hit blockers or want to remember something

---

# Labels to Create in Your Repo:

Go to your repo → Issues → Labels → New Label

Create these:
- `day-1` through `day-19` (blue color)
- `backend` (red)
- `frontend` (green)  
- `database` (purple)
- `deployment` (yellow)
- `bug` (default red)
- `blocked` (default yellow - for when you're stuck)

---

This keeps it manageable! You're only looking at ~13 issues for Week 1, not 50+ for the whole project.
