
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
  X,
  BarChart3,
  UserCheck,
  Shield,
  Settings
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
      path: '/documentation', 
      icon: FileText, 
      label: 'Documentation',
      description: 'Clinical notes and treatment plans'
    },
    { 
      path: '/scheduling', 
      icon: Calendar, 
      label: 'Scheduling',
      description: 'Appointment management and calendar'
    },
    { 
      path: '/messages', 
      icon: MessageSquare, 
      label: 'Message',
      description: 'Client communication and messaging'
    },
    { 
      path: '/billing', 
      icon: CreditCard, 
      label: 'Billing',
      description: 'Insurance, claims, and payment processing'
    },
    { 
      path: '/reports', 
      icon: BarChart3, 
      label: 'Reports',
      description: 'Analytics and reporting'
    },
    { 
      path: '/crm', 
      icon: UserCheck, 
      label: 'CRM',
      description: 'Customer relationship management'
    },
    { 
      path: '/staff', 
      icon: Building, 
      label: 'Staff',
      description: 'Staff management and supervision'
    },
    { 
      path: '/compliance', 
      icon: Shield, 
      label: 'Compliance',
      description: 'Compliance tracking and management'
    },
    { 
      path: '/practice-settings', 
      icon: Settings, 
      label: 'Practice Settings',
      description: 'System configuration and settings'
    },
  ];

  return (
    <div
      className={cn(
        "flex flex-col h-full bg-blue-600 text-white shadow-lg transition-all duration-300 relative",
        isCollapsed ? "w-16" : "w-80"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        {!isCollapsed && (
          <div className="flex flex-col">
            <div className="flex items-center space-x-2 mb-1">
              <div className="text-2xl font-bold italic text-white">MentalSpace</div>
            </div>
            <div className="text-sm text-blue-200">Electronic Health Records</div>
          </div>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onToggle}
          className="p-2 hover:bg-blue-500 text-white"
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
                "group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200",
                isActive
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-white hover:bg-blue-500 hover:bg-opacity-70"
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
        <div className="p-4 border-t border-blue-500">
          <div className="text-xs text-blue-200 text-center">
            EHR System v1.0
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
