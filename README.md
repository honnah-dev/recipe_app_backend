# RecipeBox

A Pinterest-style recipe saving app where users can import recipes from any URL, organize them into boards, and view them in a clean cook-mode layout.

![Description](docs/screenshots/homepage.png)

## Problem Statement

What problem does this solve? Have you ever wanted to simply get a recipe for pickled onions only to be bombarded by a flood of ads as well as a story about the authors's grandma's second greade teacher?! Look no further! Plug in a url and the app will extract the recipe content and display it in a clean, easy-to-read recipe card. Neatly organize recipes into your own  little reicpe box- pintrest board style!


## Features

- **Recipe Import** — Paste any recipe URL and automatically extract the title, ingredients, instructions, image, and more using JSON-LD structured data parsing
- **Editable Preview** — Review and edit extracted recipe data before saving
- **Board Organization** — Create boards (like Pinterest boards) to organize recipes by category (e.g., "Weeknight Dinners", "Desserts")
- **Search** — Filter recipes by title with a client-side search bar
- **Cook Mode** — View a single recipe in a clean, readable layout with ingredients and step-by-step instructions
- **User Authentication** — Secure registration and login with hashed passwords (bcrypt) and JWT tokens
- **Persistent Sessions** — Stay logged in across browser refreshes using localStorage

## Tech Stack

| Layer        | Technology                                      |
|------------- |-------------------------------------------------|
| Frontend     | React 19, React Router v7, Vite                |
| Backend      | Node.js, Express                                |
| Database     | PostgreSQL                                      |
| Auth         | bcrypt (password hashing), JSON Web Tokens (JWT)|
| Styling      | Custom CSS (NYT Cooking inspired)               |
| Tools        | Claude AI (development assistant), VS Code      |

## Authentication Flow Diagram
![Description](docs/screenshots/Authentication_flow_pg1.png)
![Description](docs/screenshots/Authentication_flow_pg2.png)


## Database Schema

Four tables with the following relationships:

- **users** — id, username, email, password_hash
- **boards** — id, user_id (belongs to a user), name
- **recipes** — id, user_id (belongs to a user), title, description, source_url, image_url, prep_time, cook_time, servings, ingredients (JSONB), instructions (JSONB)
- **recipe_boards** — recipe_id, board_id (many-to-many join table: a recipe can be on multiple boards)

## Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL

### Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd recipe_app
   ```

2. **Set up the database**
   ```bash
   createdb recipebox_dev
   cd recipe_app_backend
   psql -d recipebox_dev -f db/schema.sql
   ```

3. **Configure environment variables**
   ```bash
   # In recipe_app_backend/, create a .env file:
   PORT=3000
   DATABASE_URL=postgres://your_username:your_password@localhost:5432/recipebox_dev
   JWT_SECRET=your_secret_key_here
   ```

4. **Install dependencies and start the backend**
   ```bash
   cd recipe_app_backend
   npm install
   npm run dev
   ```

5. **Install dependencies and start the frontend**
   ```bash
   cd recipe_app_frontend
   npm install
   npm run dev
   ```

6. **Open in browser** — Visit `http://localhost:5173`

## Wireframes

![Description](docs/screenshots/wireframes.png)


## References and Acknowledgments


- **BookBuddy project** — Referenced frontend including React Router setup, form handling with controlled inputs, and the AuthContext pattern for managing login state
- **PT Market project** — Referenced for backend patterns including Express route structure, middleware setup, and PostgreSQL query organization
- **Secure Authentication System project** — Referenced JWT authentication flow, bcrypt password hashing, and the token-based auth middleware pattern
- **Claude AI** — Used as a development assistant throughout the project for code generation, debugging, and learning React concepts.
- **NYT Cooking** — Visual design inspiration for the CSS styling (color palette, typography, card layouts)


   Through this project I got to better undertand Authentication, JWT flow. React State- useState, useEffect AuthContext +localstorage to be specific. Learned more about Frontend to Backend communication. Biggest learning curve was understanding Web Scraping- recipe Parser- parses JSON-LD schema.org data from external recipe sites- handing different types- @graph wrappers, @type as string or array. About 80% of recipe blogs use JSON-LD format- the next phase will support microdata or RDFa formats, as well as AI extraction. Had to debug with regex- made quote optional, switched to matchAll(), added array check. I learned a bit more about nesting routes as well.

## Future Improvements

- Loading spinner for data fetching states
- Drag and drop recipe ordering within boards
- Image upload for custom recipe photos
- Edit recipe functionality
- Delete and edit board buttons
- Board cover images and recipe count badges
- Duplicate recipe detection
- Tags and categories for recipes

### Parser Enhancements
Currently the recipe parser only supports sites that use the JSON-LD format (about 80% of recipe blogs). Future enhancements include:
- Add microdata parsing for sites like Smitten Kitchen that don't use JSON-LD
- HTML scraping fallback for sites without any schema.org structured data
- AI-powered extraction to read and extract recipes from any webpage regardless of format

---

## Backend Template Notes (from Fullstack)

This repository was bootstrapped from a Fullstack template that comes with a `users` table as well as routes to register and login.

1. Change the name of the package in `package.json`.
2. Change the database name from `foobar` in the `db:schema` script.
3. Update the environment variables in `example.env` and rename the file to `.env`.
