import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Skeleton } from '../ui/Skeleton';

export const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 space-y-6">
        <Skeleton variant="text" className="w-1/4 h-8" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton variant="rect" className="h-40" />
          <Skeleton variant="rect" className="h-40" />
          <Skeleton variant="rect" className="h-40" />
        </div>
      </div>
    );
  }

  if (!user) {
    // Redirect to login page, but save the current location they tried to go to
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return children;
};
