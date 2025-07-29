# Monorepo Setup Guide

## What's Changed

Your project has been converted to a monorepo structure using npm workspaces. Here's what's new:

### New Structure
```
mentalspace-ehr/
├── apps/
│   ├── frontend/     # Your React app
│   └── backend/      # Your NestJS API
├── packages/         # For shared packages (future)
├── package.json      # Root package.json with workspaces
└── README.md         # Updated documentation
```

### Key Benefits

1. **Single Command Installation**: `npm install` installs dependencies for both apps
2. **Single Command Development**: `npm run dev` starts both frontend and backend
3. **Unified Scripts**: All common operations can be run from the root
4. **Shared Dependencies**: Future shared packages can be added to the `packages/` directory

## Available Commands

### Development
```bash
# Start both apps
npm run dev

# Start individual apps
npm run dev:frontend
npm run dev:backend
```

### Building
```bash
# Build both apps
npm run build

# Build individual apps
npm run build:frontend
npm run build:backend
```

### Database (Prisma)
```bash
npm run prisma:generate
npm run prisma:migrate
npm run prisma:studio
npm run db:seed
```

### Testing & Linting
```bash
npm run test
npm run lint
```

## Migration Notes

1. **Dependencies**: All dependencies are now managed at the root level
2. **Node Modules**: Shared dependencies are hoisted to the root `node_modules/`
3. **Scripts**: All scripts can be run from the root directory
4. **Environment**: Each app maintains its own environment files

## Next Steps

1. **Clean up old directories**: You can now safely remove the old `frontend/` and `backend/` directories from the root
2. **Update your workflow**: Use the new commands from the root directory
3. **Consider shared packages**: Add common utilities to the `packages/` directory

## Troubleshooting

If you encounter issues:

1. **Clean install**: `npm run clean:node_modules && npm install`
2. **Check workspace names**: Ensure package.json files have correct names (`frontend`, `backend`)
3. **Verify paths**: Make sure apps are in the `apps/` directory

## Development Workflow

1. **Start development**: `npm run dev`
2. **Access applications**:
   - Frontend: http://localhost:5173
   - Backend: http://localhost:3000
3. **Database management**: Use Prisma commands from root
4. **Building**: `npm run build` for production builds

The monorepo setup is now complete and ready for development! 