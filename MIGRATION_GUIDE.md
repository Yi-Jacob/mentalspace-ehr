# Migration Guide: Supabase to Custom Backend Authentication

## Overview
This document outlines the migration from Supabase authentication to a custom backend authentication system using JWT tokens and localStorage.

## Backend Changes

### 1. Database Schema Updates
- Added `password` field to the `User` model in Prisma schema
- Added unique constraint on email field
- Created migration: `20250101000000_add_password_to_users`

### 2. Authentication Service Updates
- Updated `AuthService` to use bcryptjs for password hashing
- Added user registration endpoint
- Added token validation endpoint
- Implemented proper password verification

### 3. New Endpoints
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/validate` - Token validation

## Frontend Changes

### 1. New Authentication Service
- Created `frontend/src/services/authService.ts`
- Handles JWT token storage in localStorage
- Manages user authentication state
- Provides login, register, and logout functionality

### 2. Updated Auth Hook
- Modified `frontend/src/hooks/useAuth.tsx`
- Removed Supabase dependencies
- Uses new auth service for authentication
- Simplified state management

### 3. Updated Components
- Updated `frontend/src/pages/Auth.tsx` to use new auth service
- Updated appointment creation hooks
- Updated scheduling components
- Updated client messages tab

### 4. API Client Updates
- Updated `frontend/src/services/api-helper/client.ts`
- Changed base URL to backend server
- Added proper response handling
- Maintains JWT token in Authorization header

## Environment Variables

### Backend
```env
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=24h
```

### Frontend
```env
VITE_API_BASE_URL=http://localhost:3000
```

## Setup Instructions

### 1. Backend Setup
```bash
cd backend
npm install
npx prisma migrate dev
npm run start:dev
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## Authentication Flow

1. **Registration**: User creates account with email/password
2. **Login**: User authenticates with credentials
3. **Token Storage**: JWT token stored in localStorage
4. **API Requests**: Token automatically included in Authorization header
5. **Token Validation**: Backend validates token on protected routes
6. **Logout**: Token removed from localStorage

## Security Features

- Password hashing with bcryptjs
- JWT token expiration
- Secure token storage in localStorage
- Automatic token validation
- Protected API routes

## Migration Notes

- All Supabase authentication code has been removed
- User data is now stored in the backend database
- JWT tokens provide stateless authentication
- localStorage provides persistent authentication state
- Backend handles all authentication logic

## Testing

1. Start both backend and frontend servers
2. Navigate to `/auth` page
3. Create a new account
4. Test login functionality
5. Verify protected routes work with authentication 