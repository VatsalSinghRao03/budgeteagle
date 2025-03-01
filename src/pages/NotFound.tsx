
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
      <img 
        src="/lovable-uploads/7b7c80e1-0e0e-46de-8ddc-fb9d21b89cdc.png" 
        alt="Budget Eagle Logo" 
        className="h-20 mb-4" 
      />
      <h1 className="text-4xl font-bold text-gray-800 mb-2">404</h1>
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
      <p className="text-gray-600 max-w-md mb-8">
        The page you are looking for doesn't exist or has been moved.
      </p>
      
      <Link to="/">
        <Button className="flex items-center gap-2">
          <Home className="h-4 w-4" />
          Back to Home
        </Button>
      </Link>
    </div>
  );
};

export default NotFound;
