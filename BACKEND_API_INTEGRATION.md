# Backend API Integration Guide

This document outlines the complete integration between the frontend and backend API for staff management, with all API communication centralized in service files.

## Overview

The system now uses a **NestJS backend** with **PostgreSQL database** for all staff operations, with all API communication handled through dedicated service files.

## Architecture

```
Frontend Components → Service Files → Backend API → PostgreSQL Database
```

## Service Layer Structure

### 1. **Staff Service** (`staffService.ts`)

Centralized API communication for all staff operations:

```typescript
export class StaffService {
  // Core CRUD operations
  async getAllStaff(): Promise<StaffMember[]>
  async getStaffById(id: string): Promise<StaffMember | null>
  async createStaff(input: CreateStaffInput): Promise<StaffMember>
  async updateStaff(id: string, input: UpdateStaffInput): Promise<StaffMember>
  async deleteStaff(id: string): Promise<StaffMember>

  // Status management
  async deactivateStaff(id: string): Promise<void>
  async activateStaff(id: string): Promise<void>

  // Search and filtering
  async searchStaff(params: StaffSearchParams): Promise<StaffMember[]>
  async getStaffByDepartment(department: string): Promise<StaffMember[]>
  async getStaffByRole(role: string): Promise<StaffMember[]>

  // Role management
  async updateStaffRoles(id: string, roles: UserRole[]): Promise<StaffMember>

  // Analytics and reporting
  async getStaffStatistics(): Promise<StaffStatistics>
  async exportStaffData(format: 'csv' | 'excel'): Promise<Blob>

  // Bulk operations
  async bulkUpdateStaff(updates: Array<{ id: string; data: UpdateStaffInput }>): Promise<StaffMember[]>
  async bulkDeactivateStaff(ids: string[]): Promise<void>
}
```

## API Endpoints

### Core Staff Operations

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/staff` | Get all staff members |
| `GET` | `/staff/:id` | Get staff member by ID |
| `POST` | `/staff` | Create new staff member |
| `PUT` | `/staff/:id` | Update staff member |
| `DELETE` | `/staff/:id` | Delete staff member |

### Status Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| `PATCH` | `/staff/:id/deactivate` | Deactivate staff member |
| `PATCH` | `/staff/:id/activate` | Activate staff member |

### Search and Filtering

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/staff/search` | Search staff with parameters |
| `GET` | `/staff/department/:department` | Get staff by department |
| `GET` | `/staff/role/:role` | Get staff by role |

### Role Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| `PATCH` | `/staff/:id/roles` | Update staff roles |

### Analytics and Reporting

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/staff/statistics` | Get staff statistics |
| `GET` | `/staff/export` | Export staff data |

### Bulk Operations

| Method | Endpoint | Description |
|--------|----------|-------------|
| `PATCH` | `/staff/bulk` | Bulk update staff |
| `PATCH` | `/staff/bulk/deactivate` | Bulk deactivate staff |

## Data Flow

### 1. **Staff Listing**
```
Frontend Component → useStaffQueries → staffService.getAllStaff() → Backend API → PostgreSQL
```

### 2. **Staff Creation**
```
Frontend Form → useAddStaffSubmit → staffService.createStaff() → Backend API → PostgreSQL
```

### 3. **Staff Updates**
```
Frontend Component → useStaffManagement → staffService.updateStaff() → Backend API → PostgreSQL
```

## Frontend Integration

### 1. **Query Hooks** (`useStaffQueries.ts`)

```typescript
export const useStaffQueries = () => {
  const { data: staffMembers, isLoading, error } = useQuery({
    queryKey: ['staff-members'],
    queryFn: async () => {
      return await staffService.getAllStaff();
    },
  });

  return { staffMembers, isLoading, error };
};
```

### 2. **Management Hooks** (`useStaffManagement.ts`)

```typescript
export const useStaffManagement = () => {
  const createStaffMutation = useMutation({
    mutationFn: (input: CreateStaffInput) => staffService.createStaff(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff-members'] });
    },
  });

  return {
    createStaffMember: createStaffMutation.mutate,
    isCreating: createStaffMutation.isPending,
    // ... other operations
  };
};
```

### 3. **Submit Handlers** (`useAddStaffSubmit.ts`)

```typescript
const handleSubmit = async (e: React.FormEvent, formData: any) => {
  const staffData = {
    firstName: formData.first_name,
    lastName: formData.last_name,
    email: formData.email,
    // ... transform form data
  };

  await createStaffMember(staffData);
};
```

## Backend Data Transformation

The backend service transforms data to match frontend expectations:

```typescript
// Backend service returns data in frontend-expected format
return {
  id: user.id,
  first_name: user.firstName,
  last_name: user.lastName,
  email: user.email,
  is_active: user.isActive,
  staff_profile: staffProfile ? {
    id: staffProfile.id,
    job_title: staffProfile.jobTitle,
    department: staffProfile.department,
    phone_number: staffProfile.phoneNumber,
    // ... other fields
  } : null,
  roles: userRoles.map(role => ({
    id: role.id,
    role: role.role,
    is_active: role.isActive,
  })),
};
```

## Error Handling

### Service Level
```typescript
async getAllStaff(): Promise<StaffMember[]> {
  try {
    return await apiClient.get<StaffMember[]>('/staff');
  } catch (error) {
    console.error('Error fetching staff:', error);
    throw error;
  }
}
```

### Hook Level
```typescript
const createStaffMutation = useMutation({
  mutationFn: (input: CreateStaffInput) => staffService.createStaff(input),
  onError: (error: any) => {
    toast({
      title: 'Error',
      description: error.message || 'Failed to create staff member',
      variant: 'destructive',
    });
  },
});
```

## Type Safety

### Frontend Types
```typescript
export interface CreateStaffInput {
  email: string;
  firstName: string;
  lastName: string;
  // ... comprehensive interface
}

export interface StaffSearchParams {
  search?: string;
  department?: string;
  status?: string;
  role?: string;
  limit?: number;
  offset?: number;
}
```

### Backend DTOs
```typescript
export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;
  // ... validation decorators
}
```

## Benefits of This Architecture

### 1. **Centralized API Communication**
- All API calls go through service files
- Consistent error handling
- Easy to maintain and update

### 2. **Type Safety**
- TypeScript interfaces ensure data consistency
- Compile-time error checking
- Better developer experience

### 3. **Separation of Concerns**
- Frontend components focus on UI
- Service files handle API communication
- Backend handles business logic

### 4. **Reusability**
- Service methods can be used across components
- Consistent API patterns
- Easy to extend with new features

### 5. **Error Handling**
- Centralized error handling in services
- Consistent error messages
- Better user experience

## Migration from Supabase

### Before (Supabase)
```typescript
const { data, error } = await supabase
  .from('users')
  .select('*')
  .eq('is_active', true);
```

### After (Backend API)
```typescript
const staffData = await staffService.getAllStaff();
```

## Testing

### Service Testing
```typescript
// Test service methods
const staff = await staffService.getAllStaff();
expect(staff).toBeDefined();
expect(Array.isArray(staff)).toBe(true);
```

### Hook Testing
```typescript
// Test hooks
const { staffMembers, isLoading } = useStaffQueries();
expect(isLoading).toBe(false);
expect(staffMembers).toBeDefined();
```

## Performance Considerations

### 1. **Caching**
- React Query provides automatic caching
- Reduces unnecessary API calls
- Improves user experience

### 2. **Optimistic Updates**
- Update UI immediately
- Sync with server in background
- Better perceived performance

### 3. **Pagination**
- Load data in chunks
- Reduce initial load time
- Better for large datasets

## Security

### 1. **Input Validation**
- Backend validates all inputs
- Prevents malicious data
- Ensures data integrity

### 2. **Authentication**
- JWT tokens for API access
- Secure communication
- Role-based access control

### 3. **Error Handling**
- Don't expose sensitive information
- Log errors for debugging
- User-friendly error messages

This architecture provides a robust, scalable, and maintainable solution for staff management with clear separation of concerns and comprehensive error handling. 