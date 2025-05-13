
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Index: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    console.log("Index page - Auth state:", { isAuthenticated, isLoading });
    
    if (!isLoading) {
      if (isAuthenticated && user) {
        console.log("User is authenticated, redirecting to dashboard");
        navigate('/dashboard');
      } else {
        console.log("User is not authenticated, redirecting to login");
        navigate('/login');
      }
    }
  }, [isAuthenticated, isLoading, navigate, user]);
  
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-blue"></div>
      <p className="ml-3 text-gray-600">Loading application...</p>
    </div>
  );
};

export default Index;
