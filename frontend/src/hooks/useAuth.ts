'use client';

import { useState, useEffect } from 'react';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async (currentToken?: string) => {
    const tokenToCheck = currentToken || token;
    if (!tokenToCheck) return false;
    
    try {
      console.log('Checking auth with token:', tokenToCheck.substring(0, 20) + '...');
      const response = await fetch('http://localhost:5000/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${tokenToCheck}`
        }
      });
      
      if (response.ok) {
        return true;
      } else {
        console.log('Auth check failed:', response.status, response.statusText);
        return false;
      }
    } catch (error) {
      console.error('Auth check error:', error);
      return false;
    }
  };

  useEffect(() => {
    // Only run on client side
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('adminToken');
      if (storedToken) {
        // Validate the token first
        checkAuth(storedToken).then((isValid) => {
          if (isValid) {
            setToken(storedToken);
            setIsAuthenticated(true);
          } else {
            // Token is invalid, remove it
            localStorage.removeItem('adminToken');
            setIsAuthenticated(false);
          }
          setLoading(false);
        });
      } else {
        setIsAuthenticated(false);
        setLoading(false);
      }
    }
  }, []);

  const login = (newToken: string) => {
    console.log('Login called with token:', newToken.substring(0, 20) + '...');
    localStorage.setItem('adminToken', newToken);
    setToken(newToken);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    setToken(null);
    setIsAuthenticated(false);
  };



  return {
    isAuthenticated,
    token,
    loading,
    login,
    logout,
    checkAuth
  };
}

