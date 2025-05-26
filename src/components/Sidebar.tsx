import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Calendar, 
  MessageSquare, 
  CreditCard, 
  BarChart3, 
  UserPlus, 
  Shield, 
  Settings,
  Stethoscope,
  LogOut,
  Home
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  activeItem: string;
  onItemClick: (item: string) => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'clients', label: 'Clients', icon: Users },
  { id: 'documentation', label: 'Documentation', icon: FileText },
  { id: 'scheduling', label: 'Scheduling', icon: Calendar },
  { id: 'message', label: 'Message', icon: MessageSquare },
  { id: 'billing', label: 'Billing', icon: CreditCard },
  { id: 'reports', label: 'Reports', icon: BarChart3 },
  { id: 'crm', label: 'CRM', icon: UserPlus },
  { id: 'staff', label: 'Staff', icon: Stethoscope },
  { id: 'compliance', label: 'Compliance', icon: Shield },
  { id: 'settings', label: 'Practice Settings', icon: Settings },
];

const navigationItems = [
  {
    name: 'Dashboard',
    path: '/',
    icon: Home,
  },
  {
    name: 'Documentation',
    path: '/documentation',
    icon: FileText,
  },
  {
    name: 'Scheduling',
    path: '/scheduling',
    icon: Calendar,
  },
];

const Sidebar: React.FC<SidebarProps> = ({ activeItem, onItemClick }) => {
  const { signOut } = useAuth();

  return (
    <div className="bg-gradient-to-b from-blue-900 to-blue-800 w-64 min-h-screen p-4 shadow-xl flex flex-col">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <img 
            src="/lovable-uploads/767e6203-d61c-4e71-b71b-e30eef1420da.png" 
            alt="MentalSpace Logo" 
            className="h-12 w-auto"
          />
        </div>
        <p className="text-blue-200 text-sm">Electronic Health Records</p>
      </div>
      
      <nav className="space-y-2 flex-1">
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onItemClick(item.id)}
              className={cn(
                "w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 text-left",
                activeItem === item.id
                  ? "bg-white text-blue-900 shadow-lg transform scale-105"
                  : "text-blue-100 hover:bg-blue-700 hover:text-white hover:transform hover:scale-102"
              )}
            >
              <IconComponent size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="mt-auto pt-4 border-t border-blue-700">
        <Button
          onClick={signOut}
          variant="ghost"
          className="w-full flex items-center space-x-3 px-4 py-3 text-blue-100 hover:bg-blue-700 hover:text-white"
        >
          <LogOut size={20} />
          <span className="font-medium">Sign Out</span>
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
