
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
  Menu,
  ChevronLeft
} from 'lucide-react';
import { cn } from '@/utils/utils';
import { useAuth } from '@/hooks/useAuth';
import { useSidebarContext } from '@/hooks/useSidebarContext';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  activeItem?: string;
  onItemClick?: (item: string) => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/' },
  { id: 'clients', label: 'Clients', icon: Users, path: '/clients' },
  { id: 'notes', label: 'Notes', icon: FileText, path: '/notes' },
  { id: 'scheduling', label: 'Scheduling', icon: Calendar, path: '/scheduling' },
  { id: 'message', label: 'Message', icon: MessageSquare, path: '/message' },
  { id: 'billing', label: 'Billing', icon: CreditCard, path: '/billing' },
  { id: 'reports', label: 'Reports', icon: BarChart3, path: '/reports' },
  { id: 'crm', label: 'CRM', icon: UserPlus, path: '/crm' },
  { id: 'staff', label: 'Staff', icon: Stethoscope, path: '/staff' },
  { id: 'compliance', label: 'Compliance', icon: Shield, path: '/compliance' },
  { id: 'settings', label: 'Practice Settings', icon: Settings, path: '/settings' },
];

const Sidebar: React.FC<SidebarProps> = ({ activeItem: propActiveItem, onItemClick }) => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { isCollapsed, toggleSidebar } = useSidebarContext();

  // Determine active item from props or current route
  const getActiveItem = () => {
    if (propActiveItem) return propActiveItem;
    
    const currentPath = location.pathname;
    if (currentPath === '/') return 'dashboard';
    if (currentPath.startsWith('/notes')) return 'notes';
    if (currentPath.startsWith('/scheduling')) return 'scheduling';
    if (currentPath.startsWith('/clients')) return 'clients';
    if (currentPath.startsWith('/reports')) return 'reports';
    
    const matchedItem = menuItems.find(item => currentPath.startsWith(item.path) && item.path !== '/');
    return matchedItem?.id || 'dashboard';
  };

  const activeItem = getActiveItem();

  const handleItemClick = (item: { id: string; path: string }) => {
    if (onItemClick) {
      onItemClick(item.id);
    } else {
      navigate(item.path);
    }
  };

  return (
    <div 
      className={cn(
        "bg-gradient-to-b from-blue-900 to-blue-800 min-h-screen shadow-xl flex flex-col fixed left-0 top-0 z-50 transition-all duration-300",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header with toggle button */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <img 
                src="/lovable-uploads/767e6203-d61c-4e71-b71b-e30eef1420da.png" 
                alt="MentalSpace Logo" 
                className="h-12 w-auto"
              />
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="text-blue-100 hover:bg-blue-700 hover:text-white"
          >
            {isCollapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
          </Button>
        </div>
        {!isCollapsed && (
          <p className="text-blue-200 text-sm">Electronic Health Records</p>
        )}
      </div>
      
      <nav className="space-y-2 flex-1 px-4">
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => handleItemClick(item)}
              className={cn(
                "w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 text-left",
                activeItem === item.id
                  ? "bg-white text-blue-900 shadow-lg transform scale-105"
                  : "text-blue-100 hover:bg-blue-700 hover:text-white hover:transform hover:scale-102",
                isCollapsed && "justify-center space-x-0"
              )}
              title={isCollapsed ? item.label : undefined}
            >
              <IconComponent size={20} className="text-blue-100" />
              {!isCollapsed && <span className="font-medium">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      <div className="mt-auto pt-4 border-t border-blue-700 px-4 pb-4">
        <Button
          onClick={signOut}
          variant="ghost"
          className={cn(
            "w-full flex items-center space-x-3 px-4 py-3 text-blue-100 hover:bg-blue-700 hover:text-white",
            isCollapsed && "justify-center space-x-0"
          )}
          title={isCollapsed ? "Sign Out" : undefined}
        >
          <LogOut size={20} />
          {!isCollapsed && <span className="font-medium">Sign Out</span>}
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
