
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
  Stethoscope
} from 'lucide-react';
import { cn } from '@/lib/utils';

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

const Sidebar: React.FC<SidebarProps> = ({ activeItem, onItemClick }) => {
  return (
    <div className="bg-gradient-to-b from-blue-900 to-blue-800 w-64 min-h-screen p-4 shadow-xl">
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
      
      <nav className="space-y-2">
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
    </div>
  );
};

export default Sidebar;
