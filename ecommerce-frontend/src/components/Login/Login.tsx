import React, { useState } from 'react';
import { authAPI } from '../../services/api';
import { LoginRequest } from '../../types';
import styles from './Login.module.css';

interface LoginProps {
  onLoginSuccess: () => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    full_name: '',
  });
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const loginData: LoginRequest = {
        username: formData.username,
        password: formData.password,
      };

      const response = await authAPI.login(loginData);
      localStorage.setItem('access_token', response.access_token);
      onLoginSuccess();
    } catch (err: any) {
      setError(
        err.response?.data?.detail ||
          'Login failed. Please check your credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await authAPI.register({
        email: formData.email,
        username: formData.username,
        password: formData.password,
        full_name: formData.full_name,
      });

      // Auto-login after successful registration
      const loginData: LoginRequest = {
        username: formData.username,
        password: formData.password,
      };

      const response = await authAPI.login(loginData);
      localStorage.setItem('access_token', response.access_token);
      onLoginSuccess();
    } catch (err: any) {
      setError(
        err.response?.data?.detail || 'Registration failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginBox}>
        <h1 className={styles.title}>E-Commerce Store</h1>

        <div className={styles.toggleButtons}>
          <button
            className={`${styles.toggleButton} ${isLogin ? styles.active : ''}`}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button
            className={`${styles.toggleButton} ${
              !isLogin ? styles.active : ''
            }`}
            onClick={() => setIsLogin(false)}
          >
            Register
          </button>
        </div>

        <form
          onSubmit={isLogin ? handleLogin : handleRegister}
          className={styles.form}
        >
          {!isLogin && (
            <div className={styles.formGroup}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required={!isLogin}
                placeholder="Enter your email"
              />
            </div>
          )}

          <div className={styles.formGroup}>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              required
              placeholder="Enter your username"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              placeholder="Enter your password"
              minLength={6}
            />
          </div>

          {!isLogin && (
            <div className={styles.formGroup}>
              <label htmlFor="full_name">Full Name (Optional)</label>
              <input
                type="text"
                id="full_name"
                name="full_name"
                value={formData.full_name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
              />
            </div>
          )}

          {error && <div className={styles.error}>{error}</div>}

          <button
            type="submit"
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? 'Please wait...' : isLogin ? 'Login' : 'Register'}
          </button>
        </form>

        <div className={styles.demoCredentials}>
          <p>
            <strong>Demo Credentials:</strong>
          </p>
          <p>Username: testuser</p>
          <p>Password: testpassword123</p>
          <p>
            <small>(Register first or use after creating an account)</small>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
