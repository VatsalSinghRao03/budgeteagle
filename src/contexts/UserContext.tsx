
import React, { createContext, useContext, useState } from 'react';
import { User } from '@/types';
import { toast } from 'sonner';
import { useAuth } from './AuthContext';

interface UserContextType {
  users: User[];
  addUser: (userData: Omit<User, 'id'>) => Promise<boolean>;
  updateUser: (id: string, userData: Partial<User>) => Promise<boolean>;
  deleteUser: (id: string) => Promise<boolean>;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user: currentUser } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // Initial users will come from the AuthContext's demo users
  const [users, setUsers] = useState<User[]>([
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
  ]);

  const addUser = async (userData: Omit<User, 'id'>): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Check authorization
      if (!currentUser) {
        toast.error('You must be logged in to add users');
        return false;
      }
      
      // Only manager can add employees and HR
      if (currentUser.role === 'manager' && 
          (userData.role !== 'employee' && userData.role !== 'hr')) {
        toast.error('Managers can only add employees and HR personnel');
        return false;
      }
      
      // Only finance can add managers
      if (currentUser.role === 'finance' && userData.role !== 'manager') {
        toast.error('Finance department can only add managers');
        return false;
      }
      
      // Check if email already exists
      if (users.some(u => u.email.toLowerCase() === userData.email.toLowerCase())) {
        toast.error('A user with this email already exists');
        return false;
      }
      
      const newUser: User = {
        ...userData,
        id: `user-${Date.now()}`,
        avatar: '/placeholder.svg'
      };
      
      setUsers(prev => [...prev, newUser]);
      toast.success(`${newUser.name} has been added successfully`);
      return true;
    } catch (error) {
      toast.error('Failed to add user');
      console.error('Add user error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = async (id: string, userData: Partial<User>): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setUsers(prev => 
        prev.map(user => 
          user.id === id ? { ...user, ...userData } : user
        )
      );
      
      toast.success('User updated successfully');
      return true;
    } catch (error) {
      toast.error('Failed to update user');
      console.error('Update user error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteUser = async (id: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Prevent self-deletion
      if (currentUser?.id === id) {
        toast.error('You cannot delete your own account');
        return false;
      }
      
      // Find user to delete
      const userToDelete = users.find(u => u.id === id);
      
      if (!userToDelete) {
        toast.error('User not found');
        return false;
      }
      
      // Check authorization
      if (currentUser?.role === 'manager' && userToDelete.role === 'manager') {
        toast.error('Managers cannot delete other managers');
        return false;
      }
      
      setUsers(prev => prev.filter(user => user.id !== id));
      toast.success(`${userToDelete.name} has been removed`);
      return true;
    } catch (error) {
      toast.error('Failed to delete user');
      console.error('Delete user error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <UserContext.Provider 
      value={{ 
        users, 
        addUser, 
        updateUser, 
        deleteUser,
        isLoading
      }}
    >
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
