# Backend Staff Creation Workflow

This document outlines the complete workflow for creating staff members using the NestJS backend and PostgreSQL database.

## Overview

The staff creation workflow now uses:
1. **Frontend Form**: Comprehensive form collecting all staff information
2. **Frontend Processing**: Data transformation and validation
3. **Backend API**: NestJS controller and service handling the request
4. **Database**: PostgreSQL with Prisma ORM for data persistence

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

Transforms form data to match backend DTO structure:

```typescript
const staffData = {
  // Basic user information
  firstName: formData.first_name,
  lastName: formData.last_name,
  email: formData.email,
  middleName: formData.middle_name,
  suffix: formData.suffix,
  avatarUrl: formData.avatar_url,

  // Contact information
  userName: formData.user_name,
  mobilePhone: formData.mobile_phone,
  workPhone: formData.work_phone,
  homePhone: formData.home_phone,
  canReceiveText: formData.can_receive_text,

  // Address information
  address1: formData.address_1,
  address2: formData.address_2,
  city: formData.city,
  state: formData.state,
  zipCode: formData.zip_code,

  // Staff profile information
  employeeId: formData.employee_id,
  jobTitle: formData.job_title,
  formalName: formData.formal_name,
  npiNumber: formData.npi_number,
  department: formData.department,
  phoneNumber: formData.phone_number,
  licenseNumber: formData.license_number,
  licenseState: formData.license_state,
  licenseExpiryDate: formData.license_expiry_date,
  hireDate: formData.hire_date,
  billingRate: formData.billing_rate ? parseFloat(formData.billing_rate) : undefined,
  canBillInsurance: formData.can_bill_insurance,
  status: formData.status as UserStatus || 'active',
  notes: formData.notes,

  // Additional fields
  clinicianType: formData.clinician_type,
  supervisionType: formData.supervision_type,
  supervisorId: formData.supervisor_id,

  // Roles
  roles: formData.roles || [],

  // User comments
  userComments: formData.user_comments
};
```

### 3. API Service (`staffService.ts`)

Calls the backend API:

```typescript
async createStaff(input: CreateStaffInput): Promise<StaffMember> {
  try {
    return await apiClient.post<StaffMember>('/staff', input);
  } catch (error) {
    console.error('Error creating staff:', error);
    throw error;
  }
}
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

Handles the complete staff creation workflow using Prisma transactions:

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
          npiNumber: createUserDto.npiNumber,
          licenseNumber: createUserDto.licenseNumber,
          licenseState: createUserDto.licenseState,
          licenseExpiryDate: createUserDto.licenseExpiryDate ? new Date(createUserDto.licenseExpiryDate) : new Date(),
          department: createUserDto.department,
          jobTitle: createUserDto.jobTitle,
          hireDate: createUserDto.hireDate ? new Date(createUserDto.hireDate) : new Date(),
          phoneNumber: createUserDto.phoneNumber,
          billingRate: createUserDto.billingRate,
          canBillInsurance: createUserDto.canBillInsurance || false,
          status: createUserDto.status || 'active',
          notes: createUserDto.notes,
        },
      });

      // 3. Assign roles if provided
      if (createUserDto.roles && createUserDto.roles.length > 0) {
        const roleData = createUserDto.roles.map(role => ({
          userId: user.id,
          role: role,
          isActive: true,
        }));

        await prisma.userRole.createMany({
          data: roleData,
        });
      }

      // 4. Create supervision relationship if supervisor is specified
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

## Database Schema

The workflow creates records in these tables:

### 1. Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_user_id TEXT,
  email TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 2. Staff Profiles Table
```sql
CREATE TABLE staff_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  employee_id TEXT,
  npi_number TEXT,
  license_number TEXT,
  license_state TEXT,
  license_expiry_date TIMESTAMP,
  department TEXT,
  job_title TEXT,
  hire_date TIMESTAMP,
  phone_number TEXT,
  billing_rate DECIMAL,
  can_bill_insurance BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'active',
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 3. User Roles Table
```sql
CREATE TABLE user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  role user_role NOT NULL,
  is_active BOOLEAN DEFAULT true,
  assigned_at TIMESTAMP DEFAULT NOW()
);
```

### 4. Supervision Relationships Table
```sql
CREATE TABLE supervision_relationships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  supervisor_id UUID REFERENCES users(id),
  supervisee_id UUID REFERENCES users(id),
  supervision_type TEXT,
  start_date TIMESTAMP DEFAULT NOW(),
  end_date TIMESTAMP,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Data Flow

1. **User fills out comprehensive form** → Form data stored in React state
2. **User submits form** → `handleSubmit` validates and transforms data
3. **Frontend calls backend API** → `staffService.createStaff()` 
4. **Backend controller receives request** → Validates DTO
5. **Backend service processes request** → Uses Prisma transaction
6. **Database operations execute** → Creates user, profile, roles, supervision
7. **Success response** → User redirected to staff list
8. **Error handling** → Toast notifications for success/error

## Key Features

- **Comprehensive Data Collection**: All staff information captured in one form
- **Data Validation**: Frontend and backend validation with class-validator
- **Transaction Safety**: Prisma transactions ensure atomic operations
- **Role Management**: Multiple roles can be assigned to staff members
- **Supervision Relationships**: Automatic supervision relationship creation
- **Error Handling**: Comprehensive error handling at all levels
- **Type Safety**: TypeScript interfaces ensure data consistency
- **RESTful API**: Standard HTTP methods for CRUD operations

## API Endpoints

### Create Staff Member
```
POST /staff
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "roles": ["CLINICIAN"],
  "employeeId": "EMP001",
  "jobTitle": "Therapist",
  "department": "Clinical",
  "phoneNumber": "555-0123",
  "npiNumber": "1234567890",
  "licenseNumber": "LIC123",
  "licenseState": "CA",
  "licenseExpiryDate": "2025-12-31",
  "hireDate": "2024-01-01",
  "billingRate": 150.00,
  "canBillInsurance": true,
  "status": "active",
  "notes": "New staff member",
  "supervisionType": "Not Supervised",
  "supervisorId": null
}
```

### Get All Staff
```
GET /staff
```

### Get Staff by ID
```
GET /staff/:id
```

### Update Staff
```
PUT /staff/:id
```

### Delete Staff
```
DELETE /staff/:id
```

## Security

- **Input Validation**: Class-validator decorators ensure data integrity
- **Transaction Safety**: Prisma transactions prevent partial data creation
- **Error Handling**: Proper error responses and logging
- **Type Safety**: TypeScript interfaces prevent runtime errors

## Testing

### Backend Testing
```typescript
// Test the service
const result = await usersService.create({
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  roles: ['CLINICIAN'],
  // ... other fields
});
```

### Frontend Testing
```typescript
// Test the API call
const staffData = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  // ... other fields
};

const result = await staffService.createStaff(staffData);
```

## Integration with Your Workflow

The workflow integrates with your existing system:

1. **Frontend Form** → Collects staff data
2. **useAddStaffSubmit** → Transforms data
3. **staffService** → Calls backend API
4. **Backend Controller** → Validates and processes
5. **Backend Service** → Uses Prisma to save data
6. **Database** → Stores all related records
7. **Success Response** → User redirected to staff list

This approach provides a clean separation of concerns, excellent error handling, and maintains data consistency throughout the staff creation process. 