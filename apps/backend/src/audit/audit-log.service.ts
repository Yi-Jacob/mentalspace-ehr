import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { Request } from 'express';
import { DeviceDetector, DeviceInfo } from './utils/device-detector';

export interface AuditLogData {
  userId: string;
  userEmail: string;
  userRole?: string;
  action: 'CREATE' | 'READ' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT' | 'ACCESS';
  resource: string;
  resourceId?: string;
  description: string;
  ipAddress?: string;
  userAgent?: string;
  deviceType?: string;
  browser?: string;
  os?: string;
  oldValues?: any;
  newValues?: any;
}

@Injectable()
export class AuditLogService {
  private readonly logger = new Logger(AuditLogService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Create an audit log entry
   */
  async log(data: AuditLogData): Promise<void> {
    try {
      await this.prisma.auditLog.create({
        data: {
          userId: data.userId,
          userEmail: data.userEmail,
          userRole: data.userRole,
          action: data.action,
          resource: data.resource,
          resourceId: data.resourceId,
          description: data.description,
          ipAddress: data.ipAddress,
          userAgent: data.userAgent,
          deviceType: data.deviceType,
          browser: data.browser,
          os: data.os,
          oldValues: data.oldValues,
          newValues: data.newValues,
        },
      });

      // Also log to console for development/debugging
      this.logger.log(`AUDIT: ${data.action} ${data.resource} by ${data.userEmail} from ${data.deviceType || 'unknown'} device - ${data.description}`);
    } catch (error) {
      this.logger.error('Failed to create audit log:', error);
      // Don't throw error to prevent breaking the main operation
    }
  }

  /**
   * Log user authentication events
   */
  async logAuthentication(
    userId: string,
    userEmail: string,
    userRole: string,
    action: 'LOGIN' | 'LOGOUT',
    deviceInfo: DeviceInfo
  ): Promise<void> {
    await this.log({
      userId,
      userEmail,
      userRole,
      action,
      resource: 'Authentication',
      description: `${action === 'LOGIN' ? 'User logged in' : 'User logged out'}`,
      ipAddress: deviceInfo.ipAddress,
      userAgent: deviceInfo.userAgent,
      deviceType: deviceInfo.deviceType,
      browser: deviceInfo.browser,
      os: deviceInfo.os,
    });
  }

  /**
   * Log data access events
   */
  async logDataAccess(
    userId: string,
    userEmail: string,
    userRole: string,
    action: 'READ' | 'ACCESS',
    resource: string,
    resourceId?: string,
    deviceInfo?: DeviceInfo
  ): Promise<void> {
    await this.log({
      userId,
      userEmail,
      userRole,
      action,
      resource,
      resourceId,
      description: `${action} access to ${resource}${resourceId ? ` (ID: ${resourceId})` : ''}`,
      ipAddress: deviceInfo?.ipAddress,
      userAgent: deviceInfo?.userAgent,
      deviceType: deviceInfo?.deviceType,
      browser: deviceInfo?.browser,
      os: deviceInfo?.os,
    });
  }

  /**
   * Log data modification events
   */
  async logDataModification(
    userId: string,
    userEmail: string,
    userRole: string,
    action: 'CREATE' | 'UPDATE' | 'DELETE',
    resource: string,
    resourceId?: string,
    oldValues?: any,
    newValues?: any,
    deviceInfo?: DeviceInfo
  ): Promise<void> {
    await this.log({
      userId,
      userEmail,
      userRole,
      action,
      resource,
      resourceId,
      description: `${action} operation on ${resource}${resourceId ? ` (ID: ${resourceId})` : ''}`,
      oldValues,
      newValues,
      ipAddress: deviceInfo?.ipAddress,
      userAgent: deviceInfo?.userAgent,
      deviceType: deviceInfo?.deviceType,
      browser: deviceInfo?.browser,
      os: deviceInfo?.os,
    });
  }

  /**
   * Extract request information for logging
   */
  extractRequestInfo(req: Request): DeviceInfo {
    return DeviceDetector.extractDeviceInfo(req);
  }

  /**
   * Get audit logs with filtering and pagination
   */
  async getAuditLogs(filters: {
    userId?: string;
    action?: string;
    resource?: string;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
    offset?: number;
  }) {
    const where: any = {};

    if (filters.userId) where.userId = filters.userId;
    if (filters.action) where.action = filters.action;
    if (filters.resource) where.resource = filters.resource;
    if (filters.startDate || filters.endDate) {
      where.createdAt = {};
      if (filters.startDate) where.createdAt.gte = filters.startDate;
      if (filters.endDate) where.createdAt.lte = filters.endDate;
    }

    const [logs, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: filters.limit || 100,
        skip: filters.offset || 0,
      }),
      this.prisma.auditLog.count({ where }),
    ]);

    return { logs, total };
  }
}
