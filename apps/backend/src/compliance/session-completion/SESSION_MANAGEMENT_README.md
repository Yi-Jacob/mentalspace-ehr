# Session Management System

## Overview

The Session Management System is a comprehensive solution that manages the complete lifecycle of therapy sessions from scheduling to payment processing. It integrates with the existing scheduling, notes, and billing systems to provide a seamless workflow for mental health providers.

## System Architecture

### Core Components

1. **SessionCompletionService** - Handles individual session completion operations
2. **SessionManagementService** - Orchestrates the complete session lifecycle
3. **SessionCompletionController** - Exposes REST API endpoints
4. **Database Models** - Prisma schema for session data persistence

### Data Flow

```
Appointment Scheduled → Session Delivered → Note Documentation → Session Completion → Payment Processing
```

## Features

### 1. Session Lifecycle Management

- **Plan/Schedule**: Integration with existing appointment scheduling system
- **Confirm/Remind**: Appointment confirmation and reminder system
- **Deliver**: Session delivery tracking and status management
- **Document**: Progress note creation and management
- **Bill/Pay**: Payment calculation and processing
- **Report/Analyze**: Comprehensive analytics and reporting

### 2. Compliance & Deadlines

- **Weekly Deadlines**: Notes must be signed by Sunday 11:59 PM for sessions from Sunday-Saturday
- **Automatic Locking**: Unsigned notes lock after deadline
- **Supervisor Override**: Supervisors can unlock notes with audit trail
- **Payment Gating**: Only signed notes count toward weekly pay

### 3. Payment & Compensation

- **Session-based Pay**: Base rates with multipliers for different session types
- **Duration Proration**: Support for 30/45/60/90 minute sessions
- **Weekly Processing**: Sunday midnight cutoff for payment calculations
- **Historical Tracking**: Complete payment history and audit trail

### 4. Integration Points

- **Scheduling System**: Seamless integration with appointment management
- **Clinical Notes**: Automatic note template creation and linking
- **Billing System**: Claim generation and insurance processing
- **User Management**: Role-based access control and permissions

## API Endpoints

### Session Completion Management

```
GET    /compliance/session-completion                    - Get all sessions with filters
GET    /compliance/session-completion/:id               - Get session by ID
POST   /compliance/session-completion                    - Create new session
PUT    /compliance/session-completion/:id               - Update session
DELETE /compliance/session-completion/:id               - Delete session
```

### Session Operations

```
POST   /compliance/session-completion/:id/sign-note     - Sign session note
POST   /compliance/session-completion/:id/lock-session  - Lock session
POST   /compliance/session-completion/:id/supervisor-override - Supervisor override
```

### Compliance & Analytics

```
GET    /compliance/session-completion/compliance/deadlines/:providerId    - Get compliance deadlines
GET    /compliance/session-completion/payment/calculation/:providerId     - Get payment calculation
GET    /compliance/session-completion/dashboard/:providerId               - Get provider dashboard
GET    /compliance/session-completion/analytics/:providerId               - Get session analytics
GET    /compliance/session-completion/compliance/report/:providerId       - Get weekly compliance report
```

### Appointment Integration

```
POST   /compliance/session-completion/from-appointment/:appointmentId     - Create from appointment
POST   /compliance/session-completion/bulk-from-appointments              - Bulk create from appointments
```

## Data Models

### SessionCompletion

```typescript
interface SessionCompletion {
  id: string;
  appointmentId: string;
  providerId: string;
  clientId: string;
  sessionType: string;
  durationMinutes: number;
  sessionDate: Date;
  noteId?: string;
  isNoteSigned: boolean;
  noteSignedAt?: Date;
  isLocked: boolean;
  lockedAt?: Date;
  calculatedAmount: number;
  payPeriodWeek: Date;
  isPaid: boolean;
  supervisorOverrideBy?: string;
  supervisorOverrideReason?: string;
  supervisorOverrideAt?: Date;
}
```

### Compliance Deadlines

```typescript
interface ComplianceDeadlines {
  payPeriodWeek: Date;
  totalSessions: number;
  signedSessions: number;
  unsignedSessions: number;
  deadline: Date;
  isDeadlinePassed: boolean;
  sessions: {
    signed: SessionCompletion[];
    unsigned: SessionCompletion[];
  };
}
```

## Business Rules

### 1. Note Signing Deadlines

- **Weekly Cycle**: Sunday 00:00 to Saturday 23:59
- **Deadline**: Sunday 23:59 (end of week)
- **Locking**: Automatic after deadline
- **Override**: Supervisor approval required after locking

### 2. Payment Eligibility

- **Requirement**: Notes must be signed before weekly cutoff
- **Cutoff**: Sunday midnight
- **Processing**: Weekly calculation and processing
- **Standby**: Unsigned notes hold payment until completion

### 3. Session Types & Rates

- **Individual Therapy**: Base rate × 1.0
- **Group Therapy**: Base rate × 1.5
- **Intake Session**: Base rate × 1.25
- **Duration Multipliers**: 30min (0.5), 45min (0.75), 60min (1.0), 90min (1.5)

## Frontend Integration

### Service Layer

The frontend uses `sessionCompletionService` for all API communication:

```typescript
import { sessionCompletionService } from '@/services/sessionCompletionService';

// Get provider dashboard
const dashboard = await sessionCompletionService.getProviderDashboard(providerId);

// Sign a note
await sessionCompletionService.signNote(sessionId, signedBy);

// Get compliance deadlines
const compliance = await sessionCompletionService.getComplianceDeadlines(providerId);
```

### Components

- **SessionCompletionTracking**: Main dashboard and management interface
- **Compliance Overview**: Weekly deadline tracking and status
- **Session Management**: Individual session operations
- **Analytics**: Performance metrics and trends

## Security & Permissions

### Role-based Access

- **Clinician**: Manage own sessions and notes
- **Supervisor**: Access to supervisee sessions, override capabilities
- **Practice Scheduler**: Create sessions from appointments
- **Practice Biller**: Payment processing and financial operations

### Audit Trail

- **Note Signing**: Timestamp and user tracking
- **Session Locking**: Reason and user tracking
- **Supervisor Overrides**: Approval workflow and audit
- **Payment Processing**: Complete transaction history

## Configuration

### Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/mentalspace_ehr

# Logging
PRISMA_LOG_LEVEL=warn

# Application
NODE_ENV=production
```

### Prisma Schema

The system uses Prisma for database operations with the following key models:

- `SessionCompletion` - Core session data
- `ClinicalNote` - Progress notes and documentation
- `Appointment` - Scheduling and appointment management
- `PaymentCalculation` - Payment processing and tracking

## Deployment

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- Prisma CLI

### Setup Steps

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Database Setup**
   ```bash
   npx prisma generate
   npx prisma migrate dev
   npx prisma db seed
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env
   # Configure database and other environment variables
   ```

4. **Start Application**
   ```bash
   npm run start:dev
   ```

## Monitoring & Maintenance

### Health Checks

- **Database Connectivity**: Prisma service health monitoring
- **API Endpoints**: Controller health status endpoints
- **Service Dependencies**: Integration health checks

### Logging

- **Structured Logging**: JSON format with correlation IDs
- **Error Tracking**: Comprehensive error logging and monitoring
- **Performance Metrics**: Response time and throughput tracking

### Backup & Recovery

- **Database Backups**: Automated PostgreSQL backups
- **Data Retention**: Configurable retention policies
- **Disaster Recovery**: Point-in-time recovery procedures

## Future Enhancements

### Planned Features

1. **Real-time Notifications**: WebSocket-based deadline reminders
2. **Advanced Analytics**: Machine learning insights and predictions
3. **Mobile Support**: Native mobile applications
4. **API Extensions**: GraphQL support and webhook integrations
5. **Multi-tenant Support**: Practice-level isolation and customization

### Integration Roadmap

1. **Electronic Health Records**: HL7 FHIR integration
2. **Insurance Systems**: Real-time eligibility verification
3. **Payment Processors**: Stripe, Square integration
4. **Calendar Systems**: Google Calendar, Outlook sync

## Support & Documentation

### API Documentation

- **OpenAPI/Swagger**: Interactive API documentation
- **Postman Collections**: Pre-configured API testing
- **Code Examples**: TypeScript and JavaScript samples

### Troubleshooting

- **Common Issues**: Known problems and solutions
- **Debug Mode**: Enhanced logging for development
- **Support Channels**: Issue reporting and escalation

## Contributing

### Development Guidelines

1. **Code Style**: ESLint and Prettier configuration
2. **Testing**: Jest unit tests and integration tests
3. **Documentation**: JSDoc comments and README updates
4. **Code Review**: Pull request review process

### Testing

```bash
# Unit tests
npm run test

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.
