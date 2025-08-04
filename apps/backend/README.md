# MentalSpace EHR Backend

A scalable, enterprise-grade backend system for mental health practice management built with NestJS, Prisma, and PostgreSQL.

## 🚀 Quick Start

### First Time Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up your environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your database connection details
   ```

3. **Set up the database:**
   ```bash
   npm run db:setup
   ```

4. **Start the development server:**
   ```bash
   npm run start:dev
   ```

### Default Login Credentials

After setup, you can log in with:
- **Email**: example@gmail.com
- **Password**: 0p;/)P:?

⚠️ **Important**: Change the default password after your first login!

For detailed setup instructions, see [DATABASE_SETUP.md](./DATABASE_SETUP.md).

## 🏗️ Architecture Overview

This backend is designed with scalability in mind, following clean architecture principles and domain-driven design. The file system is organized to support both mid-sized and large-scale projects.

### Core Principles

- **Separation of Concerns**: Each module has distinct responsibilities
- **Role-Based Access Control**: Granular permissions for different user types
- **Event-Driven Architecture**: Loose coupling through events
- **Comprehensive Validation**: Business rules enforced at multiple layers
- **Audit Trail**: Complete tracking of all operations
- **Health Monitoring**: Built-in health checks and monitoring

## 📁 File System Structure

```
backend/
├── src/
│   ├── app.module.ts                 # Main application module
│   ├── main.ts                       # Application entry point
│   │
│   ├── database/                     # Database layer
│   │   ├── database.module.ts
│   │   ├── prisma.service.ts        # Prisma client wrapper
│   │   └── health/
│   │       └── database.health.ts   # Database health checks
│   │
│   ├── common/                       # Shared utilities
│   │   ├── validation/
│   │   │   └── validation.module.ts # Global validation pipe
│   │   └── logger/
│   │       ├── logger.module.ts
│   │       └── logger.service.ts    # Centralized logging
│   │
│   ├── auth/                         # Authentication & Authorization
│   │   ├── auth.module.ts
│   │   ├── guards/
│   │   │   ├── jwt-auth.guard.ts   # JWT validation
│   │   │   └── roles.guard.ts      # Role-based access control
│   │   ├── decorators/
│   │   │   └── roles.decorator.ts  # Role decorators
│   │   └── enums/
│   │       └── user-role.enum.ts   # User role definitions
│   │
│   ├── clients/                      # Client Management Module
│   │   ├── clients.module.ts
│   │   ├── dto/
│   │   │   ├── create-client.dto.ts
│   │   │   ├── update-client.dto.ts
│   │   │   └── query-client.dto.ts
│   │   ├── entities/
│   │   │   └── client.entity.ts
│   │   ├── controllers/
│   │   │   └── clients.controller.ts
│   │   ├── services/
│   │   │   ├── clients.service.ts
│   │   │   ├── clients-validation.service.ts
│   │   │   └── clients-event.service.ts
│   │   └── repositories/
│   │       └── clients.repository.ts
│   │
│   ├── users/                        # User Management Module
│   │   └── ... (similar structure)
│   │
│   ├── appointments/                  # Appointment Management
│   │   └── ... (similar structure)
│   │
│   ├── billing/                      # Billing & Payments
│   │   └── ... (similar structure)
│   │
│   ├── documentation/                # Clinical Documentation
│   │   └── ... (similar structure)
│   │
│   ├── compliance/                   # Compliance & Reporting
│   │   └── ... (similar structure)
│   │
│   ├── messaging/                    # Internal Messaging
│   │   └── ... (similar structure)
│   │
│   ├── scheduling/                   # Scheduling & Calendar
│   │   └── ... (similar structure)
│   │
│   ├── staff/                        # Staff Management
│   │   └── ... (similar structure)
│   │
│   ├── reports/                      # Analytics & Reporting
│   │   └── ... (similar structure)
│   │
│   ├── monitoring/                   # System Monitoring
│   │   └── ... (similar structure)
│   │
│   └── health/                       # Health Checks
│       ├── health.module.ts
│       └── health.controller.ts
│
├── prisma/
│   ├── schema.prisma                # Database schema
│   └── migrations/                  # Database migrations
│
├── tests/                           # Test files
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
└── docs/                            # Documentation
    ├── api/
    ├── architecture/
    └── deployment/
```

## 🎯 Module Structure Pattern

Each domain module follows this consistent structure:

```
module-name/
├── module-name.module.ts            # Module definition
├── dto/                            # Data Transfer Objects
│   ├── create-entity.dto.ts
│   ├── update-entity.dto.ts
│   └── query-entity.dto.ts
├── entities/                        # Domain entities
│   └── entity.entity.ts
├── controllers/                     # HTTP controllers
│   └── entity.controller.ts
├── services/                        # Business logic
│   ├── entity.service.ts           # Main service
│   ├── entity-validation.service.ts # Business validation
│   └── entity-event.service.ts     # Event handling
└── repositories/                    # Data access layer
    └── entity.repository.ts
```

## 🔐 Role-Based Access Control

The system implements comprehensive role-based access control:

### User Roles
- **ADMIN**: Full system access
- **CLINICIAN**: Clinical operations, client management
- **STAFF**: Basic operations, limited access
- **SUPERVISOR**: Oversight and supervision
- **BILLING**: Financial operations
- **RECEPTIONIST**: Front desk operations

### Permission Matrix
Each endpoint is protected with specific role requirements using the `@Roles()` decorator.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Docker (optional)

### Installation

1. **Clone and install dependencies**
```bash
cd backend
npm install
```

2. **Environment Setup**
```bash
cp .env.example .env
# Configure your environment variables
```

3. **Database Setup**
```bash
npx prisma generate
npx prisma migrate dev
```

4. **Start Development Server**
```bash
npm run start:dev
```

## 📊 API Documentation

The API is fully documented with Swagger/OpenAPI. Access the documentation at:
- Development: `http://localhost:3000/api`
- Production: `https://your-domain.com/api`

## 🧪 Testing

```bash
# Unit tests
npm run test

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 🔧 Development Workflow

### Adding a New Module

1. **Create the module structure**
```bash
nest generate module modules/new-module
nest generate controller modules/new-module
nest generate service modules/new-module
```

2. **Follow the established patterns**
- Create DTOs with validation
- Implement repository pattern
- Add business validation service
- Create event service for side effects
- Add comprehensive tests

3. **Update documentation**
- Add API documentation
- Update this README
- Create module-specific docs

### Database Migrations

```bash
# Create a new migration
npx prisma migrate dev --name descriptive-name

# Apply migrations in production
npx prisma migrate deploy

# Reset database (development only)
npx prisma migrate reset
```

## 📈 Monitoring & Health Checks

The system includes comprehensive monitoring:

- **Health Checks**: `/health` endpoint
- **Database Health**: Connection and performance monitoring
- **Application Metrics**: Performance and usage statistics
- **Error Tracking**: Centralized error logging and alerting

## 🔒 Security Features

- JWT-based authentication
- Role-based access control
- Input validation and sanitization
- SQL injection prevention (Prisma)
- Rate limiting
- Audit logging
- HIPAA compliance considerations

## 🚀 Deployment

### Docker Deployment
```bash
docker build -t mentalspace-backend .
docker run -p 3000:3000 mentalspace-backend
```

### Environment Variables
```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/mentalspace

# JWT
JWT_SECRET=your-super-secret-key
JWT_EXPIRES_IN=24h

# Application
NODE_ENV=production
PORT=3000
```

## 🤝 Contributing

1. Follow the established patterns
2. Write comprehensive tests
3. Update documentation
4. Follow the commit message conventions
5. Create feature branches

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the API documentation

---

**Built with ❤️ for mental health professionals** 