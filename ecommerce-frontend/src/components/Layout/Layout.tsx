import React from 'react';
import { CartItem } from '../../types';
import styles from './Layout.module.css';

interface LayoutProps {
  children: React.ReactNode;
  currentView: 'products' | 'cart';
  onViewChange: (view: 'products' | 'cart') => void;
  onLogout: () => void;
  cart: CartItem[];
}

const Layout: React.FC<LayoutProps> = ({
  children,
  currentView,
  onViewChange,
  onLogout,
  cart,
}) => {
  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.logo}>🛍️ E-Commerce Store</h1>

          <nav className={styles.nav}>
            <button
              className={`${styles.navButton} ${
                currentView === 'products' ? styles.active : ''
              }`}
              onClick={() => onViewChange('products')}
            >
              Products
            </button>
            <button
              className={`${styles.navButton} ${
                currentView === 'cart' ? styles.active : ''
              }`}
              onClick={() => onViewChange('cart')}
            >
              Cart
              {cartItemsCount > 0 && (
                <span className={styles.badge}>{cartItemsCount}</span>
              )}
            </button>
            <button className={styles.logoutButton} onClick={onLogout}>
              Logout
            </button>
          </nav>
        </div>
      </header>

      <main className={styles.main}>{children}</main>

      <footer className={styles.footer}>
        <p>© 2024 E-Commerce Store. Built with React + TypeScript + FastAPI</p>
      </footer>
    </div>
  );
};

export default Layout;
