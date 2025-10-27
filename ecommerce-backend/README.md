# E-commerce Backend API

A complete, production-ready FastAPI e-commerce backend with authentication, CRUD operations, and PostgreSQL integration.

## Features

- 🔐 **JWT Authentication** - Secure user registration and login
- 👤 **User Management** - Complete user account management
- 📦 **Products CRUD** - Create, Read, Update, Delete products
- 🛒 **Order Management** - Place orders, track status, manage inventory
- 🗄️ **PostgreSQL Database** - Robust relational database with SQLAlchemy ORM
- ✅ **Data Validation** - Pydantic models for request/response validation
- 🐳 **Docker Support** - Containerized app and database
- 🧪 **Comprehensive Tests** - pytest test suite with 25+ tests
- 📚 **API Documentation** - Auto-generated Swagger/ReDoc documentation

## Tech Stack

- **FastAPI** - Modern, fast web framework
- **SQLAlchemy** - SQL toolkit and ORM
- **PostgreSQL** - Production database
- **Pydantic** - Data validation using Python type annotations
- **JWT** - Secure token-based authentication
- **Docker & Docker Compose** - Containerization
- **pytest** - Testing framework

## Project Structure

```
ecommerce-backend/
├── app/
│   ├── __init__.py
│   ├── main.py                 # FastAPI application entry point
│   ├── config/
│   │   ├── __init__.py
│   │   └── settings.py         # Configuration and environment variables
│   ├── models/                 # SQLAlchemy database models
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── product.py
│   │   └── order.py
│   ├── schemas/                # Pydantic schemas for validation
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── product.py
│   │   └── order.py
│   ├── routers/                # API route handlers
│   │   ├── __init__.py
│   │   ├── auth.py
│   │   ├── products.py
│   │   └── orders.py
│   ├── database/               # Database configuration
│   │   ├── __init__.py
│   │   └── connection.py
│   └── utils/                  # Utility functions
│       ├── __init__.py
│       ├── auth.py             # JWT and password utilities
│       └── dependencies.py     # FastAPI dependencies
├── tests/                      # Test suite
│   ├── __init__.py
│   ├── conftest.py
│   ├── test_auth.py
│   ├── test_products.py
│   └── test_orders.py
├── .env                        # Environment variables
├── .env.example                # Example environment variables
├── .gitignore
├── Dockerfile
├── docker-compose.yml
├── requirements.txt
├── pytest.ini
└── README.md
```

## Quick Start

### Prerequisites

- Docker and Docker Compose installed
- Python 3.11+ (for local development)

### Option 1: Using Docker (Recommended)

1. **Clone the repository and navigate to the project directory**

2. **Start the application**
```bash
docker-compose up --build
```

This will:
- Build the FastAPI application container
- Start PostgreSQL database container
- Create all necessary database tables
- Start the API server on http://localhost:8000

3. **Access the API documentation**
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

### Option 2: Local Development

1. **Create a virtual environment**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. **Install dependencies**
```bash
pip install -r requirements.txt
```

3. **Set up PostgreSQL database**
```bash
# Create a PostgreSQL database named 'ecommerce'
# Update DATABASE_URL in .env file with your credentials
```

4. **Run the application**
```bash
uvicorn app.main:app --reload
```

## API Endpoints

### Authentication

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| POST | `/api/auth/register` | Register a new user | No |
| POST | `/api/auth/login` | Login and get JWT token | No |
| GET | `/api/auth/me` | Get current user info | Yes |

### Products

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| GET | `/api/products/` | Get all products (with pagination) | No |
| GET | `/api/products/{id}` | Get product by ID | No |
| POST | `/api/products/` | Create a new product | Yes |
| PUT | `/api/products/{id}` | Update a product | Yes |
| DELETE | `/api/products/{id}` | Delete a product | Yes |

### Orders

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| GET | `/api/orders/` | Get all user orders | Yes |
| GET | `/api/orders/{id}` | Get order by ID | Yes |
| POST | `/api/orders/` | Create a new order | Yes |
| PUT | `/api/orders/{id}` | Update order status | Yes |
| DELETE | `/api/orders/{id}` | Cancel an order | Yes |

## Usage Examples

### 1. Register a User

```bash
curl -X POST "http://localhost:8000/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "username": "johndoe",
    "password": "securepassword123",
    "full_name": "John Doe"
  }'
```

### 2. Login and Get Token

```bash
curl -X POST "http://localhost:8000/api/auth/login" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=johndoe&password=securepassword123"
```

Response:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

### 3. Create a Product (Authenticated)

```bash
curl -X POST "http://localhost:8000/api/products/" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Laptop",
    "description": "High-performance laptop",
    "price": 999.99,
    "stock": 50,
    "category": "Electronics"
  }'
```

### 4. Get All Products

```bash
curl -X GET "http://localhost:8000/api/products/"
```

### 5. Create an Order (Authenticated)

```bash
curl -X POST "http://localhost:8000/api/orders/" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {
        "product_id": 1,
        "quantity": 2,
        "price": 999.99,
        "name": "Laptop"
      }
    ],
    "shipping_address": "123 Main St, City, State 12345"
  }'
```

## Running Tests

### Using Docker

```bash
# Run tests in the container
docker-compose exec web pytest -v
```

### Local

```bash
# Activate virtual environment first
pytest -v
```

Test coverage includes:
- ✅ User registration and authentication
- ✅ Product CRUD operations
- ✅ Order creation and management
- ✅ Authorization and permission checks
- ✅ Data validation
- ✅ Error handling

## Environment Variables

Create a `.env` file in the project root (use `.env.example` as template):

```env
# Database Configuration
DATABASE_URL=postgresql://postgres:postgres@db:5432/ecommerce

# JWT Configuration
SECRET_KEY=your-secret-key-change-this-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# App Configuration
APP_NAME=E-commerce API
DEBUG=True
```

## Database Schema

### Users Table
- id (Primary Key)
- email (Unique)
- username (Unique)
- hashed_password
- full_name
- is_active
- created_at

### Products Table
- id (Primary Key)
- name
- description
- price
- stock
- category
- image_url
- created_at
- updated_at

### Orders Table
- id (Primary Key)
- user_id (Foreign Key)
- total_amount
- status (pending/processing/completed/cancelled)
- shipping_address
- items (JSON)
- created_at
- updated_at

## Security Features

- 🔒 Password hashing using bcrypt
- 🎫 JWT token-based authentication
- 🛡️ Protected endpoints with authorization
- ✅ Input validation with Pydantic
- 🚫 SQL injection prevention with SQLAlchemy ORM

## Development

### Adding New Endpoints

1. Create/update model in `app/models/`
2. Create Pydantic schemas in `app/schemas/`
3. Create router in `app/routers/`
4. Register router in `app/main.py`
5. Write tests in `tests/`

### Database Migrations

For production, consider using Alembic for database migrations:

```bash
pip install alembic
alembic init migrations
```

## Production Deployment

Before deploying to production:

1. Change `SECRET_KEY` to a strong, random value
2. Set `DEBUG=False`
3. Update CORS allowed origins
4. Use environment-specific database credentials
5. Enable HTTPS
6. Set up proper logging
7. Use a production WSGI server (gunicorn)
8. Implement rate limiting
9. Set up database backups

## Troubleshooting

### Database Connection Issues

```bash
# Check if PostgreSQL is running
docker-compose ps

# View logs
docker-compose logs db

# Restart services
docker-compose restart
```

### Port Already in Use

```bash
# Change port in docker-compose.yml
ports:
  - "8001:8000"  # Use port 8001 instead
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write/update tests
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues and questions:
- Create an issue on GitHub
- Check the API documentation at `/docs`

## Acknowledgments

Built with FastAPI, SQLAlchemy, and PostgreSQL.