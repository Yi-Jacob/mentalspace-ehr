# MentalSpace EHR

A comprehensive electronic health record system built with React, NestJS, and TypeScript.

## Project Structure

This is a monorepo containing:

- **Frontend**: React application with Vite, TypeScript, and Tailwind CSS
- **Backend**: NestJS API with Prisma ORM

```
mentalspace-ehr/
├── apps/
│   ├── frontend/     # React application
│   └── backend/      # NestJS API
├── packages/         # Shared packages (future)
├── package.json      # Root package.json with workspaces
└── README.md
```

## Quick Start

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0

### Installation

Install all dependencies for both frontend and backend:

```bash
npm install
```

### Development

Run both frontend and backend in development mode:

```bash
npm run dev
```

Or run them separately:

```bash
# Frontend only
npm run dev:frontend

# Backend only
npm run dev:backend
```

### Building

Build all applications:

```bash
npm run build
```

Or build individually:

```bash
npm run build:frontend
npm run build:backend
```

### Database

Prisma commands (run from root):

```bash
# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Open Prisma Studio
npm run prisma:studio

# Seed database
npm run db:seed
```

### Testing

Run all tests:

```bash
npm run test
```

Or run tests for specific apps:

```bash
npm run test:frontend
npm run test:backend
```

### Linting

Lint all code:

```bash
npm run lint
```

Or lint specific apps:

```bash
npm run lint:frontend
npm run lint:backend
```

### Cleaning

Clean all build artifacts and node_modules:

```bash
npm run clean
npm run clean:node_modules
npm run clean:dist
```

## Available Scripts

### Root Level Scripts

- `npm run dev` - Start both frontend and backend in development mode
- `npm run dev:frontend` - Start only frontend
- `npm run dev:backend` - Start only backend
- `npm run build` - Build all applications
- `npm run build:frontend` - Build frontend only
- `npm run build:backend` - Build backend only
- `npm run test` - Run all tests
- `npm run test:frontend` - Run frontend tests
- `npm run test:backend` - Run backend tests
- `npm run lint` - Lint all code
- `npm run lint:frontend` - Lint frontend code
- `npm run lint:backend` - Lint backend code
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio
- `npm run db:seed` - Seed the database
- `npm run clean` - Clean all build artifacts
- `npm run clean:node_modules` - Remove all node_modules
- `npm run clean:dist` - Remove all build directories

## Technology Stack

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- Radix UI
- React Router
- TanStack Query
- Zod for validation

### Backend
- NestJS
- TypeScript
- Prisma ORM
- JWT Authentication
- Class Validator
- Swagger/OpenAPI

## Development Workflow

1. **Install dependencies**: `npm install`
2. **Set up database**: `npm run prisma:migrate`
3. **Start development servers**: `npm run dev`
4. **Access applications**:
   - Frontend: http://localhost:5173
   - Backend: http://localhost:3000
   - Prisma Studio: http://localhost:5555

## Contributing

1. Make changes in the appropriate app directory
2. Run tests: `npm run test`
3. Run linting: `npm run lint`
4. Build to check for errors: `npm run build`

## License

UNLICENSED 