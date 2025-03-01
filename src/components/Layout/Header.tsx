
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

const Header: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-brand-blue text-white py-3 px-4 flex justify-between items-center animate-fade-in">
      <div className="flex items-center">
        <img 
          src="/lovable-uploads/b11177f7-7044-4809-852f-d44fbd57df61.png" 
          alt="Budget Eagle Logo" 
          className="h-12 mr-3"
        />
        <div className="flex flex-col">
          <h1 className="text-xl font-semibold">Budget Eagle</h1>
          <p className="text-xs text-white/80">A Budget Approval System</p>
        </div>
      </div>
      
      {user && (
        <div className="flex items-center gap-4">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center text-white mr-3">
              {user.name.charAt(0)}
            </div>
            <div className="flex flex-col">
              <span className="font-medium text-sm">{user.name}</span>
              <span className="text-xs text-white/80 capitalize">{user.role}</span>
            </div>
          </div>
          <Button 
            variant="outline" 
            className="flex items-center gap-2 border-white/30 text-white hover:bg-white/10 hover:text-white transition-all duration-300"
            onClick={logout}
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </Button>
        </div>
      )}
    </header>
  );
};

export default Header;
