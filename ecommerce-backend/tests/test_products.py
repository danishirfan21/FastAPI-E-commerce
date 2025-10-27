import pytest
from fastapi import status


@pytest.fixture
def sample_product():
    """Sample product data"""
    return {
        "name": "Test Product",
        "description": "A test product description",
        "price": 29.99,
        "stock": 100,
        "category": "Electronics",
        "image_url": "https://example.com/image.jpg"
    }


def test_create_product(client, auth_headers, sample_product):
    """Test creating a new product"""
    response = client.post(
        "/api/products/",
        json=sample_product,
        headers=auth_headers
    )
    
    assert response.status_code == status.HTTP_201_CREATED
    data = response.json()
    assert data["name"] == sample_product["name"]
    assert data["price"] == sample_product["price"]
    assert "id" in data


def test_create_product_unauthorized(client, sample_product):
    """Test creating product without authentication"""
    response = client.post("/api/products/", json=sample_product)
    
    assert response.status_code == status.HTTP_401_UNAUTHORIZED


def test_get_products(client, auth_headers, sample_product):
    """Test getting list of products"""
    # Create a product first
    client.post("/api/products/", json=sample_product, headers=auth_headers)
    
    response = client.get("/api/products/")
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0


def test_get_product_by_id(client, auth_headers, sample_product):
    """Test getting a specific product by ID"""
    # Create a product first
    create_response = client.post(
        "/api/products/",
        json=sample_product,
        headers=auth_headers
    )
    product_id = create_response.json()["id"]
    
    response = client.get(f"/api/products/{product_id}")
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["id"] == product_id
    assert data["name"] == sample_product["name"]


def test_get_nonexistent_product(client):
    """Test getting a product that doesn't exist"""
    response = client.get("/api/products/99999")
    
    assert response.status_code == status.HTTP_404_NOT_FOUND


def test_update_product(client, auth_headers, sample_product):
    """Test updating a product"""
    # Create a product first
    create_response = client.post(
        "/api/products/",
        json=sample_product,
        headers=auth_headers
    )
    product_id = create_response.json()["id"]
    
    # Update the product
    update_data = {"name": "Updated Product", "price": 39.99}
    response = client.put(
        f"/api/products/{product_id}",
        json=update_data,
        headers=auth_headers
    )
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["name"] == update_data["name"]
    assert data["price"] == update_data["price"]


def test_update_product_unauthorized(client, auth_headers, sample_product):
    """Test updating product without authentication"""
    # Create a product first
    create_response = client.post(
        "/api/products/",
        json=sample_product,
        headers=auth_headers
    )
    product_id = create_response.json()["id"]
    
    # Try to update without auth
    update_data = {"name": "Updated Product"}
    response = client.put(f"/api/products/{product_id}", json=update_data)
    
    assert response.status_code == status.HTTP_401_UNAUTHORIZED


def test_delete_product(client, auth_headers, sample_product):
    """Test deleting a product"""
    # Create a product first
    create_response = client.post(
        "/api/products/",
        json=sample_product,
        headers=auth_headers
    )
    product_id = create_response.json()["id"]
    
    # Delete the product
    response = client.delete(f"/api/products/{product_id}", headers=auth_headers)
    
    assert response.status_code == status.HTTP_204_NO_CONTENT
    
    # Verify it's deleted
    get_response = client.get(f"/api/products/{product_id}")
    assert get_response.status_code == status.HTTP_404_NOT_FOUND


def test_delete_product_unauthorized(client, auth_headers, sample_product):
    """Test deleting product without authentication"""
    # Create a product first
    create_response = client.post(
        "/api/products/",
        json=sample_product,
        headers=auth_headers
    )
    product_id = create_response.json()["id"]
    
    # Try to delete without auth
    response = client.delete(f"/api/products/{product_id}")
    
    assert response.status_code == status.HTTP_401_UNAUTHORIZED


def test_filter_products_by_category(client, auth_headers):
    """Test filtering products by category"""
    # Create products with different categories
    product1 = {
        "name": "Product 1",
        "price": 10.0,
        "stock": 10,
        "category": "Electronics"
    }
    product2 = {
        "name": "Product 2",
        "price": 20.0,
        "stock": 20,
        "category": "Books"
    }
    
    client.post("/api/products/", json=product1, headers=auth_headers)
    client.post("/api/products/", json=product2, headers=auth_headers)
    
    # Filter by Electronics
    response = client.get("/api/products/?category=Electronics")
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert len(data) == 1
    assert data[0]["category"] == "Electronics"