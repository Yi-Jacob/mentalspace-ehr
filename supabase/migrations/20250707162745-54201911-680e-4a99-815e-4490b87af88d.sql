-- Create comprehensive audit logging tables
CREATE TABLE public.security_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  session_id TEXT,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT,
  ip_address INET,
  user_agent TEXT,
  details JSONB DEFAULT '{}',
  severity TEXT DEFAULT 'info' CHECK (severity IN ('info', 'warning', 'critical')),
  status TEXT DEFAULT 'success' CHECK (status IN ('success', 'failure', 'blocked')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create HIPAA compliance tracking table
CREATE TABLE public.hipaa_access_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  patient_id UUID NOT NULL,
  access_type TEXT NOT NULL CHECK (access_type IN ('view', 'create', 'update', 'delete', 'export')),
  data_accessed TEXT,
  purpose TEXT,
  authorized BOOLEAN DEFAULT true,
  ip_address INET,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create data classification table for HIPAA compliance
CREATE TABLE public.data_classifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name TEXT NOT NULL,
  column_name TEXT NOT NULL,
  classification TEXT NOT NULL CHECK (classification IN ('phi', 'pii', 'sensitive', 'public')),
  encryption_required BOOLEAN DEFAULT false,
  retention_period_days INTEGER,
  anonymization_rules JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(table_name, column_name)
);

-- Create compliance reports table
CREATE TABLE public.compliance_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_type TEXT NOT NULL,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  generated_by UUID NOT NULL,
  report_data JSONB NOT NULL,
  status TEXT DEFAULT 'generated' CHECK (status IN ('generated', 'reviewed', 'approved')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert data classifications for HIPAA compliance
INSERT INTO public.data_classifications (table_name, column_name, classification, encryption_required, retention_period_days) VALUES
('clients', 'first_name', 'phi', true, 2555),
('clients', 'last_name', 'phi', true, 2555),
('clients', 'email', 'pii', true, 2555),
('clients', 'date_of_birth', 'phi', true, 2555),
('client_phone_numbers', 'phone_number', 'pii', true, 2555),
('client_insurance', 'policy_number', 'phi', true, 2555),
('clinical_notes', 'content', 'phi', true, 2555),
('users', 'email', 'pii', false, 2555),
('users', 'first_name', 'pii', false, 2555),
('users', 'last_name', 'pii', false, 2555);

-- Create indexes for performance
CREATE INDEX idx_security_audit_logs_user_id ON public.security_audit_logs (user_id);
CREATE INDEX idx_security_audit_logs_created_at ON public.security_audit_logs (created_at);
CREATE INDEX idx_security_audit_logs_action ON public.security_audit_logs (action);
CREATE INDEX idx_security_audit_logs_severity ON public.security_audit_logs (severity);

CREATE INDEX idx_hipaa_access_logs_user_id ON public.hipaa_access_logs (user_id);
CREATE INDEX idx_hipaa_access_logs_patient_id ON public.hipaa_access_logs (patient_id);
CREATE INDEX idx_hipaa_access_logs_created_at ON public.hipaa_access_logs (created_at);
CREATE INDEX idx_hipaa_access_logs_access_type ON public.hipaa_access_logs (access_type);

-- Enable RLS on all new tables
ALTER TABLE public.security_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hipaa_access_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.data_classifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_reports ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for security audit logs
CREATE POLICY "Administrators can view security audit logs" 
ON public.security_audit_logs FOR SELECT 
USING (has_role((SELECT users.id FROM users WHERE users.auth_user_id = auth.uid()), 'Practice Administrator'::user_role));

CREATE POLICY "System can insert security audit logs" 
ON public.security_audit_logs FOR INSERT 
WITH CHECK (true);

-- Create RLS policies for HIPAA access logs
CREATE POLICY "Users can view their own HIPAA access logs" 
ON public.hipaa_access_logs FOR SELECT 
USING (user_id = (SELECT users.id FROM users WHERE users.auth_user_id = auth.uid()));

CREATE POLICY "Administrators can view all HIPAA access logs" 
ON public.hipaa_access_logs FOR SELECT 
USING (has_role((SELECT users.id FROM users WHERE users.auth_user_id = auth.uid()), 'Practice Administrator'::user_role));

CREATE POLICY "System can insert HIPAA access logs" 
ON public.hipaa_access_logs FOR INSERT 
WITH CHECK (true);

-- Create RLS policies for data classifications
CREATE POLICY "Administrators can manage data classifications" 
ON public.data_classifications FOR ALL 
USING (has_role((SELECT users.id FROM users WHERE users.auth_user_id = auth.uid()), 'Practice Administrator'::user_role));

-- Create RLS policies for compliance reports
CREATE POLICY "Administrators can manage compliance reports" 
ON public.compliance_reports FOR ALL 
USING (has_role((SELECT users.id FROM users WHERE users.auth_user_id = auth.uid()), 'Practice Administrator'::user_role));

-- Create function to log HIPAA access
CREATE OR REPLACE FUNCTION public.log_hipaa_access(
  p_patient_id UUID,
  p_access_type TEXT,
  p_data_accessed TEXT DEFAULT NULL,
  p_purpose TEXT DEFAULT NULL
)
RETURNS VOID AS $$
DECLARE
  current_user_id UUID;
BEGIN
  SELECT id INTO current_user_id 
  FROM public.users 
  WHERE auth_user_id = auth.uid();
  
  INSERT INTO public.hipaa_access_logs (
    user_id,
    patient_id,
    access_type,
    data_accessed,
    purpose,
    ip_address
  ) VALUES (
    current_user_id,
    p_patient_id,
    p_access_type,
    p_data_accessed,
    p_purpose,
    '127.0.0.1'::inet
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to log security events
CREATE OR REPLACE FUNCTION public.log_security_event(
  p_action TEXT,
  p_resource_type TEXT,
  p_resource_id TEXT DEFAULT NULL,
  p_details JSONB DEFAULT '{}',
  p_severity TEXT DEFAULT 'info',
  p_status TEXT DEFAULT 'success'
)
RETURNS VOID AS $$
DECLARE
  current_user_id UUID;
BEGIN
  SELECT id INTO current_user_id 
  FROM public.users 
  WHERE auth_user_id = auth.uid();
  
  INSERT INTO public.security_audit_logs (
    user_id,
    action,
    resource_type,
    resource_id,
    details,
    severity,
    status,
    ip_address
  ) VALUES (
    current_user_id,
    p_action,
    p_resource_type,
    p_resource_id,
    p_details,
    p_severity,
    p_status,
    '127.0.0.1'::inet
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;