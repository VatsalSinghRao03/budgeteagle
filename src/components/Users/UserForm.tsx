
import React, { useState } from 'react';
import { useUser } from '@/contexts/UserContext';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface UserFormProps {
  onSuccess?: () => void;
}

const UserForm: React.FC<UserFormProps> = ({ onSuccess }) => {
  const { user: currentUser } = useAuth();
  const { addUser, isLoading } = useUser();
  
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    role: '',
    department: '',
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleRoleChange = (role: string) => {
    setUserData(prev => ({ ...prev, role }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) return;
    
    try {
      await addUser({
        name: userData.name,
        email: userData.email,
        role: userData.role as any,
        department: userData.department,
      });
      
      // Reset form
      setUserData({
        name: '',
        email: '',
        role: '',
        department: '',
      });
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      toast.error('Failed to add user');
      console.error('Error adding user:', error);
    }
  };
  
  // Determine which roles the current user can add
  const allowedRoles = () => {
    if (currentUser?.role === 'finance') {
      return [{ value: 'manager', label: 'Manager' }];
    }
    
    if (currentUser?.role === 'manager') {
      return [
        { value: 'employee', label: 'Employee' },
        { value: 'hr', label: 'HR' },
      ];
    }
    
    return [];
  };
  
  return (
    <div className="glass-card p-6 rounded-lg animate-fade-in">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="form-group">
          <Label htmlFor="name" className="form-label">Full Name</Label>
          <Input
            id="name"
            name="name"
            placeholder="Enter full name"
            value={userData.name}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>
        
        <div className="form-group">
          <Label htmlFor="email" className="form-label">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="user@example.com"
            value={userData.email}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-group">
            <Label htmlFor="role" className="form-label">Role</Label>
            <Select
              value={userData.role}
              onValueChange={handleRoleChange}
              required
            >
              <SelectTrigger className="form-input">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                {allowedRoles().map(role => (
                  <SelectItem key={role.value} value={role.value}>
                    {role.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="form-group">
            <Label htmlFor="department" className="form-label">Department</Label>
            <Input
              id="department"
              name="department"
              placeholder="e.g. Marketing, Finance"
              value={userData.department}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <p className="text-xs text-blue-700">
            The user will be created with a default password of "password". 
            They will be able to change it after their first login.
          </p>
        </div>
        
        <div className="flex justify-end">
          <Button 
            type="submit"
            disabled={isLoading || !userData.name || !userData.email || !userData.role || !userData.department}
            className="btn-primary"
          >
            {isLoading ? 'Adding User...' : 'Add User'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default UserForm;
