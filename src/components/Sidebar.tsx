
import React from 'react';
import { 
  Home, 
  Users, 
  Calendar, 
  FileText, 
  MessageSquare, 
  CreditCard, 
  Building,
  Menu,
  X
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggle }) => {
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
        "flex flex-col h-full bg-white border-r border-gray-200 shadow-sm transition-all duration-300 relative",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-lg font-semibold text-gray-900">MentalSpace</h1>
          </div>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onToggle}
          className="p-2 hover:bg-gray-100"
        >
          {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navigationItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200",
                isActive
                  ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )
            }
            title={isCollapsed ? item.label : ''}
          >
            <item.icon className={cn("flex-shrink-0", isCollapsed ? "h-5 w-5" : "h-5 w-5 mr-3")} />
            {!isCollapsed && (
              <span className="flex-1">{item.label}</span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      {!isCollapsed && (
        <div className="p-4 border-t border-gray-200">
          <div className="text-xs text-gray-500 text-center">
            EHR System v1.0
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
