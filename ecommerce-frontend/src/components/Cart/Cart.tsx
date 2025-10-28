import React, { useState } from 'react';
import { ordersAPI } from '../../services/api';
import { CartItem, OrderRequest, OrderItem } from '../../types';
import styles from './Cart.module.css';

interface CartProps {
  cart: CartItem[];
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onRemoveItem: (productId: number) => void;
  onClearCart: () => void;
}

const Cart: React.FC<CartProps> = ({
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}) => {
  const [shippingAddress, setShippingAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState(false);

  const calculateTotal = (): number => {
    return cart.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const orderItems: OrderItem[] = cart.map((item) => ({
        product_id: item.product.id,
        quantity: item.quantity,
        price: item.product.price,
        name: item.product.name,
      }));

      const orderRequest: OrderRequest = {
        items: orderItems,
        shipping_address: shippingAddress,
      };

      await ordersAPI.create(orderRequest);
      setSuccess(true);
      setShippingAddress('');
      onClearCart();

      // Reset success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(
        err.response?.data?.detail || 'Failed to place order. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className={styles.emptyCart}>
        <div className={styles.emptyIcon}>🛒</div>
        <h2>Your cart is empty</h2>
        <p>Add some products to get started!</p>
      </div>
    );
  }

  return (
    <div className={styles.cartContainer}>
      <div className={styles.cartContent}>
        <div className={styles.cartItems}>
          <h2>Shopping Cart ({cart.length} items)</h2>

          {cart.map((item) => (
            <div key={item.product.id} className={styles.cartItem}>
              <div className={styles.itemInfo}>
                <div className={styles.itemImage}>
                  {item.product.image_url ? (
                    <img src={item.product.image_url} alt={item.product.name} />
                  ) : (
                    <span>📦</span>
                  )}
                </div>
                <div className={styles.itemDetails}>
                  <h3>{item.product.name}</h3>
                  {item.product.category && (
                    <span className={styles.category}>
                      {item.product.category}
                    </span>
                  )}
                  <p className={styles.price}>
                    ${item.product.price.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className={styles.itemActions}>
                <div className={styles.quantityControls}>
                  <button
                    onClick={() =>
                      onUpdateQuantity(item.product.id, item.quantity - 1)
                    }
                    disabled={item.quantity <= 1}
                    className={styles.quantityButton}
                  >
                    -
                  </button>
                  <span className={styles.quantity}>{item.quantity}</span>
                  <button
                    onClick={() =>
                      onUpdateQuantity(item.product.id, item.quantity + 1)
                    }
                    disabled={item.quantity >= item.product.stock}
                    className={styles.quantityButton}
                  >
                    +
                  </button>
                </div>

                <div className={styles.itemTotal}>
                  ${(item.product.price * item.quantity).toFixed(2)}
                </div>

                <button
                  onClick={() => onRemoveItem(item.product.id)}
                  className={styles.removeButton}
                  title="Remove item"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.orderSummary}>
          <h2>Order Summary</h2>

          <div className={styles.summaryDetails}>
            <div className={styles.summaryRow}>
              <span>Subtotal</span>
              <span>${calculateTotal().toFixed(2)}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className={`${styles.summaryRow} ${styles.total}`}>
              <span>Total</span>
              <span>${calculateTotal().toFixed(2)}</span>
            </div>
          </div>

          <form onSubmit={handlePlaceOrder} className={styles.checkoutForm}>
            <div className={styles.formGroup}>
              <label htmlFor="shippingAddress">Shipping Address</label>
              <textarea
                id="shippingAddress"
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                required
                placeholder="Enter your complete shipping address..."
                rows={4}
                minLength={10}
              />
            </div>

            {error && <div className={styles.error}>{error}</div>}
            {success && (
              <div className={styles.success}>
                Order placed successfully! 🎉
              </div>
            )}

            <button
              type="submit"
              className={styles.checkoutButton}
              disabled={loading || cart.length === 0}
            >
              {loading ? 'Placing Order...' : 'Place Order'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Cart;
