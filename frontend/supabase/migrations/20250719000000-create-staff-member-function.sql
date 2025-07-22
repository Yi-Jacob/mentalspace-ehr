-- Create comprehensive staff member creation function
-- This function handles the complete workflow of creating a staff member
-- including user creation, staff profile, role assignment, and supervision relationships

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
    
    -- Create supervision relationship if supervisor is specified and supervision type is not 'Not Supervised'
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

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION create_staff_member TO authenticated; 