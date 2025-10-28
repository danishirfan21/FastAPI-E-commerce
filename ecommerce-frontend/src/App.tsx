import React, { useState, useEffect } from 'react';
import Login from './components/Login/Login';
import Products from './components/Products/Products';
import Cart from './components/Cart/Cart';
import Layout from './components/Layout/Layout';
import { Product, CartItem } from './types';

type View = 'products' | 'cart';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState<View>('products');
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    // Check if user has token on mount
    const token = localStorage.getItem('access_token');
    if (token) {
      setIsAuthenticated(true);
    }

    // Load cart from localStorage
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error('Failed to load cart from localStorage', error);
      }
    }
  }, []);

  useEffect(() => {
    // Save cart to localStorage whenever it changes
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('cart');
    setIsAuthenticated(false);
    setCart([]);
    setCurrentView('products');
  };

  const handleAddToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) => item.product.id === product.id
      );

      if (existingItem) {
        // Increase quantity if already in cart (up to stock limit)
        return prevCart.map((item) =>
          item.product.id === product.id && item.quantity < product.stock
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Add new item to cart
        return [...prevCart, { product, quantity: 1 }];
      }
    });
  };

  const handleUpdateQuantity = (productId: number, quantity: number) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveItem = (productId: number) => {
    setCart((prevCart) =>
      prevCart.filter((item) => item.product.id !== productId)
    );
  };

  const handleClearCart = () => {
    setCart([]);
  };

  if (!isAuthenticated) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <Layout
      currentView={currentView}
      onViewChange={setCurrentView}
      onLogout={handleLogout}
      cart={cart}
    >
      {currentView === 'products' ? (
        <Products cart={cart} onAddToCart={handleAddToCart} />
      ) : (
        <Cart
          cart={cart}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
          onClearCart={handleClearCart}
        />
      )}
    </Layout>
  );
};

export default App;
