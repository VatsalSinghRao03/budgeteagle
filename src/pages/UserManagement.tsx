
import React, { useState } from 'react';
import { useUser } from '@/contexts/UserContext';
import { useAuth } from '@/contexts/AuthContext';
import PageTitle from '@/components/Common/PageTitle';
import UserManagementTable from '@/components/Users/UserManagementTable';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { UserPlus } from 'lucide-react';
import UserForm from '@/components/Users/UserForm';

const UserManagement: React.FC = () => {
  const { user } = useAuth();
  const { users } = useUser();
  const [addUserDialogOpen, setAddUserDialogOpen] = useState(false);
  
  // Filter users based on current user role
  const filteredUsers = users.filter(u => {
    if (user?.role === 'finance') {
      // Finance admin can see all users
      return true;
    }
    
    if (user?.role === 'manager') {
      // Managers can see employees and HR, but not other managers or finance
      return u.role === 'employee' || u.role === 'hr';
    }
    
    return false;
  });
  
  return (
    <div className="page-container">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <PageTitle 
          title="User Management" 
          subtitle="Add, edit, or remove users from the system" 
        />
        
        <Button 
          onClick={() => setAddUserDialogOpen(true)}
          className="flex items-center gap-2"
        >
          <UserPlus className="h-4 w-4" />
          Add User
        </Button>
      </div>
      
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <UserManagementTable users={filteredUsers} />
      </div>
      
      {/* Add User Dialog */}
      <Dialog open={addUserDialogOpen} onOpenChange={setAddUserDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
          </DialogHeader>
          <UserForm onClose={() => setAddUserDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;
