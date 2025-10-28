# E-Commerce Frontend

A minimal, functional React + TypeScript frontend that integrates with the FastAPI e-commerce backend.

## Features

- ✅ **JWT Authentication** - Login/Register with token-based auth
- ✅ **Product Listing** - Browse all available products
- ✅ **Shopping Cart** - Add/remove items, update quantities
- ✅ **Order Placement** - Complete checkout with shipping address
- ✅ **TypeScript** - Full type safety
- ✅ **Axios** - HTTP client with JWT interceptors
- ✅ **CSS Modules** - Component-scoped styling
- ✅ **Responsive Design** - Mobile-friendly interface

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Axios** - API client
- **CSS Modules** - Styling
- **React Scripts** - Build tooling

## Prerequisites

- Node.js 16+ and npm
- FastAPI backend running on `http://localhost:8000`

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure API URL

The `.env` file is already configured to connect to the backend at `http://localhost:8000`:

```env
REACT_APP_API_BASE_URL=http://localhost:8000
```

If your backend runs on a different URL, update this file.

### 3. Start the Development Server

```bash
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000)

## Project Structure

```
ecommerce-frontend/
├── public/
│   └── index.html              # HTML template
├── src/
│   ├── components/             # React components
│   │   ├── Login/
│   │   │   ├── Login.tsx      # Login & Register form
│   │   │   └── Login.module.css
│   │   ├── Products/
│   │   │   ├── Products.tsx   # Product listing
│   │   │   └── Products.module.css
│   │   ├── Cart/
│   │   │   ├── Cart.tsx       # Shopping cart & checkout
│   │   │   └── Cart.module.css
│   │   └── Layout/
│   │       ├── Layout.tsx     # App layout & navigation
│   │       └── Layout.module.css
│   ├── services/
│   │   └── api.ts             # Axios API client
│   ├── types/
│   │   └── index.ts           # TypeScript types
│   ├── App.tsx                # Main app component
│   ├── index.tsx              # Entry point
│   └── index.css              # Global styles
├── .env                        # Environment variables
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

## Usage Guide

### 1. **Login / Register**

When you first open the app, you'll see the login screen:

- **Register**: Click "Register" tab and create a new account
- **Login**: Use your credentials to log in
- JWT token is automatically stored in localStorage

### 2. **Browse Products**

After login, you'll see the products page:

- View all available products
- See product details (name, price, stock, category)
- Add items to cart with the "Add to Cart" button

### 3. **Manage Cart**

Click "Cart" in the navigation to view your cart:

- Adjust quantities with +/- buttons
- Remove items with the × button
- View order summary with total amount

### 4. **Place Order**

In the cart view:

1. Enter your shipping address
2. Click "Place Order"
3. Order is sent to the backend API
4. Cart is cleared on success

### 5. **Logout**

Click "Logout" to sign out and return to the login screen.

## API Integration

### Authentication Flow

```typescript
// Login request (OAuth2 form data)
POST /api/auth/login
Content-Type: application/x-www-form-urlencoded
Body: username=user&password=pass

// Response
{
  "access_token": "eyJhbGc...",
  "token_type": "bearer"
}
```

The JWT token is:
- Stored in `localStorage`
- Automatically added to all API requests via Axios interceptor
- Removed on 401 errors (auto-logout)

### API Endpoints Used

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/auth/me` | Get current user | Yes |
| GET | `/api/products/` | List products | No |
| POST | `/api/orders/` | Create order | Yes |

### Axios Configuration

The API client (`src/services/api.ts`) includes:

- **Base URL**: From environment variable
- **Request Interceptor**: Adds JWT token to headers
- **Response Interceptor**: Handles 401 errors (auto-logout)
- **Type Safety**: All requests/responses are typed

```typescript
// Example: Adding to cart triggers this flow
const product = await productsAPI.getById(id);
// → GET /api/products/:id
// → Authorization: Bearer <token>
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `REACT_APP_API_BASE_URL` | `http://localhost:8000` | Backend API base URL |

## Testing the Integration

### Step 1: Start the Backend

```bash
cd ecommerce-backend
docker-compose up
```

Backend should be running on `http://localhost:8000`

### Step 2: Verify Backend is Running

Visit `http://localhost:8000/docs` - you should see the Swagger UI

### Step 3: Start the Frontend

```bash
cd ecommerce-frontend
npm install
npm start
```

Frontend opens at `http://localhost:3000`

### Step 4: Test the Flow

1. **Register** a new account
2. **Login** with your credentials
3. **Add products** to cart (if no products exist, create some via the backend API docs)
4. **Place an order** with a shipping address
5. Check the backend API or database to verify the order was created

## Creating Test Products

If there are no products in the database, create some using the backend API:

1. Go to `http://localhost:8000/docs`
2. Use `/api/auth/register` to create an account
3. Use `/api/auth/login` to get a token
4. Click "Authorize" and paste your token
5. Use `POST /api/products/` to create products

Example product:
```json
{
  "name": "Laptop",
  "description": "High-performance laptop",
  "price": 999.99,
  "stock": 10,
  "category": "Electronics"
}
```

## Building for Production

```bash
npm run build
```

This creates an optimized production build in the `build/` folder.

To serve the build:

```bash
npx serve -s build
```

## Troubleshooting

### CORS Errors

If you see CORS errors, ensure the backend has CORS enabled:

```python
# In backend app/main.py
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Connection Refused

- Verify backend is running on port 8000
- Check `.env` has correct `REACT_APP_API_BASE_URL`
- Restart frontend: `npm start`

### Login Not Working

- Check browser console for errors
- Verify backend `/api/auth/login` endpoint works in Swagger UI
- Ensure passwords meet minimum length (6 characters)

### Products Not Loading

- Verify you're logged in (token in localStorage)
- Create test products via backend API
- Check browser Network tab for API errors

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT

## Support

For issues with:
- **Frontend**: Check browser console and Network tab
- **Backend**: Check backend logs and API docs at `/docs`
- **Integration**: Verify both are running and CORS is configured