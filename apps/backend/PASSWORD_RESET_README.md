# Password Reset Functionality

This document describes the new password reset workflow implemented in the MentalSpace EHR system.

## Overview

When an admin creates a new staff member, instead of setting a default password, the system now generates a password reset link that expires after 10 minutes (configurable).

## Environment Variables

Add the following environment variables to your `.env` file:

```env
# Password Reset Configuration
PASSWORD_RESET_EXPIRATION_MINUTES="10"

# Frontend URL (for generating reset links)
FRONTEND_URL="http://localhost:3000"
```

## Database Changes

A new `PasswordResetToken` model has been added to the Prisma schema:

```prisma
model PasswordResetToken {
  id        String   @id @default(uuid())
  userId    String   @map("user_id")
  token     String   @unique
  expiresAt DateTime @map("expires_at")
  usedAt    DateTime? @map("used_at")
  createdAt DateTime @default(now()) @map("created_at")
  user      User     @relation(fields: [userId], references: [id])

  @@map("password_reset_tokens")
}
```

## API Endpoints

### Request Password Reset
- **POST** `/auth/request-password-reset`
- **Body**: `{ "email": "user@example.com" }`
- **Response**: `{ "message": "If the email exists, a password reset link has been sent.", "resetUrl": "http://localhost:3000/reset-password?token=abc123" }`

### Reset Password
- **POST** `/auth/reset-password`
- **Body**: `{ "token": "abc123", "password": "NewPassword123!", "confirmPassword": "NewPassword123!" }`
- **Response**: `{ "message": "Password has been reset successfully" }`

## Frontend Routes

- **GET** `/reset-password?token=abc123` - Password reset page

## Workflow

1. **Admin creates staff member**: When an admin creates a new staff member, the system:
   - Creates the user without a password
   - Generates a secure reset token
   - Returns a reset URL to the admin

2. **Staff member receives link**: The admin can share the reset URL with the new staff member

3. **Staff member resets password**: The staff member:
   - Visits the reset URL
   - Enters a new password (twice for confirmation)
   - Password must meet security requirements
   - Token expires after 10 minutes

4. **Login**: The staff member can now log in with their new password

## Security Features

- Tokens expire after 10 minutes (configurable)
- Tokens can only be used once
- Secure random token generation
- Password strength validation
- Token validation on the backend

## Password Requirements

Passwords must contain:
- At least 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character (@$!%*?&)

## Migration

Run the following commands to apply the database changes:

```bash
# Generate Prisma client with new schema
npm run prisma:generate

# Run database migration
npm run prisma:migrate
``` 