
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

// Sample users for the demo
const demoUsers = [
  {
    id: 'user-1',
    name: 'Rahul Kumar',
    email: 'Employeelogin2025@gmail.com',
    role: 'employee',
    department: 'Marketing',
    avatar: '/placeholder.svg'
  },
  {
    id: 'user-2',
    name: 'Priya Sharma',
    email: 'Hrlogin@gmail.com',
    role: 'hr',
    department: 'Human Resources',
    avatar: '/placeholder.svg'
  },
  {
    id: 'user-3',
    name: 'Vikram Singh',
    email: 'Managerlogin2025@gmail.com',
    role: 'manager',
    department: 'Operations',
    avatar: '/placeholder.svg'
  },
  {
    id: 'user-4',
    name: 'Arjun Patel',
    email: 'Financelogin03@gmail.com',
    role: 'finance',
    department: 'Finance',
    avatar: '/placeholder.svg'
  }
];

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check for existing user session in localStorage
    const storedUser = localStorage.getItem('budgetEagleUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);
  
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Find user by email (case insensitive)
      const foundUser = demoUsers.find(
        u => u.email.toLowerCase() === email.toLowerCase()
      );
      
      if (foundUser && password === 'password') {
        setUser(foundUser);
        localStorage.setItem('budgetEagleUser', JSON.stringify(foundUser));
        toast.success(`Welcome back, ${foundUser.name}!`);
        return true;
      } else {
        toast.error('Invalid email or password');
        return false;
      }
    } catch (error) {
      toast.error('Login failed. Please try again.');
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  const logout = () => {
    setUser(null);
    localStorage.removeItem('budgetEagleUser');
    toast.info('You have been logged out');
    navigate('/login');
  };
  
  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isLoading, 
        login, 
        logout,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
