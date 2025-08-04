# Password Reset and Staff Management Features

## Overview
This document describes the password reset functionality and staff management features in the MentalSpace EHR system.

## Password Reset Flow

### 1. User Creation
When a new staff member is created:
- A user account is created without a password
- A password reset token is generated
- A password reset URL is provided to the administrator

### 2. Password Reset Process
1. Administrator receives the password reset URL
2. Administrator shares the URL with the new staff member
3. Staff member clicks the URL and sets their password
4. Password reset token is invalidated after use

## Staff Management Features

### Setting Default Password
Administrators can set a default password for staff members using the "Set Default Password" action in the staff list.

**Configuration:**
Add the following to your `.env` file:
```env
DEFAULT_USER_PASSWORD="ChangeMe123!"
```

**API Endpoint:**
```
POST /staff/:id/set-default-password
```

### Activating/Deactivating Staff
Administrators can activate or deactivate staff members using the toggle action in the staff list.

**API Endpoints:**
```
POST /staff/:id/activate
POST /staff/:id/deactivate
```

## Environment Variables

### Required Variables
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret key for JWT token generation
- `JWT_EXPIRES_IN`: JWT token expiration time (default: "24h")

### Optional Variables
- `DEFAULT_USER_PASSWORD`: Default password for new staff members (default: "ChangeMe123!")
- `PORT`: Server port (default: 3001)
- `NODE_ENV`: Environment mode (development/production)

### Email Configuration (for password reset)
- `SMTP_HOST`: SMTP server host
- `SMTP_PORT`: SMTP server port
- `SMTP_USER`: SMTP username
- `SMTP_PASS`: SMTP password
- `SMTP_FROM`: From email address
- `FRONTEND_URL`: Frontend application URL

## Security Considerations

1. **Default Passwords**: The default password should be changed immediately by the user
2. **Password Reset Tokens**: Tokens expire after use and have a limited lifespan
3. **JWT Tokens**: Use a strong, unique JWT secret in production
4. **Environment Variables**: Never commit sensitive environment variables to version control

## API Usage Examples

### Setting Default Password
```javascript
const response = await fetch('/staff/123/set-default-password', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  }
});

const result = await response.json();
console.log(result.message); // "Default password set successfully"
```

### Activating Staff Member
```javascript
const response = await fetch('/staff/123/activate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  }
});

const result = await response.json();
console.log(result.message); // "User activated successfully"
```

### Deactivating Staff Member
```javascript
const response = await fetch('/staff/123/deactivate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  }
});

const result = await response.json();
console.log(result.message); // "User deactivated successfully"
```

## Frontend Integration

The frontend includes a comprehensive staff management interface with:
- Staff list with search and pagination
- Role management
- Status management (active/inactive)
- Default password setting
- Bulk operations for administrators

All actions are integrated with toast notifications and automatic data refresh. 