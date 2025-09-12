import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Reflector } from '@nestjs/core';
import { Request, Response } from 'express';
import { AuditLogService } from '../audit-log.service';
import { AUDIT_LOG_KEY, AuditLogOptions } from '../decorators/audit-log.decorator';

@Injectable()
export class AuditLogInterceptor implements NestInterceptor {
  private readonly logger = new Logger(AuditLogInterceptor.name);

  constructor(
    private reflector: Reflector,
    private auditLogService: AuditLogService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // Check if method has explicit audit decorator
    const explicitAuditOptions = this.reflector.get<AuditLogOptions>(
      AUDIT_LOG_KEY,
      context.getHandler(),
    ) as AuditLogOptions;

    // If explicit decorator exists, use it; otherwise use automatic detection
    const auditOptions = explicitAuditOptions || this.getAutomaticAuditOptions(context);

    if (!auditOptions) {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const startTime = Date.now();

    // Extract user information from request
    const user = (request as any).user;
    if (!user) {
      // Skip audit logging for unauthenticated requests
      return next.handle();
    }

    return next.handle().pipe(
      tap({
        next: async (data) => {
          try {
            const deviceInfo = this.auditLogService.extractRequestInfo(request);

            // Extract resource information
            const resourceId = this.extractResourceId(request, data);

            await this.auditLogService.log({
              userId: user.id,
              userEmail: user.email,
              userRole: user.roles?.[0],
              action: auditOptions.action,
              resource: auditOptions.resource,
              resourceId,
              description: auditOptions.description || `${auditOptions.action} operation on ${auditOptions.resource}`,
              ipAddress: deviceInfo.ipAddress,
              userAgent: deviceInfo.userAgent,
              deviceType: deviceInfo.deviceType,
              browser: deviceInfo.browser,
              os: deviceInfo.os,
              oldValues: auditOptions.includeOldValues ? this.extractOldValues(request) : undefined,
              newValues: auditOptions.includeNewValues ? this.extractNewValues(request, data) : undefined,
            });
          } catch (error) {
            this.logger.error('Failed to create audit log:', error);
          }
        },
        error: async (error) => {
          try {
            const deviceInfo = this.auditLogService.extractRequestInfo(request);

            await this.auditLogService.log({
              userId: user.id,
              userEmail: user.email,
              userRole: user.roles?.[0],
              action: auditOptions.action,
              resource: auditOptions.resource,
              description: `Failed ${auditOptions.action} operation on ${auditOptions.resource}: ${error.message}`,
              ipAddress: deviceInfo.ipAddress,
              userAgent: deviceInfo.userAgent,
              deviceType: deviceInfo.deviceType,
              browser: deviceInfo.browser,
              os: deviceInfo.os,
            });
          } catch (auditError) {
            this.logger.error('Failed to create error audit log:', auditError);
          }
        },
      }),
    );
  }

  private extractResourceId(request: Request, data: any): string | undefined {
    // Try to extract resource ID from various sources
    if (request.params?.id) return request.params.id;
    if (data?.id) return data.id;
    if (data?.data?.id) return data.data.id;
    return undefined;
  }

  private extractOldValues(request: Request): any {
    // For update operations, try to extract old values
    // This would typically require fetching the current state before the update
    // For now, return undefined - this could be enhanced with additional logic
    return undefined;
  }

  private extractNewValues(request: Request, data: any): any {
    // Extract new values from request body or response data
    if (request.body) return request.body;
    if (data) return data;
    return undefined;
  }

  /**
   * Automatically detect audit options based on HTTP method and route
   */
  private getAutomaticAuditOptions(context: ExecutionContext): AuditLogOptions | null {
    const request = context.switchToHttp().getRequest<Request>();
    const handler = context.getHandler();
    const controller = context.getClass();
    
    // Skip audit logging for certain routes
    const skipRoutes = [
      '/audit', // Don't audit audit endpoints to avoid recursion
      '/health', // Skip health checks
      '/auth/login', // Login is handled separately
      '/auth/refresh', // Token refresh
    ];
    
    const route = request.route?.path || request.url.split('?')[0];
    if (skipRoutes.some(skipRoute => route.startsWith(skipRoute))) {
      return null;
    }

    // Determine action based on HTTP method
    const action = this.getActionFromMethod(request.method);
    if (!action) {
      return null;
    }

    // Extract resource name from controller and route
    const resource = this.extractResourceName(controller.name, route);

    // Generate description
    const description = this.generateDescription(action, resource, route);

    return {
      action,
      resource,
      description,
      includeOldValues: request.method === 'PUT' || request.method === 'PATCH',
      includeNewValues: request.method === 'POST' || request.method === 'PUT' || request.method === 'PATCH',
    };
  }

  /**
   * Map HTTP method to audit action
   */
  private getActionFromMethod(method: string): 'CREATE' | 'READ' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT' | 'ACCESS' | null {
    switch (method.toUpperCase()) {
      case 'GET':
        return 'READ';
      case 'POST':
        return 'CREATE';
      case 'PUT':
      case 'PATCH':
        return 'UPDATE';
      case 'DELETE':
        return 'DELETE';
      default:
        return null;
    }
  }

  /**
   * Extract resource name from controller name and route
   */
  private extractResourceName(controllerName: string, route: string): string {
    // Remove 'Controller' suffix from controller name
    let resource = controllerName.replace(/Controller$/, '');
    
    // Handle specific cases
    if (resource === 'Staffs') resource = 'Staff';
    if (resource === 'Clients') resource = 'Client';
    if (resource === 'Notes') resource = 'ClinicalNote';
    if (resource === 'Messages') resource = 'Message';
    if (resource === 'Appointments') resource = 'Appointment';
    if (resource === 'Billing') resource = 'BillingRecord';
    if (resource === 'Compliance') resource = 'ComplianceRecord';
    if (resource === 'ProductivityGoals') resource = 'ProductivityGoal';
    if (resource === 'Permissions') resource = 'Permission';
    if (resource === 'AIChatbot') resource = 'AIChat';
    if (resource === 'Users') resource = 'User';
    if (resource === 'Diagnoses') resource = 'Diagnosis';
    if (resource === 'Scheduling') resource = 'Schedule';
    
    // If route contains specific resource indicators, use those
    if (route.includes('/clients')) resource = 'Client';
    if (route.includes('/staff')) resource = 'Staff';
    if (route.includes('/notes')) resource = 'ClinicalNote';
    if (route.includes('/appointments')) resource = 'Appointment';
    if (route.includes('/messages')) resource = 'Message';
    if (route.includes('/billing')) resource = 'BillingRecord';
    if (route.includes('/compliance')) resource = 'ComplianceRecord';
    if (route.includes('/users')) resource = 'User';
    if (route.includes('/diagnoses')) resource = 'Diagnosis';
    if (route.includes('/scheduling')) resource = 'Schedule';
    
    return resource;
  }

  /**
   * Generate human-readable description for audit log
   */
  private generateDescription(action: string, resource: string, route: string): string {
    const actionMap = {
      'READ': 'View',
      'CREATE': 'Create',
      'UPDATE': 'Update',
      'DELETE': 'Delete',
    };

    const actionText = actionMap[action] || action;
    
    // Handle specific route patterns
    if (route.includes('/search')) {
      return `${actionText} ${resource} search`;
    }
    if (route.includes('/export')) {
      return `${actionText} ${resource} export`;
    }
    if (route.includes('/import')) {
      return `${actionText} ${resource} import`;
    }
    if (route.includes('/bulk')) {
      return `${actionText} ${resource} bulk operation`;
    }
    if (route.includes('/:id')) {
      return `${actionText} ${resource} record`;
    }
    
    return `${actionText} ${resource}`;
  }
}
