
import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
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
  ChevronRight,
  Home,
  Circle
} from 'lucide-react';
import { cn } from '@/utils/utils';
import { useAuth } from '@/hooks/useAuth';
import { useSidebarContext } from '@/hooks/useSidebarContext';
import { useIsMobile } from '@/hooks/use-mobile';
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
  { 
    id: 'notes', 
    label: 'Notes', 
    icon: FileText, 
    path: '/notes',
    subItems: [
      { id: 'all-notes', label: 'All Notes', path: '/notes/all-notes' },
      { id: 'create-note', label: 'Create Note', path: '/notes/create-note' },
      { id: 'pending-approvals', label: 'Pending Approvals', path: '/notes/pending-approvals' },
    ]
  },
  { 
    id: 'scheduling', 
    label: 'Scheduling', 
    icon: Calendar, 
    path: '/scheduling',
    subItems: [
      { id: 'calendar', label: 'Calendar', path: '/scheduling/calendar' },
      { id: 'appointments', label: 'Appointments', path: '/scheduling/appointments' },
      { id: 'work-schedule', label: 'Work Schedule', path: '/scheduling/work-schedule' },
    ]
  },
  { id: 'message', label: 'Message', icon: MessageSquare, path: '/message' },
  { 
    id: 'billing', 
    label: 'Billing', 
    icon: CreditCard, 
    path: '/billing',
    subItems: [
      { id: 'payer-management', label: 'Payer Management', path: '/billing/payer-management' },
      { id: 'insurance-verification', label: 'Insurance Verification', path: '/billing/insurance-verification' },
      { id: 'claims-submission', label: 'Claims Submission', path: '/billing/claims-submission' },
      { id: 'payment-processing', label: 'Payment Processing', path: '/billing/payment-processing' },
      { id: 'statement-generation', label: 'Statement Generation', path: '/billing/statement-generation' },
    ]
  },
  {
    id: 'staff',
    label: 'Staff',
    icon: Stethoscope,
    path: '/staff',
    subItems: [
      { id: 'staff-list', label: 'Staffs', path: '/staff' },
      { id: 'staff-supervision', label: 'Supervision', path: '/staff/supervision' },
    ]
  },
  {
    id: 'users',
    label: 'Users',
    icon: Users,
    path: '/users',
    subItems: [
      { id: 'users-list', label: 'Users', path: '/users' },
      { id: 'users-roles', label: 'Roles', path: '/users/roles' },
      { id: 'users-permissions', label: 'Permissions', path: '/users/permissions' },
    ]
  },
  { 
    id: 'compliance', 
    label: 'Compliance', 
    icon: Shield, 
    path: '/compliance',
    subItems: [
      { id: 'compensation', label: 'Compensation', path: '/compliance/compensation' },
      { id: 'sessions', label: 'Sessions', path: '/compliance/sessions' },
      { id: 'time-tracking', label: 'Time Tracking', path: '/compliance/time-tracking' },
      { id: 'payments', label: 'Payments', path: '/compliance/payments' },
      { id: 'deadlines', label: 'Deadlines', path: '/compliance/deadlines' }
    ]
  },
];

const Sidebar: React.FC<SidebarProps> = ({ activeItem: propActiveItem, onItemClick }) => {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { isCollapsed, toggleSidebar } = useSidebarContext();
  const isMobile = useIsMobile();
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set(['staff', 'notes', 'scheduling', 'compliance', 'billing']));

  const getActiveItem = () => {
    if (propActiveItem) return propActiveItem;

    const currentPath = location.pathname;
    if (currentPath === '/') return 'dashboard';
    if (currentPath.startsWith('/scheduling')) return 'scheduling';
    if (currentPath.startsWith('/clients')) return 'clients';
    if (currentPath.startsWith('/reports')) return 'reports';

    // Handle notes sub-items
    if (currentPath.startsWith('/notes')) {
      for (const item of menuItems) {
        if (item.id === 'notes' && item.subItems) {
          const matchedSubItem = item.subItems.find(subItem => currentPath === subItem.path);
          if (matchedSubItem) {
            return matchedSubItem.id;
          }
        }
      }
      // If no specific sub-item matches, return 'notes' for the main notes page
      return 'notes';
    }

    // Handle billing sub-items
    if (currentPath.startsWith('/billing')) {
      for (const item of menuItems) {
        if (item.id === 'billing' && item.subItems) {
          const matchedSubItem = item.subItems.find(subItem => currentPath === subItem.path);
          if (matchedSubItem) {
            return matchedSubItem.id;
          }
        }
      }
      // If no specific sub-item matches, return 'billing' for the main billing page
      return 'billing';
    }

    // Handle users sub-items
    if (currentPath.startsWith('/users')) {
      for (const item of menuItems) {
        if (item.id === 'users' && item.subItems) {
          const matchedSubItem = item.subItems.find(subItem => currentPath === subItem.path);
          if (matchedSubItem) {
            return matchedSubItem.id;
          }
        }
      }
      // If no specific sub-item matches, return 'users' for the main users page
      return 'users';
    }

    // Handle compliance sub-items
    if (currentPath.startsWith('/compliance')) {
      for (const item of menuItems) {
        if (item.id === 'compliance' && item.subItems) {
          const matchedSubItem = item.subItems.find(subItem => currentPath === subItem.path);
          if (matchedSubItem) {
            return matchedSubItem.id;
          }
        }
      }
      // If no specific sub-item matches, return 'compliance-overview' for the main compliance page
      return 'compliance-overview';
    }

    for (const item of menuItems) {
      if (item.subItems) {
        const matchedSubItem = item.subItems.find(subItem => currentPath === subItem.path);
        if (matchedSubItem) {
          return matchedSubItem.id;
        }
      }
    }

    const matchedItem = menuItems.find(item => currentPath.startsWith(item.path) && item.path !== '/');
    return matchedItem?.id || 'dashboard';
  };

  const activeItem = getActiveItem();

  const handleItemClick = (item: { id: string; path: string }, event: React.MouseEvent) => {
    // If middle click (scroll wheel click), open in new tab
    if (event.button === 1) {
      event.preventDefault();
      event.stopPropagation();
      window.open(item.path, '_blank');
      return;
    }

    // If onItemClick prop is provided, use it
    if (onItemClick) {
      onItemClick(item.id);
      return;
    }

    // Otherwise, navigate in the same tab (Link component will handle this)
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
    <>
      {/* Mobile Overlay */}
      {isMobile && !isCollapsed && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
      
      <div
        className={cn(
          "bg-gradient-to-b from-blue-900 via-blue-800 to-blue-900 h-screen shadow-xl flex flex-col fixed left-0 top-0 z-50 transition-all duration-300",
          isCollapsed ? "w-16" : "w-64",
          "max-h-screen overflow-hidden",
          isMobile && isCollapsed && "-translate-x-full",
          isMobile && "backdrop-blur-md"
        )}
      >
      {/* Header */}
      <div className="p-4 border-b border-blue-700 flex-shrink-0">
        <div className="flex items-center justify-center">
          {!isCollapsed ? (
            <div className="flex items-center space-x-3">
              <img
                src="/lovable-uploads/767e6203-d61c-4e71-b71b-e30eef1420da.png"
                alt="MentalSpace Logo"
                className="h-12 w-auto"
              />
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <img
                src="/lovable-uploads/767e6203-d61c-4e71-b71b-e30eef1420da.png"
                alt="MentalSpace Logo"
                className="h-8 w-auto"
              />
            </div>
          )}
        </div>
      </div>

      {/* User Info and Sign Out Section */}
      <div className="p-3 border-b border-blue-700 flex-shrink-0">
        {!isCollapsed ? (
          <div className="px-3 py-2 bg-slate-700/40 rounded-lg border border-slate-600/30">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="text-white text-sm font-medium">
                  {user ? `${user.firstName} ${user.lastName}` : 'User'}
                </div>
                <div className="text-slate-300 text-xs">
                  {user?.roles?.[0] || 'Staff'}
                </div>
              </div>
              
              {/* Sign Out Button */}
              <Button
                onClick={signOut}
                variant="ghost"
                className="flex items-center justify-center p-2 text-slate-300 hover:bg-red-500/20 hover:text-red-300 rounded-lg transition-all duration-200 ml-2"
                title="Sign Out"
              >
                <LogOut size={16} />
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-2">
            {/* User Avatar/Initials */}
            <div className="w-10 h-10 bg-slate-600 rounded-full flex items-center justify-center text-white font-medium text-sm border border-slate-500/30">
              {user ? `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}` : 'U'}
            </div>
            
            {/* Sign Out Button */}
            <Button
              onClick={signOut}
              variant="ghost"
              className="w-full flex items-center justify-center px-2 py-3 text-slate-300 hover:bg-red-500/20 hover:text-red-300 rounded-xl transition-all duration-200"
              title="Sign Out"
            >
              <div className="flex items-center justify-center rounded-lg transition-all duration-200 w-8 h-8 bg-red-500/20 text-red-300">
                <LogOut size={16} />
              </div>
            </Button>
          </div>
        )}
      </div>

      {/* Collapse Button */}
      <div className="px-3 py-4 flex-shrink-0">
        <Button
          variant="ghost"
          onClick={toggleSidebar}
          className={cn(
            "w-full bg-slate-700/50 text-slate-200 hover:bg-slate-600 hover:text-white rounded-xl transition-all duration-200 group",
            "border border-slate-600/30 shadow-sm hover:shadow-md",
            "focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-blue-900",
            "focus:outline-none focus:bg-slate-600 focus:text-white",
            isCollapsed ? "justify-center" : "justify-between",
            isCollapsed ? "hover:border-slate-500/50" : "hover:border-slate-500/50"
          )}
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          aria-label={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? (
            <>
              <Menu size={18} className="group-hover:scale-110 transition-transform duration-200" />
              <span className="sr-only">Expand Sidebar</span>
            </>
          ) : (
            <>
              <span className="text-sm font-medium">Collapse</span>
              <ChevronLeft size={18} className="group-hover:scale-110 transition-transform duration-200" />
            </>
          )}
        </Button>
      </div>

      {/* Navigation - Scrollable */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto overflow-x-hidden min-h-0 sidebar-scrollbar">
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = activeItem === item.id || (item.subItems && item.subItems.some(subItem => activeItem === subItem.id));
          const isExpanded = expandedItems.has(item.id);

          return (
            <div key={item.id} className="space-y-1">
              {item.subItems ? (
                // Items with sub-items - keep as button for expansion
                <button
                  onClick={() => toggleExpanded(item.id)}
                  className={cn(
                    "w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-left group relative",
                    isActive
                      ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25"
                      : "text-white hover:bg-blue-700/50 hover:text-white",
                    isCollapsed && "justify-center space-x-0 px-2 py-3"
                  )}
                  style={{ color: 'white' }}
                  title={isCollapsed ? item.label : undefined}
                >
                  {/* Active indicator */}
                  {isActive && !isCollapsed && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full"></div>
                  )}

                  <div className={cn(
                    "flex items-center justify-center rounded-xl transition-all duration-200",
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-blue-700/50 text-white group-hover:bg-blue-600 group-hover:text-white"
                  )}>
                    <IconComponent size={18} />
                  </div>

                  {!isCollapsed && (
                    <>
                      <span className="font-medium text-sm flex-1" style={{ color: 'white' }}>{item.label}</span>
                      <div className="ml-auto flex-shrink-0">
                        {isExpanded ? (
                          <ChevronDown size={14} className="text-white" />
                        ) : (
                          <ChevronRight size={14} className="text-white" />
                        )}
                      </div>
                    </>
                  )}
                </button>
              ) : (
                // Items without sub-items - use Link component
                <Link
                  to={item.path}
                  onClick={(event) => handleItemClick(item, event)}
                  onMouseDown={(event) => {
                    // Prevent default behavior for middle click
                    if (event.button === 1) {
                      event.preventDefault();
                      event.stopPropagation();
                    }
                  }}
                  className={cn(
                    "w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-left group relative no-underline hover:no-underline focus:no-underline",
                    isActive
                      ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25"
                      : "text-white hover:bg-blue-700/50 hover:text-white",
                    isCollapsed && "justify-center space-x-0 px-2 py-3"
                  )}
                  style={{ color: 'white' }}
                  title={isCollapsed ? item.label : undefined}
                >
                  {/* Active indicator */}
                  {isActive && !isCollapsed && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full"></div>
                  )}

                  <div className={cn(
                    "flex items-center justify-center rounded-xl transition-all duration-200",
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-blue-700/50 text-white group-hover:bg-blue-600 group-hover:text-white"
                  )}>
                    <IconComponent size={18} />
                  </div>

                  {!isCollapsed && (
                    <span className="font-medium text-sm flex-1" style={{ color: 'white' }}>{item.label}</span>
                  )}
                </Link>
              )}

              {/* Sub-items */}
              {item.subItems && !isCollapsed && isExpanded && (
                <div className="ml-4 space-y-1">
                  {item.subItems.map((subItem) => (
                    <Link
                      key={subItem.id}
                      to={subItem.path}
                      onClick={(event) => handleItemClick(subItem, event)}
                      onMouseDown={(event) => {
                        // Prevent default behavior for middle click
                        if (event.button === 1) {
                          event.preventDefault();
                          event.stopPropagation();
                        }
                      }}
                      className={cn(
                        "w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 text-left text-sm relative no-underline hover:no-underline focus:no-underline",
                        activeItem === subItem.id
                          ? "bg-blue-500/30 text-white border border-blue-400/50"
                          : "text-white hover:bg-blue-700/50 hover:text-white"
                      )}
                      style={{ color: 'white' }}
                    >
                      <div className={cn(
                        "flex items-center justify-center rounded-full transition-all duration-200",
                        activeItem === subItem.id 
                          ? "bg-blue-300 text-blue-800" 
                          : "bg-blue-400/50 text-blue-200"
                      )}>
                        <Circle size={12} fill="currentColor" />
                      </div>
                      <span className="font-medium" style={{ color: 'white' }}>{subItem.label}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

    </div>
    </>
  );
};

export default Sidebar;
