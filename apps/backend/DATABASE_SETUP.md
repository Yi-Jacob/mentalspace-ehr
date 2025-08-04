# Database Setup Guide

This guide will help you set up the database for the MentalSpace EHR system for the first time.

## Prerequisites

- Node.js and npm installed
- PostgreSQL database running
- Environment variables configured (DATABASE_URL in .env file)

## First Time Setup

### Option 1: Automated Setup (Recommended)

Run the automated setup script that will handle everything:

```bash
npm run db:setup
```

This script will:
1. Generate the Prisma client
2. Run all database migrations
3. Seed the database with default data

### Option 2: Manual Setup

If you prefer to run the steps manually:

```bash
# 1. Generate Prisma client
npx prisma generate

# 2. Run migrations
npx prisma migrate deploy

# 3. Seed the database
npm run db:seed
```

## Default User

After the first-time setup, a default user will be created with the following credentials:

- **Email**: example@gmail.com
- **Password**: 0p;/)P:?
- **Role**: Practice Administrator

⚠️ **Important**: Change the default password after your first login for security purposes.

## Subsequent Runs

After the initial setup, you only need to run migrations when there are schema changes:

```bash
npx prisma migrate deploy
```

The seed script will automatically skip creating the default user if it already exists.

## Database Management

### View Database in Prisma Studio

```bash
npx prisma studio
```

### Reset Database (Development Only)

⚠️ **Warning**: This will delete all data!

```bash
npx prisma migrate reset
```

### Generate New Migration

When you make schema changes:

```bash
npx prisma migrate dev --name your_migration_name
```

## Troubleshooting

### Common Issues

1. **Connection Error**: Make sure your DATABASE_URL is correct in the .env file
2. **Permission Error**: Ensure your database user has the necessary permissions
3. **Migration Conflicts**: If you have conflicts, you may need to reset the database (development only)

### Getting Help

If you encounter issues:
1. Check the console output for specific error messages
2. Verify your database connection
3. Ensure all environment variables are set correctly 