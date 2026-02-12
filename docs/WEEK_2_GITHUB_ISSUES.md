# RecipeBox - Week 2 GitHub Issues (Frontend)

Copy these into your GitHub Project on **Sunday, Feb 8**

---

## Day 9 - Friday, Feb 6 (Auth Pages)
**Labels:** `day-9`, `frontend`

### Issue 14: Auth Context & Protected Routes
**Status:** Backlog

**Tasks:**
- [ ] Set up React Router with routes (/, /login, /signup, /recipes, /recipes/:id, /boards)
- [ ] Create `context/AuthContext.jsx`:
  - Store current user state
  - Store JWT token in localStorage
  - Provide login/logout functions
  - Check for existing token on app load
- [ ] Create `components/ProtectedRoute.jsx`:
  - Wrapper component that checks if user is logged in
  - Redirects to /login if not authenticated
- [ ] Wrap protected routes with ProtectedRoute component

**Acceptance Criteria:**
- Routes are set up and working
- Auth context provides user state to entire app
- Protected routes redirect unauthenticated users to login

---

### Issue 15: Login Page
**Status:** Backlog

**Tasks:**
- [ ] Create `pages/Login.jsx`
- [ ] Build form with email and password inputs
- [ ] Add submit handler that calls POST /api/auth/login
- [ ] On success:
  - Save JWT to localStorage
  - Update AuthContext with user data
  - Redirect to /recipes
- [ ] Display error messages if login fails
- [ ] Add link to signup page
- [ ] Style with Tailwind (clean, centered form)

**Acceptance Criteria:**
- Can log in with existing account
- JWT stored and user redirected to recipes page
- Error messages display for invalid credentials
- Looks clean and professional

---

### Issue 16: Signup Page
**Status:** Backlog

**Tasks:**
- [ ] Create `pages/Signup.jsx`
- [ ] Build form with username, email, and password inputs
- [ ] Add password confirmation field
- [ ] Validate passwords match before submitting
- [ ] Call POST /api/auth/register
- [ ] On success:
  - Automatically log user in (save JWT)
  - Redirect to /recipes
- [ ] Display error messages
- [ ] Add link to login page
- [ ] Style with Tailwind

**Acceptance Criteria:**
- Can create new account
- Password validation works
- Auto-login after signup
- Error handling for duplicate email/username

---

## Day 10 - Saturday, Feb 7 (Navigation & Import Form)
**Labels:** `day-10`, `frontend`

### Issue 17: Navigation Component
**Status:** Backlog

**Tasks:**
- [ ] Create `components/Navigation.jsx`
- [ ] Add persistent URL input field (always visible)
- [ ] Add "Import Recipe" button next to URL input
- [ ] Add navigation links: "My Boards" | "All Recipes"
- [ ] Add user info and "Logout" button
- [ ] Handle logout (clear localStorage, update AuthContext, redirect to /login)
- [ ] Style with Tailwind (sticky top, clean design)
- [ ] Make responsive for mobile

**Acceptance Criteria:**
- Navigation visible on all pages after login
- URL input always accessible
- Logout works correctly
- Looks professional and matches NYT Cooking aesthetic

---

### Issue 18: Recipe Import Form with Preview
**Status:** Backlog

**Tasks:**
- [ ] Create `components/RecipeImportForm.jsx` (modal/overlay)
- [ ] On "Import Recipe" click:
  - Call POST /api/recipes/extract with URL
  - Show loading spinner
  - Display preview with extracted data
- [ ] Preview form fields (all editable):
  - Title (input)
  - Description (textarea)
  - Prep time (number input)
  - Cook time (number input)
  - Servings (number input)
  - Ingredients (list of editable inputs with "Add More" button)
  - Instructions (list of editable textareas with "Add Step" button)
  - Image preview
- [ ] Fetch and display all user's boards with checkboxes
- [ ] "Create New Board" quick-add option
- [ ] "Cancel" and "Save Recipe" buttons
- [ ] On save, call POST /api/recipes with (possibly edited) data
- [ ] Close modal and refresh recipes list

**Acceptance Criteria:**
- Can paste URL and see extracted preview
- All fields are editable
- Can select multiple boards
- Can save recipe to database
- Error handling if extraction fails

---

## Day 12 - Monday, Feb 9 (Recipe Grid)
**Labels:** `day-12`, `frontend`

### Issue 19: Recipe Card Component
**Status:** Backlog

**Tasks:**
- [ ] Create `components/RecipeCard.jsx`
- [ ] Display:
  - Recipe image (with placeholder if none)
  - Recipe title
  - Board tags (small pills/badges)
- [ ] Make entire card clickable → navigate to /recipes/:id
- [ ] Hover effect (slight shadow/scale)
- [ ] Style with Tailwind (card design, clean)
- [ ] Handle missing images gracefully

**Acceptance Criteria:**
- Card looks clean and professional
- Clickable and navigates correctly
- Shows board tags
- Responsive sizing

---

### Issue 20: All Recipes Grid Page
**Status:** Backlog

**Tasks:**
- [ ] Create `pages/RecipesGrid.jsx`
- [ ] Fetch all user's recipes on mount: GET /api/recipes
- [ ] Display in 3-column grid (2 on tablet, 1 on mobile)
- [ ] Use RecipeCard component for each recipe
- [ ] Add loading state (spinner)
- [ ] Add empty state: "No recipes yet! Import your first recipe above ↑"
- [ ] Add search input (filter by title - client-side for now)
- [ ] Style with Tailwind

**Acceptance Criteria:**
- Recipes display in clean grid
- Loading state while fetching
- Empty state for new users
- Search works
- Responsive on all screen sizes

---

## Day 13 - Tuesday, Feb 10 (Single Recipe View - Cook Mode)
**Labels:** `day-13`, `frontend`

### Issue 21: Recipe View Page (Cook Mode)
**Status:** Backlog

**Tasks:**
- [ ] Create `pages/RecipeView.jsx`
- [ ] Fetch recipe by ID: GET /api/recipes/:id
- [ ] Display in cook-friendly layout:
  - Large recipe image at top
  - Recipe title (large, bold)
  - Description
  - Prep time | Cook time | Servings (icon + number)
  - "Ingredients" heading with bulleted list
  - "Instructions" heading with numbered list
  - Board tags at bottom
- [ ] Add "Back" button (← All Recipes)
- [ ] Add "Edit" button (placeholder for now - can be stretch goal)
- [ ] Add "Delete" button with confirmation modal
- [ ] On delete:
  - Call DELETE /api/recipes/:id
  - Redirect to /recipes
- [ ] Style with NYT Cooking aesthetic:
  - Large, readable text (18px+ for body)
  - Plenty of white space
  - Clean typography
  - Print-friendly layout
- [ ] Add loading state

**Acceptance Criteria:**
- Recipe displays beautifully
- Easy to read while cooking
- Delete works with confirmation
- Back button navigates correctly
- Responsive design

---

## Day 14 - Wednesday, Feb 11 (Boards Management)
**Labels:** `day-14`, `frontend`

### Issue 22: My Boards Page
**Status:** Backlog

**Tasks:**
- [ ] Create `pages/BoardsList.jsx`
- [ ] Fetch all boards: GET /api/boards
- [ ] Display list of boards with:
  - Board name
  - Recipe count (from API or calculate client-side)
  - "View Recipes" button
  - "Rename" button
  - "Delete" button
- [ ] Add "Create New Board" button at top
- [ ] Clicking board → navigate to /boards/:id
- [ ] Style as clean list with cards
- [ ] Add empty state: "No boards yet! Create one to organize your recipes."

**Acceptance Criteria:**
- Boards display with recipe counts
- Can navigate to board detail view
- Clean, organized layout

---

### Issue 23: Create/Edit Board Modal
**Status:** Backlog

**Tasks:**
- [ ] Create `components/BoardModal.jsx` (reusable for create/edit)
- [ ] Form with board name input
- [ ] "Cancel" and "Save" buttons
- [ ] For create mode:
  - Call POST /api/boards
  - Refresh boards list
- [ ] For edit mode:
  - Pre-fill with existing name
  - Call PUT /api/boards/:id
  - Refresh boards list
- [ ] Close modal on save
- [ ] Style with Tailwind (centered overlay)

**Acceptance Criteria:**
- Can create new boards
- Can rename existing boards
- Modal closes on save/cancel
- Clean UI

---

### Issue 24: Board Detail Page (Recipes in Board)
**Status:** Backlog

**Tasks:**
- [ ] Create `pages/BoardDetail.jsx`
- [ ] Fetch recipes for board: GET /api/boards/:id/recipes
- [ ] Display board name as heading
- [ ] Show recipe count
- [ ] Display recipes in grid (reuse RecipeCard component)
- [ ] Add "Back to My Boards" button
- [ ] Add empty state: "No recipes in this board yet"
- [ ] Style consistently with RecipesGrid page

**Acceptance Criteria:**
- Shows only recipes in selected board
- Clicking recipe → goes to recipe view
- Empty state for boards with no recipes
- Navigation works correctly

---

## Day 15 - Thursday, Feb 12 (Styling & Polish)
**Labels:** `day-15`, `frontend`, `design`

### Issue 25: NYT Cooking Design System
**Status:** Backlog

**Tasks:**
- [ ] Create consistent color palette:
  - Primary: Warm neutral (beige/cream)
  - Text: Dark gray/black
  - Accent: Subtle orange or red for buttons
  - Background: Off-white
- [ ] Typography:
  - Headings: Serif font (Playfair Display or Georgia)
  - Body: Sans-serif (Inter or system default)
  - Large, readable sizes (16px minimum)
- [ ] Apply to all pages:
  - Navigation
  - Recipe cards
  - Cook mode
  - Forms
- [ ] Add transitions (hover effects, page transitions)
- [ ] Ensure consistent spacing (use Tailwind spacing scale)

**Acceptance Criteria:**
- App has cohesive design language
- Looks calm, elegant, professional
- Typography is clear and readable
- Colors are harmonious

---

### Issue 26: Responsive Design
**Status:** Backlog

**Tasks:**
- [ ] Test all pages on mobile (320px - 640px)
- [ ] Test on tablet (640px - 1024px)
- [ ] Test on desktop (1024px+)
- [ ] Fix any layout issues:
  - Recipe grid columns (3 → 2 → 1)
  - Navigation (hamburger menu on mobile?)
  - Import form (full screen on mobile)
  - Cook mode (single column on mobile)
- [ ] Ensure touch targets are large enough (44px minimum)
- [ ] Test form inputs on mobile devices

**Acceptance Criteria:**
- All pages work on mobile
- No horizontal scrolling
- Text is readable on all screen sizes
- Forms are usable on mobile

---

## Day 16 - Friday, Feb 13 (Bug Fixes & Testing)
**Labels:** `day-16`, `frontend`, `testing`

### Issue 27: End-to-End Testing & Bug Fixes
**Status:** Backlog

**Tasks:**
- [ ] Test complete user flow:
  1. Signup → Login
  2. Import recipe from URL
  3. Create boards
  4. Assign recipe to boards
  5. View recipe in cook mode
  6. Delete recipe
  7. Logout
- [ ] Test edge cases:
  - Empty states (no recipes, no boards)
  - Loading states
  - Error states (failed API calls)
  - Long recipe titles/descriptions
  - Missing images
  - Very long ingredient lists
- [ ] Fix any bugs found
- [ ] Check browser console for errors
- [ ] Test in Chrome, Firefox, Safari

**Acceptance Criteria:**
- All user flows work without errors
- Edge cases handled gracefully
- No console errors
- App feels stable and polished

---

### Issue 28: Loading & Error States
**Status:** Backlog

**Tasks:**
- [ ] Add loading spinners/skeletons for:
  - Recipe list loading
  - Single recipe loading
  - Import form (while extracting)
  - Board list loading
- [ ] Add error messages for:
  - Failed login/signup
  - Failed recipe import
  - Failed to load recipes
  - Network errors
- [ ] Create reusable components:
  - `components/Spinner.jsx`
  - `components/ErrorMessage.jsx`
  - `components/EmptyState.jsx`
- [ ] Style with Tailwind

**Acceptance Criteria:**
- User never sees blank screens
- Loading states are clear
- Error messages are helpful
- Components are reusable

---

# Week 2 Summary

**Total Issues:** 15  
**Days Covered:** 9, 10, 12, 13, 14, 15, 16 (skips Day 11 Sunday off)

**Progression:**
- Days 9-10: Auth & Navigation (login, signup, nav bar, import form)
- Days 12-13: Recipe Views (grid, single recipe, cook mode)
- Day 14: Boards Management (create, view, assign)
- Days 15-16: Polish & Testing (styling, responsive, bugs)

---

# Adding These Issues

**On Sunday, Feb 8:**
1. Copy Issue 14 description
2. In GitHub Project, click "+ Add item"
3. Paste Issue 14
4. Add labels: `day-9`, `frontend`
5. Repeat for Issues 15-28

**Or use Draft Issues for speed:**
- GitHub Projects support quick draft issues
- Add title + 1-2 sentence description
- Can expand later with full details

---

# Tips for Week 2

**Frontend moves fast!** You'll see visual progress every day which is motivating.

**Reuse components:** RecipeCard, modals, buttons - build once, use everywhere.

**Test in browser constantly:** Don't wait until Day 16 to open the app!

**Tailwind is your friend:** Use utility classes, don't write custom CSS unless necessary.

**Reference NYT Cooking:** Keep https://cooking.nytimes.com open for design inspiration.

---

**Ready to crush frontend week!** 🎨🚀
