import { USER_ROLES, UserRole } from '@/types/enums/staffEnum';
import { MENU_PERMISSIONS as SIDEBAR_PERMISSIONS } from '@/types/enums/sidebarEnum';

// Define which roles can access each menu item and sub-item
export interface MenuPermission {
  roles: UserRole[];
  allowAll?: boolean; // If true, all authenticated users can access
  allowClients?: boolean; // If true, clients can access (for future use)
}

// Menu item permissions mapping - now using centralized configuration
export const MENU_PERMISSIONS = SIDEBAR_PERMISSIONS;

/**
 * Check if a user with the given role can access a specific menu item
 */
export const canAccessMenuItem = (menuItemId: string, userRole: UserRole | null): boolean => {
  if (!userRole) return false;
  
  const permission = MENU_PERMISSIONS[menuItemId];
  if (!permission) return false;
  
  // If allowAll is true, any authenticated user can access
  if (permission.allowAll) return true;
  
  // Check if the user's role is in the allowed roles list
  return permission.roles.includes(userRole);
};

/**
 * Filter menu items based on user role
 */
export const filterMenuItemsByRole = <T extends { id: string; subItems?: { id: string }[] }>(
  menuItems: T[],
  userRole: UserRole | null
): T[] => {
  return menuItems
    .map(item => {
      // Check if the main item is accessible
      const canAccessMain = canAccessMenuItem(item.id, userRole);
      
      if (!canAccessMain) {
        return null;
      }
      
      // Filter sub-items if they exist
      if (item.subItems) {
        const accessibleSubItems = item.subItems.filter(subItem => 
          canAccessMenuItem(subItem.id, userRole)
        );
        
        // If no sub-items are accessible, don't show the main item
        if (accessibleSubItems.length === 0) {
          return null;
        }
        
        return {
          ...item,
          subItems: accessibleSubItems
        };
      }
      
      return item;
    })
    .filter((item): item is T => item !== null);
};