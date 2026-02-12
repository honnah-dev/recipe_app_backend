# Authentication Flow

## Overview

RecipeBox uses JWT (JSON Web Token) authentication. Passwords are hashed with bcrypt before storage. Tokens are stored in localStorage so users stay logged in across browser refreshes.

## Flow Diagram

```mermaid
sequenceDiagram
    participant User
    participant React as React Frontend
    participant LS as localStorage
    participant Express as Express Backend
    participant DB as PostgreSQL

    Note over User,DB: === REGISTER FLOW ===

    User->>React: Fills out register form (username, email, password)
    React->>Express: POST /auth/register {username, email, password}
    Express->>Express: requireBody middleware validates fields
    Express->>Express: bcrypt.hash(password, 10) creates password hash
    Express->>DB: INSERT INTO users (username, email, password_hash)
    DB-->>Express: Returns new user row
    Express->>Express: jwt.sign({id: user.id}, SECRET, {expiresIn: "7d"})
    Express-->>React: 201 {token, user: {id, username, email}}
    React->>LS: localStorage.setItem("token", token)
    React->>LS: localStorage.setItem("user", JSON.stringify(user))
    React->>React: AuthContext updates state (setToken, setUser)
    React->>User: Redirects to /boards

    Note over User,DB: === LOGIN FLOW ===

    User->>React: Fills out login form (email, password)
    React->>Express: POST /auth/login {email, password}
    Express->>Express: requireBody middleware validates fields
    Express->>DB: SELECT * FROM users WHERE email = $1
    DB-->>Express: Returns user row (with password_hash)
    Express->>Express: bcrypt.compare(password, user.password_hash)
    alt Password matches
        Express->>Express: jwt.sign({id: user.id}, SECRET, {expiresIn: "7d"})
        Express-->>React: 200 {token, user: {id, username, email}}
        React->>LS: localStorage.setItem("token", token)
        React->>LS: localStorage.setItem("user", JSON.stringify(user))
        React->>User: Redirects to /boards
    else Password does not match
        Express-->>React: 401 "Invalid email or password."
        React->>User: Displays error message
    end

    Note over User,DB: === PROTECTED REQUEST FLOW ===

    User->>React: Navigates to a protected page (e.g. /recipes)
    React->>React: ProtectedRoute checks: does token exist?
    alt No token
        React->>User: Redirects to /login
    else Token exists
        React->>Express: GET /recipes (Header: Authorization: Bearer <token>)
        Express->>Express: getUserFromToken middleware extracts token
        Express->>Express: jwt.verify(token, SECRET) returns {id}
        Express->>DB: SELECT * FROM users WHERE id = $1
        DB-->>Express: Returns user, attaches to req.user
        Express->>Express: requireUser middleware checks req.user exists
        Express->>DB: SELECT * FROM recipes WHERE user_id = $1
        DB-->>Express: Returns user's recipes
        Express-->>React: 200 [recipes array]
        React->>User: Displays recipes
    end

    Note over User,DB: === LOGOUT FLOW (client-side only) ===

    User->>React: Clicks "Log out" button in Navbar
    React->>LS: localStorage.removeItem("token")
    React->>LS: localStorage.removeItem("user")
    React->>React: AuthContext sets token=null, user=null
    React->>React: ProtectedRoute detects no token
    React->>User: Redirects to /login

    Note over User,DB: === PAGE REFRESH (session persistence) ===

    User->>React: Refreshes browser
    React->>LS: localStorage.getItem("token")
    React->>LS: localStorage.getItem("user")
    React->>React: AuthContext initializes with saved token and user
    React->>User: User remains logged in
```

## Key Files

| File | Role |
|------|------|
| `frontend/src/api/auth.js` | loginUser() and registerUser() — makes fetch calls to backend |
| `frontend/src/auth/AuthContext.jsx` | Stores token + user in React state and localStorage |
| `frontend/src/auth/ProtectedRoute.jsx` | Redirects to /login if no token exists |
| `backend/api/auth.js` | POST /auth/register and POST /auth/login route handlers |
| `backend/middleware/getUserFromToken.js` | Extracts JWT from Authorization header on every request |
| `backend/middleware/requireUser.js` | Blocks request with 401 if no user is attached |
| `backend/utils/jwt.js` | createToken() and verifyToken() wrappers around jsonwebtoken |
| `backend/db/queries/users.js` | createUser() with bcrypt hash, getUserByEmailAndPassword() with bcrypt compare |
