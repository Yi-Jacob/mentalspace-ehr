# Staff Creation Workflow

This document outlines the complete workflow for creating staff members in the MentalSpace EHR system.

## Overview

The staff creation workflow involves:
1. **Frontend Form**: Comprehensive form collecting all staff information
2. **Frontend Processing**: Data transformation and validation
3. **Backend API**: NestJS controller and service handling the request
4. **Database Function**: PostgreSQL function creating user, profile, roles, and supervision relationships

## Frontend Components

### 1. Form Data Structure (`useAddStaffForm.ts`)

The form collects comprehensive staff information:

```typescript
const [formData, setFormData] = useState({
  // User Information
  first_name: '',
  middle_name: '',
  last_name: '',
  suffix: '',
  email: '',
  user_name: '',
  mobile_phone: '',
  work_phone: '',
  home_phone: '',
  can_receive_text: false,
  address_1: '',
  address_2: '',
  city: '',
  state: '',
  zip_code: '',
  
  // Staff Profile
  employee_id: '',
  job_title: '',
  formal_name: '',
  npi_number: '',
  department: '',
  phone_number: '',
  license_number: '',
  license_state: '',
  license_expiry_date: '',
  hire_date: '',
  billing_rate: '',
  can_bill_insurance: false,
  status: 'active',
  notes: '',
  
  // Additional fields
  clinician_type: '',
  supervision_type: 'Not Supervised',
  supervisor_id: '',
  
  // Roles
  roles: [] as UserRole[],
  
  // User Comments
  user_comments: ''
});
```

### 2. Submit Handler (`useAddStaffSubmit.ts`)

Transforms form data to match backend expectations:

```typescript
const staffData: CreateStaffMemberData = {
  first_name: formData.first_name,
  last_name: formData.last_name,
  email: formData.email,
  roles: formData.roles || [],
  employee_id: formData.employee_id,
  job_title: formData.job_title,
  department: formData.department,
  phone_number: formData.phone_number,
  npi_number: formData.npi_number,
  license_number: formData.license_number,
  license_state: formData.license_state,
  license_expiry_date: formData.license_expiry_date,
  hire_date: formData.hire_date,
  billing_rate: formData.billing_rate ? parseFloat(formData.billing_rate) : undefined,
  can_bill_insurance: formData.can_bill_insurance,
  status: formData.status as UserStatus || 'active',
  notes: formData.notes,
  supervision_type: formData.supervision_type,
  supervisor_id: formData.supervisor_id,
};
```

### 3. API Call (`useStaffMutations.ts`)

Calls the Supabase database function:

```typescript
const { data, error } = await supabase.rpc('create_staff_member', {
  p_first_name: staffData.first_name,
  p_last_name: staffData.last_name,
  p_email: staffData.email,
  p_roles: staffData.roles,
  p_employee_id: staffData.employee_id || null,
  p_job_title: staffData.job_title || null,
  p_department: staffData.department || null,
  p_phone_number: staffData.phone_number || null,
  p_npi_number: staffData.npi_number || null,
  p_license_number: staffData.license_number || null,
  p_license_state: staffData.license_state || null,
  p_license_expiry_date: staffData.license_expiry_date || null,
  p_hire_date: staffData.hire_date || null,
  p_billing_rate: staffData.billing_rate || null,
  p_can_bill_insurance: staffData.can_bill_insurance || false,
  p_status: (staffData.status as UserStatus) || 'active',
  p_notes: staffData.notes || null,
  p_supervision_type: (staffData.supervision_type as SupervisionRequirementType) || 'Not Supervised',
  p_supervisor_id: staffData.supervisor_id || null,
});
```

## Backend Components

### 1. DTO Structure (`create-user.dto.ts`)

Comprehensive DTO matching frontend data:

```typescript
export class CreateUserDto {
  // Basic user information
  @IsEmail()
  email: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  // Staff profile information
  @IsOptional()
  @IsString()
  employeeId?: string;

  @IsOptional()
  @IsString()
  jobTitle?: string;

  // ... additional fields

  // Roles
  @IsOptional()
  @IsArray()
  @IsEnum(UserRole, { each: true })
  roles?: UserRole[];

  // Supervision
  @IsOptional()
  @IsString()
  supervisionType?: string;

  @IsOptional()
  @IsString()
  supervisorId?: string;
}
```

### 2. Service Implementation (`users.service.ts`)

Handles the complete staff creation workflow:

```typescript
async create(createUserDto: CreateUserDto) {
  try {
    const result = await this.prisma.$transaction(async (prisma) => {
      // 1. Create the user record
      const user = await prisma.user.create({
        data: {
          email: createUserDto.email,
          firstName: createUserDto.firstName,
          lastName: createUserDto.lastName,
          isActive: true,
        },
      });

      // 2. Create the staff profile
      const staffProfile = await prisma.staffProfile.create({
        data: {
          userId: user.id,
          employeeId: createUserDto.employeeId,
          // ... additional fields
        },
      });

      // 3. Assign roles
      if (createUserDto.roles && createUserDto.roles.length > 0) {
        await prisma.userRole.createMany({
          data: createUserDto.roles.map(role => ({
            userId: user.id,
            role: role,
            isActive: true,
          })),
        });
      }

      // 4. Create supervision relationship
      if (createUserDto.supervisionType && 
          createUserDto.supervisionType !== 'Not Supervised' && 
          createUserDto.supervisorId) {
        await prisma.supervisionRelationship.create({
          data: {
            supervisorId: createUserDto.supervisorId,
            superviseeId: user.id,
            supervisionType: createUserDto.supervisionType,
            startDate: new Date(),
            isActive: true,
          },
        });
      }

      return { user, staffProfile };
    });

    return result;
  } catch (error) {
    console.error('Error creating staff member:', error);
    throw error;
  }
}
```

## Database Components

### 1. Database Function (`create_staff_member_function.sql`)

Comprehensive PostgreSQL function handling the complete workflow:

```sql
CREATE OR REPLACE FUNCTION create_staff_member(
    p_first_name TEXT,
    p_last_name TEXT,
    p_email TEXT,
    p_roles user_role[] DEFAULT '{}',
    p_employee_id TEXT DEFAULT NULL,
    p_job_title TEXT DEFAULT NULL,
    p_department TEXT DEFAULT NULL,
    p_phone_number TEXT DEFAULT NULL,
    p_npi_number TEXT DEFAULT NULL,
    p_license_number TEXT DEFAULT NULL,
    p_license_state TEXT DEFAULT NULL,
    p_license_expiry_date DATE DEFAULT NULL,
    p_hire_date DATE DEFAULT NULL,
    p_billing_rate DECIMAL DEFAULT NULL,
    p_can_bill_insurance BOOLEAN DEFAULT FALSE,
    p_status TEXT DEFAULT 'active',
    p_notes TEXT DEFAULT NULL,
    p_supervision_type TEXT DEFAULT 'Not Supervised',
    p_supervisor_id UUID DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    new_user_id UUID;
    role_item user_role;
BEGIN
    -- Create the user record
    INSERT INTO public.users (first_name, last_name, email, is_active)
    VALUES (p_first_name, p_last_name, p_email, true)
    RETURNING id INTO new_user_id;
    
    -- Create the staff profile
    INSERT INTO public.staff_profiles (
        user_id, employee_id, job_title, department, phone_number,
        npi_number, license_number, license_state, license_expiry_date,
        hire_date, billing_rate, can_bill_insurance, status, notes
    )
    VALUES (
        new_user_id, p_employee_id, p_job_title, p_department, p_phone_number,
        p_npi_number, p_license_number, p_license_state, p_license_expiry_date,
        p_hire_date, p_billing_rate, p_can_bill_insurance, p_status, p_notes
    );
    
    -- Assign roles
    FOREACH role_item IN ARRAY p_roles
    LOOP
        INSERT INTO public.user_roles (user_id, role, is_active)
        VALUES (new_user_id, role_item, true);
    END LOOP;
    
    -- Create supervision relationship if supervisor is specified
    IF p_supervision_type != 'Not Supervised' AND p_supervisor_id IS NOT NULL THEN
        INSERT INTO public.supervision_relationships (
            supervisor_id, 
            supervisee_id, 
            supervision_type, 
            start_date, 
            is_active
        )
        VALUES (
            p_supervisor_id,
            new_user_id,
            p_supervision_type,
            CURRENT_DATE,
            true
        );
    END IF;
    
    RETURN new_user_id;
END;
$$;
```

## Data Flow

1. **User fills out comprehensive form** → Form data stored in React state
2. **User submits form** → `handleSubmit` validates and transforms data
3. **Frontend calls Supabase RPC** → `create_staff_member` function
4. **Database function executes** → Creates user, profile, roles, supervision
5. **Success response** → User redirected to staff list
6. **Error handling** → Toast notifications for success/error

## Key Features

- **Comprehensive Data Collection**: All staff information captured in one form
- **Data Validation**: Frontend and backend validation
- **Transaction Safety**: Database function ensures atomic operations
- **Role Management**: Multiple roles can be assigned
- **Supervision Relationships**: Automatic supervision relationship creation
- **Error Handling**: Comprehensive error handling at all levels
- **Type Safety**: TypeScript interfaces ensure data consistency

## Database Schema

The workflow creates records in these tables:
- `users` - Basic user information
- `staff_profiles` - Staff-specific information
- `user_roles` - Role assignments
- `supervision_relationships` - Supervision hierarchy

## Security

- Database function uses `SECURITY DEFINER` for proper permissions
- Input validation at multiple levels
- Transaction safety prevents partial data creation
- Role-based access control through user_roles table 