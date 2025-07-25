import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { PermissionEntity } from './entities/permission.entity';

@Injectable()
export class PermissionsService {
  constructor(private prisma: PrismaService) {}

  async getUserPermissions(userId: string): Promise<PermissionEntity[]> {
    // This is a simplified implementation. In a real application, you would have
    // a more complex permission system with roles, permissions, and user-role mappings.
    
    // For now, we'll return basic permissions based on user role
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        userRoles: true,
      },
    });

    if (!user) {
      return [];
    }

    // Default permissions for all users
    const defaultPermissions: PermissionEntity[] = [
      { category: 'clinical_notes', action: 'read', scope: 'assigned_only' },
      { category: 'schedule', action: 'read', scope: 'own_only' },
    ];

    // Add role-based permissions
    const rolePermissions: PermissionEntity[] = [];
    
    for (const userRole of user.userRoles) {
      switch (userRole.role) {
        case 'admin':
          rolePermissions.push(
            { category: 'user_management', action: 'read', scope: 'all' },
            { category: 'user_management', action: 'create', scope: 'all' },
            { category: 'user_management', action: 'update', scope: 'all' },
            { category: 'user_management', action: 'assign_roles', scope: 'all' },
            { category: 'audit_logs', action: 'read', scope: 'all' },
            { category: 'schedule', action: 'read', scope: 'all' },
            { category: 'schedule', action: 'update', scope: 'all' },
            { category: 'schedule', action: 'create', scope: 'all' },
            { category: 'clinical_notes', action: 'create', scope: 'all' },
            { category: 'clinical_notes', action: 'read', scope: 'all' },
            { category: 'clinical_notes', action: 'update', scope: 'all' },
            { category: 'billing', action: 'collect_copay', scope: 'all' },
            { category: 'billing', action: 'process_payment', scope: 'all' },
            { category: 'billing', action: 'generate_claims', scope: 'all' }
          );
          break;
        case 'provider':
          rolePermissions.push(
            { category: 'clinical_notes', action: 'create', scope: 'assigned_only' },
            { category: 'clinical_notes', action: 'read', scope: 'assigned_only' },
            { category: 'clinical_notes', action: 'update', scope: 'assigned_only' },
            { category: 'schedule', action: 'read', scope: 'own_only' },
            { category: 'schedule', action: 'update', scope: 'own_only' },
            { category: 'billing', action: 'collect_copay', scope: 'assigned_only' },
            { category: 'billing', action: 'process_payment', scope: 'assigned_only' }
          );
          break;
        case 'staff':
          rolePermissions.push(
            { category: 'schedule', action: 'read', scope: 'all' },
            { category: 'schedule', action: 'update', scope: 'all' },
            { category: 'clinical_notes', action: 'read', scope: 'assigned_only' },
            { category: 'billing', action: 'collect_copay', scope: 'assigned_only' }
          );
          break;
      }
    }

    return [...defaultPermissions, ...rolePermissions];
  }

  async canAccessPatient(userId: string, clientId: string, accessType: string = 'read'): Promise<boolean> {
    // This is a simplified implementation. In a real application, you would check
    // the actual patient assignments, relationships, and permissions.
    
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        userRoles: true,
      },
    });

    if (!user) {
      return false;
    }

    // Admin can access all patients
    const isAdmin = user.userRoles.some(ur => ur.role === 'admin');
    if (isAdmin) {
      return true;
    }

    // For other roles, check if they have any relationship with the client
    // This is a simplified check - in reality you'd check appointments, notes, etc.
    const hasRelationship = await this.prisma.appointment.findFirst({
      where: {
        OR: [
          { providerId: userId, clientId },
          { clientId }
        ]
      }
    });

    return !!hasRelationship;
  }
} 