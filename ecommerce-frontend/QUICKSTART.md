# Quick Start Guide - E-Commerce Frontend

## 📁 Complete Directory Structure

```
ecommerce-frontend/
├── public/
│   └── index.html                          # HTML template
├── src/
│   ├── components/
│   │   ├── Login/
│   │   │   ├── Login.tsx                  # Login/Register component
│   │   │   ├── Login.module.css           # Login styles
│   │   │   └── index.ts                   # Export
│   │   ├── Products/
│   │   │   ├── Products.tsx               # Product listing component
│   │   │   ├── Products.module.css        # Product styles
│   │   │   └── index.ts                   # Export
│   │   ├── Cart/
│   │   │   ├── Cart.tsx                   # Shopping cart component
│   │   │   ├── Cart.module.css            # Cart styles
│   │   │   └── index.ts                   # Export
│   │   └── Layout/
│   │       ├── Layout.tsx                 # App layout & navigation
│   │       ├── Layout.module.css          # Layout styles
│   │       └── index.ts                   # Export
│   ├── services/
│   │   └── api.ts                         # Axios API client with interceptors
│   ├── types/
│   │   └── index.ts                       # TypeScript type definitions
│   ├── App.tsx                            # Main app component
│   ├── index.tsx                          # React entry point
│   ├── index.css                          # Global styles
│   └── react-app-env.d.ts                 # React TypeScript declarations
├── .env                                    # Environment variables
├── .gitignore                             # Git ignore rules
├── package.json                           # Dependencies & scripts
├── tsconfig.json                          # TypeScript configuration
└── README.md                              # Full documentation
```

## 🚀 Super Quick Start (3 Steps)

### Step 1: Install Dependencies
```bash
cd ecommerce-frontend
npm install
```

### Step 2: Ensure Backend is Running
```bash
# In another terminal
cd ecommerce-backend
docker-compose up
```

Backend should be accessible at: http://localhost:8000

### Step 3: Start Frontend
```bash
npm start
```

Frontend opens at: http://localhost:3000

## ✅ Verify Everything Works

1. **Backend Check**: Visit http://localhost:8000/docs - should see Swagger UI
2. **Frontend Check**: Visit http://localhost:3000 - should see login screen
3. **Test Flow**:
   - Click "Register" tab
   - Create account: username `testuser`, email `test@example.com`, password `password123`
   - Login automatically happens
   - You should see the products page

## 🔧 If No Products Show Up

Create test products via backend API:

1. Go to http://localhost:8000/docs
2. Find `POST /api/products/` endpoint
3. Click "Try it out"
4. Use this JSON:
```json
{
  "name": "Wireless Headphones",
  "description": "Premium noise-cancelling headphones",
  "price": 299.99,
  "stock": 15,
  "category": "Electronics"
}
```
5. Click "Execute"
6. Refresh frontend - products should appear

## 🎯 Testing the Full Flow

1. **Register/Login** ✅
   - Create account or login
   - JWT token stored in localStorage

2. **Browse Products** ✅
   - See all products
   - View details, prices, stock

3. **Add to Cart** ✅
   - Click "Add to Cart" on products
   - Cart badge updates in navigation

4. **View Cart** ✅
   - Click "Cart" in navigation
   - See all items
   - Adjust quantities with +/-
   - Remove items with ×

5. **Place Order** ✅
   - Enter shipping address
   - Click "Place Order"
   - Order sent to backend
   - Cart cleared on success

6. **Logout** ✅
   - Click "Logout"
   - Returns to login screen

## 📡 API Endpoints Used

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/auth/register` | POST | Register new user |
| `/api/auth/login` | POST | Login (get JWT token) |
| `/api/products/` | GET | List all products |
| `/api/orders/` | POST | Create new order |

## 🛠️ Available Scripts

```bash
npm start          # Start development server (port 3000)
npm run build      # Build for production
npm test           # Run tests
```

## 🔍 Troubleshooting

### Problem: CORS Errors
**Solution**: Backend CORS is already configured, but verify backend is running on port 8000

### Problem: "Cannot connect to backend"
**Solution**: 
1. Check backend is running: `docker-compose ps`
2. Verify `.env` has: `REACT_APP_API_BASE_URL=http://localhost:8000`
3. Restart frontend: `npm start`

### Problem: Login fails
**Solution**:
1. Check browser console for errors
2. Verify password is at least 6 characters
3. Test login via Swagger UI first: http://localhost:8000/docs

### Problem: Products page is empty
**Solution**: Create test products via backend API (see section above)

## 🎨 Key Features Implemented

- ✅ JWT Authentication with auto-login
- ✅ Protected routes (auto-redirect if not logged in)
- ✅ Axios interceptors for automatic token injection
- ✅ Auto-logout on 401 errors
- ✅ LocalStorage persistence for cart
- ✅ TypeScript for full type safety
- ✅ CSS Modules for scoped styling
- ✅ Responsive design
- ✅ Loading states
- ✅ Error handling
- ✅ Form validation

## 📦 Dependencies Installed

```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "axios": "^1.6.2",
  "typescript": "^4.9.5",
  "@types/react": "^18.2.43",
  "@types/react-dom": "^18.2.17"
}
```

## 🌟 Project Highlights

- **Minimal but Complete**: Everything you need, nothing you don't
- **Production Ready**: Proper error handling, loading states, validation
- **Type Safe**: Full TypeScript coverage
- **Well Structured**: Clear separation of concerns
- **Easy to Extend**: Modular component architecture
- **No External UI Library**: Pure CSS with modules

## 📖 Next Steps

1. **Customize Styling**: Edit `.module.css` files
2. **Add Features**: Extend components in `src/components/`
3. **More API Endpoints**: Add to `src/services/api.ts`
4. **Deploy**: Run `npm run build` and deploy `build/` folder

## 🤝 Integration with Backend

This frontend is specifically designed to work with the FastAPI backend:

- **Backend Port**: 8000
- **Frontend Port**: 3000
- **Authentication**: OAuth2 with JWT
- **CORS**: Enabled in backend for localhost:3000
- **Data Format**: JSON for all requests/responses

Both projects work together out of the box! 🎉