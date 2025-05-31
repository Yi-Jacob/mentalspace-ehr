import React from 'react';
import { 
  Home, 
  Users, 
  Calendar, 
  FileText, 
  MessageSquare, 
  CreditCard, 
  Building,
} from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggle }) => {
  const location = useLocation();

  const navigationItems = [
    { 
      path: '/', 
      icon: Home, 
      label: 'Dashboard',
      description: 'Practice overview and quick actions'
    },
    { 
      path: '/clients', 
      icon: Users, 
      label: 'Clients',
      description: 'Manage client information and records'
    },
    { 
      path: '/scheduling', 
      icon: Calendar, 
      label: 'Scheduling',
      description: 'Appointment management and calendar'
    },
    { 
      path: '/documentation', 
      icon: FileText, 
      label: 'Documentation',
      description: 'Clinical notes and treatment plans'
    },
    { 
      path: '/messages', 
      icon: MessageSquare, 
      label: 'Messages',
      description: 'Client communication and messaging'
    },
    { 
      path: '/billing', 
      icon: CreditCard, 
      label: 'Billing',
      description: 'Insurance, claims, and payment processing'
    },
    { 
      path: '/staff', 
      icon: Building, 
      label: 'Staff',
      description: 'Staff management and supervision'
    },
  ];

  return (
    <div
      className={cn(
        "flex flex-col h-full bg-gray-100 border-r shadow-sm transition-all duration-300",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex items-center justify-end p-3">
        <Button variant="ghost" size="icon" onClick={onToggle}>
          {isCollapsed ? <div className="text-xs">Expand</div> : <div className="text-xs">Collapse</div>}
        </Button>
      </div>
      <nav className="flex-1 px-2 py-4">
        {navigationItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "group flex items-center space-x-3 py-2 px-3 rounded-md hover:bg-gray-200 transition-colors duration-200",
                isActive
                  ? "bg-gray-200 font-semibold"
                  : "text-gray-600 group-hover:text-gray-900"
              )
            }
          >
            <item.icon className="h-4 w-4" />
            <span className={cn("text-sm font-medium", isCollapsed && "hidden")}>
              {item.label}
            </span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
