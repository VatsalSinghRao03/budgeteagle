
import React, { useState } from 'react';
import { User } from '@/types';
import { useUser } from '@/contexts/UserContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

interface UserFormProps {
  onClose: () => void;
  editUser?: User;
}

const UserForm: React.FC<UserFormProps> = ({ onClose, editUser }) => {
  const { user: currentUser } = useAuth();
  const { addUser, updateUser, isLoading } = useUser();
  
  const [formData, setFormData] = useState({
    name: editUser?.name || '',
    email: editUser?.email || '',
    role: editUser?.role || 'employee',
    department: editUser?.department || '',
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleRoleChange = (value: string) => {
    setFormData(prev => ({ 
      ...prev, 
      role: value as 'employee' | 'hr' | 'manager' | 'finance' 
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.department) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    try {
      let success;
      
      if (editUser) {
        success = await updateUser(editUser.id, formData);
      } else {
        success = await addUser(formData as Omit<User, 'id'>);
      }
      
      if (success) {
        onClose();
      }
    } catch (error) {
      console.error('User form error:', error);
    }
  };
  
  // Determine available roles based on current user's role
  const getAvailableRoles = () => {
    if (!currentUser) return [];
    
    if (currentUser.role === 'finance') {
      return ['manager'];
    }
    
    if (currentUser.role === 'manager') {
      return ['employee', 'hr'];
    }
    
    return [];
  };
  
  const availableRoles = getAvailableRoles();
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="form-group">
        <Label htmlFor="name" className="form-label">Full Name</Label>
        <Input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          className="form-input"
          required
        />
      </div>
      
      <div className="form-group">
        <Label htmlFor="email" className="form-label">Email Address</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          className="form-input"
          required
          disabled={!!editUser}
        />
      </div>
      
      <div className="form-group">
        <Label htmlFor="role" className="form-label">Role</Label>
        <Select 
          value={formData.role}
          onValueChange={handleRoleChange}
          disabled={!!editUser || availableRoles.length === 0}
        >
          <SelectTrigger id="role" className="w-full">
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            {availableRoles.map((role) => (
              <SelectItem key={role} value={role}>
                {role.charAt(0).toUpperCase() + role.slice(1)}
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
          type="text"
          value={formData.department}
          onChange={handleChange}
          className="form-input"
          required
        />
      </div>
      
      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : editUser ? 'Update User' : 'Add User'}
        </Button>
      </div>
    </form>
  );
};

export default UserForm;
