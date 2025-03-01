
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Home, FileText, Users, BarChart3, DollarSign, Plus } from 'lucide-react';

const Sidebar: React.FC = () => {
  const { user } = useAuth();
  
  if (!user) return null;
  
  return (
    <aside className="w-64 bg-gray-50 border-r border-gray-200 min-h-screen animate-slide-in">
      <div className="p-4">
        <nav className="space-y-1">
          <NavLink 
            to="/dashboard" 
            className={({ isActive }) => 
              `sidebar-link ${isActive ? 'active' : ''}`
            }
          >
            <Home className="h-5 w-5" />
            <span>Dashboard</span>
          </NavLink>
          
          <NavLink 
            to="/bills" 
            className={({ isActive }) => 
              `sidebar-link ${isActive ? 'active' : ''}`
            }
          >
            <FileText className="h-5 w-5" />
            <span>Bills & Expenses</span>
          </NavLink>
          
          {(user.role === 'employee' || user.role === 'hr') && (
            <NavLink 
              to="/submit-bill" 
              className={({ isActive }) => 
                `sidebar-link ${isActive ? 'active' : ''}`
              }
            >
              <Plus className="h-5 w-5" />
              <span>Submit Bill</span>
            </NavLink>
          )}
          
          {(user.role === 'manager' || user.role === 'finance') && (
            <NavLink 
              to="/user-management" 
              className={({ isActive }) => 
                `sidebar-link ${isActive ? 'active' : ''}`
              }
            >
              <Users className="h-5 w-5" />
              <span>User Management</span>
            </NavLink>
          )}
          
          <NavLink 
            to="/analytics" 
            className={({ isActive }) => 
              `sidebar-link ${isActive ? 'active' : ''}`
            }
          >
            <BarChart3 className="h-5 w-5" />
            <span>Analytics</span>
          </NavLink>
          
          {user.role === 'finance' && (
            <NavLink 
              to="/budgets" 
              className={({ isActive }) => 
                `sidebar-link ${isActive ? 'active' : ''}`
              }
            >
              <DollarSign className="h-5 w-5" />
              <span>Budgets</span>
            </NavLink>
          )}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
