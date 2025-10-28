# E-Commerce Frontend Architecture

## 🏗️ Application Flow

```
┌─────────────────────────────────────────────────────────────┐
│                     Browser (localhost:3000)                 │
│                                                              │
│  ┌────────────────────────────────────────────────────┐   │
│  │                    App.tsx                          │   │
│  │  (State: isAuthenticated, cart, currentView)       │   │
│  └───────────────┬────────────────────────────────────┘   │
│                  │                                           │
│     ┌────────────┴──────────────┐                          │
│     │                            │                          │
│     ▼                            ▼                          │
│  ┌──────────┐            ┌──────────────┐                 │
│  │  Login   │            │   Layout     │                 │
│  │          │            │  (Header +   │                 │
│  │ Register │            │  Navigation) │                 │
│  └──────────┘            └──────┬───────┘                 │
│                                  │                          │
│                       ┌──────────┴──────────┐              │
│                       │                     │              │
│                       ▼                     ▼              │
│               ┌──────────────┐      ┌──────────────┐      │
│               │   Products   │      │     Cart     │      │
│               │   (Browse)   │      │  (Checkout)  │      │
│               └──────────────┘      └──────────────┘      │
│                                                              │
└──────────────────────┬───────────────────────────────────┘
                       │
                       │ Axios (JWT Token)
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              FastAPI Backend (localhost:8000)                │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │     Auth     │  │   Products   │  │    Orders    │    │
│  │   /api/auth  │  │ /api/products│  │ /api/orders  │    │
│  └──────────────┘  └──────────────┘  └──────────────┘    │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │            PostgreSQL Database                        │  │
│  │  Tables: users, products, orders                     │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## 🔐 Authentication Flow

```
1. User Registration/Login
   ┌─────────┐
   │  Login  │ ─── POST /api/auth/login ──→ Backend
   │Component│                                   │
   └────┬────┘                                   │
        │         ← JWT Token ──────────────────┘
        │
        ├─ Store token in localStorage
        │
        └─ Set isAuthenticated = true

2. Authenticated Requests
   ┌──────────────┐
   │  API Request │ ─── GET /api/products/ ──→ Backend
   │              │    (Header: Bearer <token>)
   └──────────────┘

3. Token Interceptor (Automatic)
   Every API request:
   ├─ Axios interceptor adds token to header
   ├─ If 401 error → Clear token → Redirect to login
   └─ If success → Return data
```

## 🛒 Shopping Flow

```
1. Browse Products
   Products.tsx → GET /api/products/
   ↓
   Display product grid

2. Add to Cart
   User clicks "Add to Cart"
   ↓
   Update local state (cart array)
   ↓
   Save to localStorage
   ↓
   Show badge on Cart button

3. View Cart
   Cart.tsx → Display cart items
   ↓
   User can adjust quantities
   ↓
   Calculate total

4. Place Order
   User enters shipping address
   ↓
   POST /api/orders/ {items, address}
   ↓
   Backend validates & creates order
   ↓
   Frontend clears cart on success
```

## 📦 Component Hierarchy

```
App
├── Login (unauthenticated)
│   ├── Login Form
│   └── Register Form
│
└── Layout (authenticated)
    ├── Header
    │   ├── Logo
    │   ├── Navigation (Products/Cart)
    │   └── Logout Button
    │
    └── Main Content
        ├── Products View
        │   └── Product Cards
        │       ├── Image
        │       ├── Details
        │       └── Add to Cart Button
        │
        └── Cart View
            ├── Cart Items
            │   ├── Item Details
            │   ├── Quantity Controls
            │   └── Remove Button
            │
            └── Order Summary
                ├── Total
                ├── Shipping Address
                └── Place Order Button
```

## 🔄 State Management

```
App.tsx (Main State)
├── isAuthenticated: boolean
├── currentView: 'products' | 'cart'
└── cart: CartItem[]
    └── { product: Product, quantity: number }

LocalStorage Persistence
├── access_token (JWT)
└── cart (serialized JSON)

Components receive:
├── State via props
└── Update functions via callbacks
```

## 🎨 Styling Architecture

```
CSS Modules (Component-scoped)
├── Login.module.css      → .loginContainer, .form, etc.
├── Products.module.css   → .productCard, .price, etc.
├── Cart.module.css       → .cartItem, .checkout, etc.
└── Layout.module.css     → .header, .nav, etc.

Global Styles
└── index.css             → body, root, reset

Benefits:
├── No style conflicts
├── Automatic class name hashing
└── TypeScript support
```

## 📡 API Client Architecture

```
src/services/api.ts

axios instance
├── baseURL: process.env.REACT_APP_API_BASE_URL
├── Request Interceptor
│   └── Add Bearer token to all requests
│
└── Response Interceptor
    └── Handle 401 → Logout

Export APIs:
├── authAPI
│   ├── login()
│   ├── register()
│   └── getCurrentUser()
│
├── productsAPI
│   ├── getAll()
│   └── getById()
│
└── ordersAPI
    ├── create()
    ├── getAll()
    └── getById()
```

## 🔍 Type Safety Flow

```
types/index.ts (Source of Truth)
├── User
├── Product
├── Order
├── CartItem
└── Request/Response types

Used by:
├── Components (props typing)
├── API client (request/response)
├── State (type checking)
└── Forms (validation)

Benefits:
├── Compile-time type checking
├── IntelliSense support
├── Prevents runtime errors
└── Self-documenting code
```

## 🚀 Development Workflow

```
1. Install
   npm install

2. Development
   npm start
   ↓
   webpack-dev-server starts
   ↓
   Opens localhost:3000
   ↓
   Hot reload on file changes

3. Build
   npm run build
   ↓
   Creates optimized bundle
   ↓
   Output: build/ folder
   ↓
   Ready for deployment
```

## ⚡ Performance Features

- ✅ Code splitting (React.lazy if needed)
- ✅ CSS modules (no global pollution)
- ✅ Production build optimization
- ✅ LocalStorage caching (cart, token)
- ✅ Minimal dependencies
- ✅ No heavy UI libraries

## 🔒 Security Features

- ✅ JWT token in localStorage (httpOnly not possible in SPA)
- ✅ Automatic token expiration handling
- ✅ Auto-logout on 401
- ✅ CORS protection (backend)
- ✅ Password minimum length validation
- ✅ XSS protection (React escapes by default)

## 📱 Responsive Design

All components are responsive:
- Desktop: Grid layouts, multi-column
- Tablet: Adjusted grid, stacked layout
- Mobile: Single column, touch-friendly buttons

Media queries in CSS modules handle breakpoints.