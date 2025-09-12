# Global Audit Logging System

## Overview

The EHR system now automatically logs **ALL** authenticated API requests for HIPAA compliance. No manual configuration is required - every request is automatically audited.

## How It Works

### Automatic Detection
The system automatically detects and logs:

- **Action Type**: Based on HTTP method
  - `GET` → `READ`
  - `POST` → `CREATE` 
  - `PUT/PATCH` → `UPDATE`
  - `DELETE` → `DELETE`

- **Resource Name**: Based on controller name and route
  - `ClientsController` → `Client`
  - `StaffsController` → `Staff`
  - `NotesController` → `ClinicalNote`
  - etc.

- **Description**: Human-readable description
  - `GET /clients` → "View Client"
  - `POST /clients` → "Create Client"
  - `PUT /clients/:id` → "Update Client record"

### What Gets Logged

For every authenticated request, the system logs:

- **Who**: User ID, email, role
- **When**: Timestamp
- **What**: Action, resource, description
- **Where**: IP address, device type, browser, OS
- **Data**: Request/response data (for CREATE/UPDATE operations)

### Excluded Routes

The following routes are automatically excluded from audit logging:

- `/audit/*` - Audit endpoints (to prevent recursion)
- `/health` - Health checks
- `/auth/login` - Login (handled separately)
- `/auth/refresh` - Token refresh

## Examples

### Automatic Logging Examples

```typescript
// These requests are automatically logged:

GET /clients
// Logs: READ Client - "View Client"

POST /clients
// Logs: CREATE Client - "Create Client" + request body

PUT /clients/123
// Logs: UPDATE Client - "Update Client record" + old/new values

DELETE /clients/123
// Logs: DELETE Client - "Delete Client"

GET /notes/search
// Logs: READ ClinicalNote - "View ClinicalNote search"
```

### Manual Override (Optional)

You can still use the `@AuditLog` decorator for custom logging:

```typescript
@AuditLog({
  action: 'CREATE',
  resource: 'Client',
  description: 'Create new client with special validation',
  includeNewValues: true
})
@Post()
async createClient(@Body() createClientDto: CreateClientDto) {
  // Custom logic with specific audit logging
}
```

## Database Schema

Audit logs are stored in the `audit_logs` table with these fields:

- `id` - Unique identifier
- `userId` - User who made the request
- `userEmail` - User's email
- `userRole` - User's role
- `action` - READ/CREATE/UPDATE/DELETE
- `resource` - Resource type (Client, Staff, etc.)
- `resourceId` - ID of the affected resource
- `description` - Human-readable description
- `ipAddress` - User's IP address
- `userAgent` - Browser user agent
- `deviceType` - desktop/mobile/tablet
- `browser` - Browser name
- `os` - Operating system
- `oldValues` - Previous values (for updates)
- `newValues` - New values (for creates/updates)
- `createdAt` - Timestamp

## Frontend Access

Audit logs can be viewed in the frontend at:

- `/audit` - Main audit logs page
- `/audit/logs` - Detailed logs table
- `/audit/stats` - Statistics dashboard

Access is restricted to:
- Practice Administrator
- Clinical Administrator

## HIPAA Compliance

This system provides comprehensive audit logging required for HIPAA compliance:

✅ **Who** - User identification
✅ **When** - Precise timestamps  
✅ **What** - Detailed action descriptions
✅ **Where** - IP address and device information
✅ **Data Access** - What data was accessed/modified
✅ **Retention** - Logs are stored permanently
✅ **Access Control** - Only authorized users can view logs

## Performance Considerations

- Audit logging is asynchronous and won't slow down requests
- Failed audit logs don't affect the main request
- Logs are indexed for efficient querying
- Consider log retention policies for production

## Configuration

The global interceptor is configured in `app.module.ts`:

```typescript
providers: [
  {
    provide: APP_INTERCEPTOR,
    useClass: AuditLogInterceptor,
  },
]
```

No additional configuration is needed - it works automatically!
