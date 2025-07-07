-- Performance Optimization Database Migrations (Fixed)

-- Add indexes for frequently queried tables to improve performance

-- 1. Client-related queries (most frequent in healthcare apps)
CREATE INDEX IF NOT EXISTS idx_clients_assigned_clinician 
ON public.clients(assigned_clinician_id) 
WHERE is_active = true;

CREATE INDEX IF NOT EXISTS idx_clients_created_date 
ON public.clients(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_clients_search 
ON public.clients USING gin((
  setweight(to_tsvector('english', coalesce(first_name, '')), 'A') ||
  setweight(to_tsvector('english', coalesce(last_name, '')), 'A') ||
  setweight(to_tsvector('english', coalesce(email, '')), 'B')
));

-- 2. Clinical notes queries (critical for performance)
CREATE INDEX IF NOT EXISTS idx_clinical_notes_provider_date 
ON public.clinical_notes(provider_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_clinical_notes_client_date 
ON public.clinical_notes(client_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_clinical_notes_status 
ON public.clinical_notes(status, updated_at DESC) 
WHERE status IN ('draft', 'submitted_for_review');

-- 3. Appointment queries
CREATE INDEX IF NOT EXISTS idx_appointments_provider_date 
ON public.appointments(provider_id, start_time);

CREATE INDEX IF NOT EXISTS idx_appointments_client_date 
ON public.appointments(client_id, start_time);

CREATE INDEX IF NOT EXISTS idx_appointments_status_date 
ON public.appointments(status, start_time) 
WHERE status IN ('scheduled', 'completed');

-- 4. Message queries
CREATE INDEX IF NOT EXISTS idx_conversations_therapist_updated 
ON public.conversations(therapist_id, last_message_at DESC);

CREATE INDEX IF NOT EXISTS idx_messages_conversation_date 
ON public.messages(conversation_id, created_at DESC);

-- 5. Audit and compliance queries
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_date 
ON public.audit_logs(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_hipaa_logs_patient_date 
ON public.hipaa_access_logs(patient_id, created_at DESC);

-- 6. Staff and user queries
CREATE INDEX IF NOT EXISTS idx_user_roles_active 
ON public.user_roles(user_id, role) 
WHERE is_active = true;