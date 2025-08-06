
import React, { useState } from 'react';
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
  ChevronLeft,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/utils/utils';
import { useAuth } from '@/hooks/useAuth';
import { useSidebarContext } from '@/hooks/useSidebarContext';
import { Button } from '@/components/basic/button';

interface SidebarProps {
  activeItem?: string;
  onItemClick?: (item: string) => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number | string; className?: string }>;
  path: string;
  subItems?: {
    id: string;
    label: string;
    path: string;
  }[];
}

const menuItems: MenuItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/' },
  { id: 'clients', label: 'Clients', icon: Users, path: '/clients' },
  { id: 'notes', label: 'Notes', icon: FileText, path: '/notes' },
  { id: 'scheduling', label: 'Scheduling', icon: Calendar, path: '/scheduling' },
  { id: 'message', label: 'Message', icon: MessageSquare, path: '/message' },
  { id: 'billing', label: 'Billing', icon: CreditCard, path: '/billing' },
  { id: 'reports', label: 'Reports', icon: BarChart3, path: '/reports' },
  { id: 'crm', label: 'CRM', icon: UserPlus, path: '/crm' },
  { 
    id: 'staff', 
    label: 'Staff', 
    icon: Stethoscope, 
    path: '/staff',
    subItems: [
      { id: 'staff-list', label: 'All Staff', path: '/staff' },
      { id: 'staff-supervision', label: 'Supervision', path: '/staff/supervision' },
      { id: 'staff-roles', label: 'Roles', path: '/staff/roles' },
      { id: 'staff-permissions', label: 'Permissions', path: '/staff/permissions' },
    ]
  },
  { id: 'compliance', label: 'Compliance', icon: Shield, path: '/compliance' },
  { id: 'settings', label: 'Practice Settings', icon: Settings, path: '/settings' },
];

const Sidebar: React.FC<SidebarProps> = ({ activeItem: propActiveItem, onItemClick }) => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { isCollapsed, toggleSidebar } = useSidebarContext();
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set(['staff']));

  // Determine active item from props or current route
  const getActiveItem = () => {
    if (propActiveItem) return propActiveItem;
    
    const currentPath = location.pathname;
    if (currentPath === '/') return 'dashboard';
    if (currentPath.startsWith('/notes')) return 'notes';
    if (currentPath.startsWith('/scheduling')) return 'scheduling';
    if (currentPath.startsWith('/clients')) return 'clients';
    if (currentPath.startsWith('/reports')) return 'reports';
    
    // Check for sub-items first
    for (const item of menuItems) {
      if (item.subItems) {
        const matchedSubItem = item.subItems.find(subItem => currentPath === subItem.path);
        if (matchedSubItem) {
          return matchedSubItem.id;
        }
      }
    }
    
    // Check for main items
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

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
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
          const isActive = activeItem === item.id || (item.subItems && item.subItems.some(subItem => activeItem === subItem.id));
          const isExpanded = expandedItems.has(item.id);
          
          return (
            <div key={item.id} className="space-y-1">
              <button
                onClick={() => {
                  if (item.subItems) {
                    toggleExpanded(item.id);
                  } else {
                    handleItemClick(item);
                  }
                }}
                className={cn(
                  "w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 text-left",
                  isActive
                    ? "bg-white text-blue-900 shadow-lg transform scale-105"
                    : "text-blue-100 hover:bg-blue-700 hover:text-white hover:transform hover:scale-102",
                  isCollapsed && "justify-center space-x-0"
                )}
                title={isCollapsed ? item.label : undefined}
              >
                <IconComponent 
                  size={20} 
                  className={cn(
                    isActive ? "text-blue-900" : "text-blue-100",
                    "transition-colors duration-200"
                  )} 
                />
                {!isCollapsed && (
                  <>
                    <span className="font-medium">{item.label}</span>
                    {item.subItems && (
                      <div className="ml-auto">
                        {isExpanded ? (
                          <ChevronDown size={16} className="text-blue-100" />
                        ) : (
                          <ChevronRight size={16} className="text-blue-100" />
                        )}
                      </div>
                    )}
                  </>
                )}
              </button>
              
              {/* Render sub-items if they exist and sidebar is not collapsed */}
              {item.subItems && !isCollapsed && isExpanded && (
                <div className="ml-6 space-y-1">
                  {item.subItems.map((subItem) => (
                    <button
                      key={subItem.id}
                      onClick={() => handleItemClick(subItem)}
                      className={cn(
                        "w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition-all duration-200 text-left text-sm",
                        activeItem === subItem.id
                          ? "bg-blue-700 text-white shadow-md"
                          : "text-blue-200 hover:bg-blue-700 hover:text-white"
                      )}
                    >
                      <span className="w-2 h-2 bg-blue-300 rounded-full"></span>
                      <span className="font-medium">{subItem.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
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
