
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

interface UserContextType {
  users: User[];
  isLoading: boolean;
  addUser: (userData: Omit<User, 'id'>) => Promise<void>;
  updateUser: (userId: string, userData: Partial<User>) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  getUsersByRole: (role: User['role']) => User[];
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([
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
  ]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    // Load users from localStorage
    const savedUsers = localStorage.getItem('budgetEagleUsers');
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    }
  }, []);

  // Save users to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('budgetEagleUsers', JSON.stringify(users));
  }, [users]);

  const addUser = async (userData: Omit<User, 'id'>) => {
    if (!user) return;
    
    // Finance can add managers, managers can add employees and HR
    if (
      (user.role === 'finance' && userData.role !== 'finance') || 
      (user.role === 'manager' && (userData.role === 'employee' || userData.role === 'hr'))
    ) {
      setIsLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const newUser: User = {
          ...userData,
          id: `user-${Date.now()}`
        };
        
        setUsers(prevUsers => [...prevUsers, newUser]);
        toast.success(`${newUser.name} has been added successfully`);
      } catch (error) {
        toast.error('Failed to add user');
        console.error('Add user error:', error);
      } finally {
        setIsLoading(false);
      }
    } else {
      toast.error('You do not have permission to add this type of user');
    }
  };

  const updateUser = async (userId: string, userData: Partial<User>) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 600));
      
      setUsers(prevUsers => 
        prevUsers.map(u => 
          u.id === userId 
            ? { ...u, ...userData } 
            : u
        )
      );
      toast.success('User updated successfully');
    } catch (error) {
      toast.error('Failed to update user');
      console.error('Update user error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteUser = async (userId: string) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 600));
      
      setUsers(prevUsers => prevUsers.filter(u => u.id !== userId));
      toast.success('User deleted successfully');
    } catch (error) {
      toast.error('Failed to delete user');
      console.error('Delete user error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getUsersByRole = (role: User['role']): User[] => {
    return users.filter(u => u.role === role);
  };

  return (
    <UserContext.Provider value={{ 
      users, 
      isLoading, 
      addUser, 
      updateUser, 
      deleteUser,
      getUsersByRole
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
