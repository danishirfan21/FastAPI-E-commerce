import React, { useState, useEffect } from 'react';
import { productsAPI } from '../../services/api';
import { Product, CartItem } from '../../types';
import styles from './Products.module.css';

interface ProductsProps {
  cart: CartItem[];
  onAddToCart: (product: Product) => void;
}

const Products: React.FC<ProductsProps> = ({ cart, onAddToCart }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productsAPI.getAll();
      setProducts(data);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const getItemInCart = (productId: number): number => {
    const item = cart.find((item) => item.product.id === productId);
    return item ? item.quantity : 0;
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.error}>
        <p>{error}</p>
        <button onClick={fetchProducts} className={styles.retryButton}>
          Retry
        </button>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className={styles.empty}>
        <h2>No Products Available</h2>
        <p>Check back later for new items!</p>
      </div>
    );
  }

  return (
    <div className={styles.productsContainer}>
      <div className={styles.productsGrid}>
        {products.map((product) => {
          const inCart = getItemInCart(product.id);

          return (
            <div key={product.id} className={styles.productCard}>
              <div className={styles.productImage}>
                {product.image_url ? (
                  <img src={product.image_url} alt={product.name} />
                ) : (
                  <div className={styles.placeholderImage}>
                    <span>📦</span>
                  </div>
                )}
              </div>

              <div className={styles.productInfo}>
                <h3 className={styles.productName}>{product.name}</h3>

                {product.category && (
                  <span className={styles.category}>{product.category}</span>
                )}

                {product.description && (
                  <p className={styles.description}>{product.description}</p>
                )}

                <div className={styles.productFooter}>
                  <div className={styles.priceSection}>
                    <span className={styles.price}>
                      ${product.price.toFixed(2)}
                    </span>
                    <span className={styles.stock}>
                      {product.stock > 0 ? (
                        `${product.stock} in stock`
                      ) : (
                        <span className={styles.outOfStock}>Out of stock</span>
                      )}
                    </span>
                  </div>

                  <button
                    className={styles.addToCartButton}
                    onClick={() => onAddToCart(product)}
                    disabled={product.stock === 0}
                  >
                    {inCart > 0 ? `In Cart (${inCart})` : 'Add to Cart'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Products;
