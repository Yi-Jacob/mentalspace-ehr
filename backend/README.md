# MentalSpace EHR Backend

This is a Nest.js backend for the MentalSpace EHR system, designed to replace Supabase with a custom backend using AWS RDS.

## Features

- ✅ Nest.js framework
- ✅ TypeScript support
- ✅ Prisma ORM for database operations
- ✅ Swagger API documentation
- ✅ JWT authentication (ready to implement)
- ✅ CORS enabled for frontend integration
- ✅ Environment configuration
- ✅ Health check endpoints

## Database Configuration

The backend is configured to connect to AWS RDS PostgreSQL:

```
Endpoint: database-1-instance-1.cny40qqomphs.us-east-2.rds.amazonaws.com
Port: 5432
Database: postgres
Username: postgres
```

## Setup Instructions

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment setup:**
   ```bash
   copy env.example .env
   ```

3. **Generate Prisma client:**
   ```bash
   npm run prisma:generate
   ```

4. **Run database migrations (when database is accessible):**
   ```bash
   npm run prisma:migrate
   ```

5. **Start development server:**
   ```bash
   npm run start:dev
   ```

## API Endpoints

### Demo Endpoints (Working without database)
- `GET /` - Main application endpoint
- `GET /health` - Health check
- `GET /demo` - Demo endpoint showing API status
- `POST /demo/test` - Test POST endpoint
- `GET /api` - Swagger documentation

### Planned Endpoints (Require database connection)
- `GET /users` - Get all users
- `POST /users` - Create user
- `GET /clients` - Get all clients
- `POST /clients` - Create client
- `POST /auth/login` - User authentication

## Database Schema

The Prisma schema includes:
- **Users** - Staff and clinician accounts
- **Clients** - Patient/client information
- **ProductivityGoals** - Staff productivity tracking

## Development

### Available Scripts
- `npm run start:dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run start:prod` - Start production server
- `npm run prisma:studio` - Open Prisma Studio for database management
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:generate` - Generate Prisma client

### API Documentation
Once the server is running, visit `http://localhost:3001/api` for Swagger documentation.

## Current Status

✅ **Completed:**
- Nest.js project structure
- Basic controllers and services
- Prisma schema definition
- Swagger documentation setup
- Environment configuration
- Demo endpoints working

⏳ **Pending Database Connection:**
- Database migration execution
- Full CRUD operations
- Authentication implementation
- Data validation

## Next Steps

1. **Resolve database connectivity** - Ensure AWS RDS is accessible
2. **Run migrations** - Create database tables
3. **Test CRUD operations** - Verify all endpoints work
4. **Implement authentication** - Add JWT-based auth
5. **Connect to frontend** - Update React app to use new API

## Troubleshooting

### Database Connection Issues
If you get database connection errors:
1. Check AWS RDS security groups
2. Verify network connectivity
3. Confirm database credentials
4. Ensure database instance is running

### Prisma Issues
If Prisma commands fail:
1. Run `npm run prisma:generate` to regenerate client
2. Check `.env` file configuration
3. Verify database URL format

## Environment Variables

Required environment variables in `.env`:
```
DATABASE_URL="postgresql://postgres:password@host:5432/database"
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="7d"
PORT=3001
NODE_ENV=development
``` 