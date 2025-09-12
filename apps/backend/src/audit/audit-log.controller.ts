import { Controller, Get, Query, UseGuards, Post, Body, Delete } from '@nestjs/common';
import { AuditLogService } from './audit-log.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

export interface AuditLogFilters {
  userId?: string;
  action?: string;
  resource?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
  offset?: number;
}

@Controller('audit')
@UseGuards(JwtAuthGuard)
export class AuditLogController {
  constructor(private readonly auditLogService: AuditLogService) {}

  @Get('logs')
  async getAuditLogs(@Query() filters: AuditLogFilters) {
    const processedFilters = {
      ...filters,
      startDate: filters.startDate ? new Date(filters.startDate) : undefined,
      endDate: filters.endDate ? new Date(filters.endDate) : undefined,
      limit: filters.limit ? parseInt(filters.limit.toString()) : undefined,
      offset: filters.offset ? parseInt(filters.offset.toString()) : undefined,
    };

    return await this.auditLogService.getAuditLogs(processedFilters);
  }

  @Get('stats')
  async getAuditStats(@Query('days') days: string = '30') {
    const daysBack = parseInt(days);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysBack);

    const stats = await this.auditLogService.getAuditLogs({
      startDate,
      limit: 10000, // Large limit to get all records for stats
    });

    // Calculate statistics
    const actionCounts = {};
    const resourceCounts = {};
    const userCounts = {};
    const deviceTypeCounts = {};
    const browserCounts = {};
    const osCounts = {};

    stats.logs.forEach(log => {
      actionCounts[log.action] = (actionCounts[log.action] || 0) + 1;
      resourceCounts[log.resource] = (resourceCounts[log.resource] || 0) + 1;
      userCounts[log.userEmail] = (userCounts[log.userEmail] || 0) + 1;
      if (log.deviceType) deviceTypeCounts[log.deviceType] = (deviceTypeCounts[log.deviceType] || 0) + 1;
      if (log.browser) browserCounts[log.browser] = (browserCounts[log.browser] || 0) + 1;
      if (log.os) osCounts[log.os] = (osCounts[log.os] || 0) + 1;
    });

    return {
      period: `${days} days`,
      totalLogs: stats.total,
      actionCounts,
      resourceCounts,
      deviceTypeCounts,
      browserCounts,
      osCounts,
      userCounts: Object.keys(userCounts).map(email => ({
        email,
        count: userCounts[email]
      })).sort((a, b) => b.count - a.count),
    };
  }
}
