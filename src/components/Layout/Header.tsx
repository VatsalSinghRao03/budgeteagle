
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, User } from 'lucide-react';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  
  return (
    <header className="bg-brand-blue text-white">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img 
            src="/lovable-uploads/347e4bbf-cf50-4ba9-bc2f-de43c97faf78.png" 
            alt="Budget Eagle Logo" 
            className="h-10 w-auto" 
          />
          <div className="flex flex-col">
            <h1 className="text-xl font-bold">Budget Eagle</h1>
            <p className="text-xs text-blue-100">A Budget Approval System</p>
          </div>
        </div>
        
        {user && (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="hidden md:block">
                <div className="text-sm font-medium">{user.name}</div>
                <div className="text-xs text-blue-200">{user.role}</div>
              </div>
            </div>
            
            <button 
              onClick={logout} 
              className="flex items-center gap-1 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
