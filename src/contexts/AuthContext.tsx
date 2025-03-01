
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Sample user data (in a real app, this would come from a database)
const sampleUsers = [
  {
    id: 'emp-01',
    name: 'Rahul Sharma',
    email: 'Employeelogin2025@gmail.com',
    password: 'password',
    role: 'employee' as const,
    department: 'Marketing',
    avatar: '',
  },
  {
    id: 'hr-01',
    name: 'Priya Patel',
    email: 'Hrlogin@gmail.com',
    password: 'password',
    role: 'hr' as const,
    department: 'Human Resources',
    avatar: '',
  },
  {
    id: 'mgr-01',
    name: 'Vikram Singh',
    email: 'Managerlogin2025@gmail.com',
    password: 'password',
    role: 'manager' as const,
    department: 'Operations',
    avatar: '',
  },
  {
    id: 'fin-01',
    name: 'Arjun Reddy',
    email: 'Financelogin03@gmail.com',
    password: 'password',
    role: 'finance' as const,
    department: 'Finance',
    avatar: '',
  },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Check if user is already logged in
  useEffect(() => {
    const savedUser = localStorage.getItem('budgetEagleUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);
  
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const foundUser = sampleUsers.find(u => u.email === email && u.password === password);
      
      if (foundUser) {
        // Create a user object without the password
        const userWithoutPassword = {
          id: foundUser.id,
          name: foundUser.name,
          email: foundUser.email,
          role: foundUser.role,
          department: foundUser.department,
          avatar: foundUser.avatar,
        };
        
        setUser(userWithoutPassword as User);
        localStorage.setItem('budgetEagleUser', JSON.stringify(userWithoutPassword));
        toast.success(`Welcome back, ${foundUser.name}!`);
        return true;
      } else {
        toast.error('Invalid email or password');
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An error occurred during login');
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  const logout = () => {
    setUser(null);
    localStorage.removeItem('budgetEagleUser');
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
