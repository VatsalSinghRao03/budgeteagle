
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '@/types';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo users
const DEMO_USERS: User[] = [
  {
    id: '1',
    name: 'Rahul Kumar',
    email: 'Employeelogin2025@gmail.com',
    role: 'employee',
    department: 'Marketing'
  },
  {
    id: '2',
    name: 'Priya Sharma',
    email: 'Hrlogin@gmail.com',
    role: 'hr',
    department: 'Human Resources'
  },
  {
    id: '3',
    name: 'Vikram Singh',
    email: 'Managerlogin2025@gmail.com',
    role: 'manager',
    department: 'Operations'
  },
  {
    id: '4',
    name: 'Arjun Patel',
    email: 'Financelogin03@gmail.com',
    role: 'finance',
    department: 'Finance'
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for saved user in localStorage
    const savedUser = localStorage.getItem('budgetEagleUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const foundUser = DEMO_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (foundUser && password === 'password') {
        setUser(foundUser);
        localStorage.setItem('budgetEagleUser', JSON.stringify(foundUser));
        navigate('/dashboard');
        toast.success(`Welcome back, ${foundUser.name}!`);
      } else {
        toast.error('Invalid email or password');
      }
    } catch (error) {
      toast.error('Login failed. Please try again.');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('budgetEagleUser');
    navigate('/login');
    toast.info('You have been logged out');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
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
