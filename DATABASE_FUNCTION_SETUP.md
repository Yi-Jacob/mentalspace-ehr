# Database Function Setup Guide

This guide explains how to set up and use the `create_staff_member` database function in your project.

## What is the Database Function?

The `create_staff_member` function is a PostgreSQL function that handles the complete staff creation workflow in a single atomic operation. It:

1. Creates a user record
2. Creates a staff profile
3. Assigns roles to the user
4. Creates supervision relationships (if applicable)

## Where to Use the SQL File

### 1. **Supabase Migrations** (Recommended)

The SQL function should be added to your Supabase migrations:

```bash
# File: frontend/supabase/migrations/20250719000000-create-staff-member-function.sql
```

This ensures the function is automatically deployed when you run migrations.

### 2. **Manual Database Setup**

If you need to manually create the function, you can run the SQL directly in your database:

```sql
-- Copy the contents of create_staff_member_function.sql
-- and run it in your PostgreSQL database
```

### 3. **Development Environment**

For local development, you can run the SQL in your local database:

```bash
# Connect to your local PostgreSQL database
psql -d your_database_name -f create_staff_member_function.sql
```

## How the Function is Used

### Frontend Usage

The function is called from the frontend through Supabase RPC:

```typescript
// In useStaffMutations.ts
const { data, error } = await supabase.rpc('create_staff_member', {
  p_first_name: staffData.first_name,
  p_last_name: staffData.last_name,
  p_email: staffData.email,
  p_roles: staffData.roles,
  // ... other parameters
});
```

### Backend Usage (Alternative)

You can also call it from your NestJS backend:

```typescript
// In users.service.ts
const result = await this.prisma.$queryRaw`
  SELECT create_staff_member(
    ${createUserDto.firstName},
    ${createUserDto.lastName},
    ${createUserDto.email},
    ${createUserDto.roles},
    ${createUserDto.employeeId},
    // ... other parameters
  )
`;
```

## Migration Process

### 1. **Add Migration File**

Create a new migration file in `frontend/supabase/migrations/`:

```bash
# Generate a new migration
supabase migration new create-staff-member-function
```

### 2. **Add SQL Content**

Copy the SQL function into the generated migration file.

### 3. **Apply Migration**

```bash
# Apply the migration
supabase db push
```

## Function Parameters

The function accepts these parameters:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `p_first_name` | TEXT | Yes | User's first name |
| `p_last_name` | TEXT | Yes | User's last name |
| `p_email` | TEXT | Yes | User's email address |
| `p_roles` | user_role[] | No | Array of user roles |
| `p_employee_id` | TEXT | No | Employee ID |
| `p_job_title` | TEXT | No | Job title |
| `p_department` | TEXT | No | Department |
| `p_phone_number` | TEXT | No | Phone number |
| `p_npi_number` | TEXT | No | NPI number |
| `p_license_number` | TEXT | No | License number |
| `p_license_state` | TEXT | No | License state |
| `p_license_expiry_date` | DATE | No | License expiry date |
| `p_hire_date` | DATE | No | Hire date |
| `p_billing_rate` | DECIMAL | No | Billing rate |
| `p_can_bill_insurance` | BOOLEAN | No | Can bill insurance |
| `p_status` | TEXT | No | User status |
| `p_notes` | TEXT | No | Notes |
| `p_supervision_type` | TEXT | No | Supervision type |
| `p_supervisor_id` | UUID | No | Supervisor ID |

## Return Value

The function returns a `UUID` - the ID of the newly created user.

## Error Handling

The function includes error handling:

- **Validation**: Checks for required parameters
- **Transaction Safety**: All operations are wrapped in a transaction
- **Rollback**: If any operation fails, all changes are rolled back

## Security

The function uses `SECURITY DEFINER`, which means:

- It runs with the privileges of the function owner
- It can perform operations that the calling user might not have direct permission for
- It's secure for use in a multi-tenant environment

## Testing the Function

You can test the function directly in your database:

```sql
-- Test the function
SELECT create_staff_member(
  'John',
  'Doe',
  'john.doe@example.com',
  ARRAY['CLINICIAN']::user_role[],
  'EMP001',
  'Therapist',
  'Clinical',
  '555-0123',
  '1234567890',
  'LIC123',
  'CA',
  '2025-12-31',
  '2024-01-01',
  150.00,
  true,
  'active',
  'New staff member',
  'Not Supervised',
  NULL
);
```

## Troubleshooting

### Common Issues

1. **Function not found**: Make sure the migration was applied
2. **Permission denied**: Check that the function has proper permissions
3. **Type errors**: Ensure parameter types match the function signature

### Debugging

You can add logging to the function:

```sql
-- Add this inside the function for debugging
RAISE NOTICE 'Creating user: % %', p_first_name, p_last_name;
```

## Integration with Your Workflow

The function integrates with your existing workflow:

1. **Frontend Form** → Collects staff data
2. **useAddStaffSubmit** → Transforms data
3. **useStaffMutations** → Calls database function
4. **Database Function** → Creates all related records
5. **Success Response** → User redirected to staff list

This approach ensures data consistency and provides excellent performance for the staff creation workflow. 