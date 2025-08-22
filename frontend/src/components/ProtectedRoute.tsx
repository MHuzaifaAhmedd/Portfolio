'use client';

import { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import WorldClassLoader from './WorldClassLoader';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export default function ProtectedRoute({ 
  children, 
  redirectTo = '/admin/login' 
}: ProtectedRouteProps) {
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated && typeof window !== 'undefined') {
      // Clear any invalid tokens
      localStorage.removeItem('adminToken');
      window.location.href = redirectTo;
    }
  }, [isAuthenticated, loading, redirectTo]);

  // Show loading while checking authentication
  if (loading) {
    return (
      <WorldClassLoader 
        message="Checking Authentication..." 
        variant="orbit"
        size="md"
      />
    );
  }

  // Don't render anything if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  // Render children if authenticated
  return <>{children}</>;
}

