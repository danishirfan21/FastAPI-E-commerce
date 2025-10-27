import pytest
from fastapi import status


@pytest.fixture
def sample_product(client, auth_headers):
    """Create a sample product for testing"""
    product_data = {
        "name": "Test Product",
        "description": "A test product",
        "price": 29.99,
        "stock": 100,
        "category": "Electronics"
    }
    response = client.post("/api/products/", json=product_data, headers=auth_headers)
    return response.json()


def test_create_order(client, auth_headers, sample_product):
    """Test creating a new order"""
    order_data = {
        "items": [
            {
                "product_id": sample_product["id"],
                "quantity": 2,
                "price": sample_product["price"],
                "name": sample_product["name"]
            }
        ],
        "shipping_address": "123 Test Street, Test City, TC 12345"
    }
    
    response = client.post("/api/orders/", json=order_data, headers=auth_headers)
    
    assert response.status_code == status.HTTP_201_CREATED
    data = response.json()
    assert data["status"] == "pending"
    assert data["total_amount"] == sample_product["price"] * 2
    assert len(data["items"]) == 1


def test_create_order_unauthorized(client, sample_product):
    """Test creating order without authentication"""
    order_data = {
        "items": [
            {
                "product_id": sample_product["id"],
                "quantity": 1,
                "price": 29.99,
                "name": "Test Product"
            }
        ],
        "shipping_address": "123 Test Street"
    }
    
    response = client.post("/api/orders/", json=order_data)
    
    assert response.status_code == status.HTTP_401_UNAUTHORIZED


def test_create_order_insufficient_stock(client, auth_headers, sample_product):
    """Test creating order with insufficient stock"""
    order_data = {
        "items": [
            {
                "product_id": sample_product["id"],
                "quantity": 200,  # More than available stock
                "price": sample_product["price"],
                "name": sample_product["name"]
            }
        ],
        "shipping_address": "123 Test Street"
    }
    
    response = client.post("/api/orders/", json=order_data, headers=auth_headers)
    
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert "Insufficient stock" in response.json()["detail"]


def test_create_order_nonexistent_product(client, auth_headers):
    """Test creating order with non-existent product"""
    order_data = {
        "items": [
            {
                "product_id": 99999,  # Non-existent product
                "quantity": 1,
                "price": 29.99,
                "name": "Fake Product"
            }
        ],
        "shipping_address": "123 Test Street"
    }
    
    response = client.post("/api/orders/", json=order_data, headers=auth_headers)
    
    assert response.status_code == status.HTTP_404_NOT_FOUND


def test_get_user_orders(client, auth_headers, sample_product):
    """Test getting all orders for current user"""
    # Create an order first
    order_data = {
        "items": [
            {
                "product_id": sample_product["id"],
                "quantity": 1,
                "price": sample_product["price"],
                "name": sample_product["name"]
            }
        ],
        "shipping_address": "123 Test Street"
    }
    client.post("/api/orders/", json=order_data, headers=auth_headers)
    
    response = client.get("/api/orders/", headers=auth_headers)
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0


def test_get_order_by_id(client, auth_headers, sample_product):
    """Test getting a specific order by ID"""
    # Create an order first
    order_data = {
        "items": [
            {
                "product_id": sample_product["id"],
                "quantity": 1,
                "price": sample_product["price"],
                "name": sample_product["name"]
            }
        ],
        "shipping_address": "123 Test Street"
    }
    create_response = client.post("/api/orders/", json=order_data, headers=auth_headers)
    order_id = create_response.json()["id"]
    
    response = client.get(f"/api/orders/{order_id}", headers=auth_headers)
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["id"] == order_id


def test_get_nonexistent_order(client, auth_headers):
    """Test getting an order that doesn't exist"""
    response = client.get("/api/orders/99999", headers=auth_headers)
    
    assert response.status_code == status.HTTP_404_NOT_FOUND


def test_update_order_status(client, auth_headers, sample_product):
    """Test updating order status"""
    # Create an order first
    order_data = {
        "items": [
            {
                "product_id": sample_product["id"],
                "quantity": 1,
                "price": sample_product["price"],
                "name": sample_product["name"]
            }
        ],
        "shipping_address": "123 Test Street"
    }
    create_response = client.post("/api/orders/", json=order_data, headers=auth_headers)
    order_id = create_response.json()["id"]
    
    # Update status
    update_data = {"status": "processing"}
    response = client.put(
        f"/api/orders/{order_id}",
        json=update_data,
        headers=auth_headers
    )
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["status"] == "processing"


def test_cancel_order(client, auth_headers, sample_product):
    """Test canceling an order"""
    # Create an order first
    order_data = {
        "items": [
            {
                "product_id": sample_product["id"],
                "quantity": 2,
                "price": sample_product["price"],
                "name": sample_product["name"]
            }
        ],
        "shipping_address": "123 Test Street"
    }
    create_response = client.post("/api/orders/", json=order_data, headers=auth_headers)
    order_id = create_response.json()["id"]
    
    # Get initial stock
    product_response = client.get(f"/api/products/{sample_product['id']}")
    initial_stock = product_response.json()["stock"]
    
    # Cancel the order
    response = client.delete(f"/api/orders/{order_id}", headers=auth_headers)
    
    assert response.status_code == status.HTTP_204_NO_CONTENT
    
    # Verify order is cancelled
    order_response = client.get(f"/api/orders/{order_id}", headers=auth_headers)
    assert order_response.json()["status"] == "cancelled"
    
    # Verify stock is restored
    product_response = client.get(f"/api/products/{sample_product['id']}")
    final_stock = product_response.json()["stock"]
    assert final_stock == initial_stock + 2


def test_cancel_completed_order(client, auth_headers, sample_product):
    """Test that completed orders cannot be cancelled"""
    # Create and complete an order
    order_data = {
        "items": [
            {
                "product_id": sample_product["id"],
                "quantity": 1,
                "price": sample_product["price"],
                "name": sample_product["name"]
            }
        ],
        "shipping_address": "123 Test Street"
    }
    create_response = client.post("/api/orders/", json=order_data, headers=auth_headers)
    order_id = create_response.json()["id"]
    
    # Mark as completed
    client.put(
        f"/api/orders/{order_id}",
        json={"status": "completed"},
        headers=auth_headers
    )
    
    # Try to cancel
    response = client.delete(f"/api/orders/{order_id}", headers=auth_headers)
    
    assert response.status_code == status.HTTP_400_BAD_REQUEST