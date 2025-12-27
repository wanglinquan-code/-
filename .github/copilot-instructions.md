# Copilot Instructions for E-Commerce Shopping Mall System

## Project Overview
A full-stack e-commerce platform with **front-end/back-end separation** architecture. Frontend (JavaScript + Webpack) at port 8080, backend (Express.js) at port 3001. Uses JWT for authentication, localStorage for cart persistence, and MySQL for data storage.

## Architecture

### Backend Structure (Express.js)
- **Entry**: [backend/server.js](../backend/server.js) - Initializes tables, CORS middleware, route mounting
- **Routes**: 
  - [backend/routes/auth.js](../backend/routes/auth.js) - Register/login with JWT token generation (JWT_SECRET: 'your_jwt_secret_123456')
  - [backend/routes/products.js](../backend/routes/products.js) - GET all products, search by keyword
- **Models**:
  - [backend/models/User.js](../backend/models/User.js) - User CRUD, password hashing with bcrypt
  - [backend/models/Product.js](../backend/models/Product.js) - Product queries via MySQL
- **Database**: [backend/db.js](../backend/db.js) - MySQL connection pool (host: localhost, user: root, password: '1234', db: shopping_db)

### Frontend Structure (Vanilla JS + Webpack)
- **Entry**: [frontend/src/main.js](../frontend/src/main.js) - Hash-based router with protected route logic (checkout requires login)
- **API Layer**: [frontend/src/services/api.js](../frontend/src/services/api.js) - Fetch wrapper, stores token/user in localStorage
- **Pages**: ProductsPage, CartPage, CheckoutPage, LoginPage, RegisterPage, SearchPage
- **Components**: Header (cart count badge), SearchBar, ProductList, ProductItem, CartItem
- **State Management**: Client-side only - cart stored in localStorage as 'cart' key

## Key Patterns & Conventions

### Authentication Flow
1. User registers/logs in → backend returns JWT token
2. Token stored in localStorage as 'token' key
3. Token used for protected endpoints (checkout page redirects to login if missing)
4. JWT verified on backend via middleware (implement if adding protected routes)

### Cart Persistence
- Cart stored in **localStorage** as JSON array: `localStorage.setItem('cart', JSON.stringify(items))`
- CartPage **must** call `mount()` after DOM creation (critical: see [frontend/src/main.js line 40-41](../frontend/src/main.js#L40-L41))
- Cart structure: `[{ productId, name, price, quantity }, ...]`

### Database Schema
**users table**: id, username (UNIQUE), password (hashed), created_at
**products table**: id, name, price, imageUrl, description, created_at
Note: No orders/order_items tables yet - current design treats checkout as order submission only

### API Conventions
- Base URL: `http://localhost:3001/api`
- Auth endpoints: `/api/auth/register`, `/api/auth/login`
- Product endpoints: `/api/products`, `/api/products/search?keyword=...`
- Response format: `{ token, user, message, error }` - always check response.ok before JSON parsing

## Critical Developer Workflows

### Running Locally
1. **Backend**: `cd backend && npm install && npm start` (port 3001)
2. **Frontend**: `cd frontend && npm install && npm run dev` (webpack-dev-server on port 8080)
3. **Database**: Create MySQL database `shopping_db` with root password '1234' - server.js auto-creates tables on startup

### Adding New Features
- **New API endpoint**: Add route to [backend/routes/](../backend/routes/) and model method to [backend/models/](../backend/models/)
- **New page**: Create in [frontend/src/pages/](../frontend/src/pages/), register in App.routes hash in main.js
- **New component**: Create in [frontend/src/components/](../frontend/src/components/), import into page
- **API integration**: Use [frontend/src/services/api.js](../frontend/src/services/api.js) export pattern (async function, error handling, localStorage for sensitive data)

### Component Lifecycle
Components are stateless functions; pages initialize state via constructors and localStorage. Always:
1. `createElement()` - returns DOM element
2. `mount()` (if needed) - loads data after DOM attached to prevent localStorage access timing issues
3. Event binding in `bindEvents()` or inline in createElement

## Project Specifics

### Tech Stack
- **Frontend**: Vanilla JavaScript, Webpack 5, Babel, no framework (intentional - graduation project)
- **Backend**: Express.js, mysql2/promise, bcrypt, jsonwebtoken, CORS
- **Database**: MySQL 8.0+
- **Authentication**: JWT (24h expiry), bcrypt password hashing

### File Organization
- Keep models thin (DB queries only) - business logic in routes
- Frontend styles embedded in components or [frontend/src/styles/main.css](../frontend/src/styles/main.css)
- Use consistent error handling: try/catch in async functions, return error JSON objects

### Known Limitations
- No order persistence (orders not saved after checkout)
- No admin authentication (all users access same product list)
- No inventory management/stock checking
- Frontend localStorage has size/privacy limitations for production

## Next Steps for Contributors
When implementing new features, verify:
- JWT token expiry handled gracefully (redirect to login if 401)
- localStorage.getItem() called only after DOM ready (use mount method)
- Database schema changes documented in server.js initDB()
- API responses match frontend fetch handlers (check api.js for expected structure)
