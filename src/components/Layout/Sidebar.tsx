
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Receipt, 
  Users, 
  BarChart4,
  IndianRupee,
  PlusCircle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Sidebar: React.FC = () => {
  const { user } = useAuth();
  
  if (!user) return null;
  
  // Define navigation items based on user role
  const navItems = [
    {
      title: 'Dashboard',
      path: '/dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />,
      roles: ['employee', 'hr', 'manager', 'finance'],
    },
    {
      title: 'Bills & Expenses',
      path: '/bills',
      icon: <Receipt className="w-5 h-5" />,
      roles: ['employee', 'hr', 'manager', 'finance'],
    },
    {
      title: 'Submit Bill',
      path: '/submit-bill',
      icon: <PlusCircle className="w-5 h-5" />,
      roles: ['employee', 'hr'],
    },
    {
      title: 'User Management',
      path: '/users',
      icon: <Users className="w-5 h-5" />,
      roles: ['manager', 'finance'],
    },
    {
      title: 'Analytics',
      path: '/analytics',
      icon: <BarChart4 className="w-5 h-5" />,
      roles: ['manager', 'finance'],
    },
    {
      title: 'Budgets',
      path: '/budgets',
      icon: <IndianRupee className="w-5 h-5" />,
      roles: ['finance'],
    }
  ];
  
  // Filter items based on user role
  const filteredNavItems = navItems.filter(item => 
    item.roles.includes(user.role as any)
  );
  
  return (
    <aside className="w-60 min-h-screen bg-white border-r border-gray-200 flex flex-col">
      <nav className="flex-1 py-5 px-3">
        <ul className="space-y-1">
          {filteredNavItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) => 
                  `sidebar-link ${isActive ? 'active' : ''}`
                }
              >
                {item.icon}
                <span>{item.title}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
