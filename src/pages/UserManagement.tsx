
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUser } from '@/contexts/UserContext';
import PageTitle from '@/components/Common/PageTitle';
import UserManagementTable from '@/components/Users/UserManagementTable';
import UserForm from '@/components/Users/UserForm';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { UserPlus } from 'lucide-react';

const UserManagement: React.FC = () => {
  const { user } = useAuth();
  const { users } = useUser();
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  
  // Filter users based on the current user's role
  const filteredUsers = () => {
    if (!user) return [];
    
    // Finance users can see and manage managers
    if (user.role === 'finance') {
      return users.filter(u => u.role === 'manager');
    }
    
    // Managers can see and manage employees and HR
    if (user.role === 'manager') {
      return users.filter(u => u.role === 'employee' || u.role === 'hr');
    }
    
    return [];
  };
  
  return (
    <div className="page-container">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <PageTitle title="User Management" />
        <Button 
          onClick={() => setIsAddUserDialogOpen(true)}
          className="bg-brand-blue hover:bg-opacity-90"
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>
      
      <UserManagementTable users={filteredUsers()} />
      
      <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
          </DialogHeader>
          <UserForm onSuccess={() => setIsAddUserDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;
