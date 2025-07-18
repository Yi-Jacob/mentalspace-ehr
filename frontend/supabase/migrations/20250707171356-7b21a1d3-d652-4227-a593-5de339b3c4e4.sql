-- Performance Optimization Database Migrations

-- Add indexes for frequently queried tables to improve performance

-- 1. Client-related queries (most frequent in healthcare apps)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_clients_assigned_clinician 
ON public.clients(assigned_clinician_id) 
WHERE is_active = true;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_clients_created_date 
ON public.clients(created_at DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_clients_search 
ON public.clients USING gin((
  setweight(to_tsvector('english', coalesce(first_name, '')), 'A') ||
  setweight(to_tsvector('english', coalesce(last_name, '')), 'A') ||
  setweight(to_tsvector('english', coalesce(email, '')), 'B')
));

-- 2. Clinical notes queries (critical for performance)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_clinical_notes_provider_date 
ON public.clinical_notes(provider_id, created_at DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_clinical_notes_client_date 
ON public.clinical_notes(client_id, created_at DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_clinical_notes_status 
ON public.clinical_notes(status, updated_at DESC) 
WHERE status IN ('draft', 'submitted_for_review');

-- 3. Appointment queries
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_appointments_provider_date 
ON public.appointments(provider_id, start_time);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_appointments_client_date 
ON public.appointments(client_id, start_time);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_appointments_status_date 
ON public.appointments(status, start_time) 
WHERE status IN ('scheduled', 'completed');

-- 4. Message queries
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_conversations_therapist_updated 
ON public.conversations(therapist_id, last_message_at DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_messages_conversation_date 
ON public.messages(conversation_id, created_at DESC);

-- 5. Audit and compliance queries
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_audit_logs_user_date 
ON public.audit_logs(user_id, created_at DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_hipaa_logs_patient_date 
ON public.hipaa_access_logs(patient_id, created_at DESC);

-- 6. Staff and user queries
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_roles_active 
ON public.user_roles(user_id, role) 
WHERE is_active = true;

-- Create performance monitoring table for tracking
CREATE TABLE IF NOT EXISTS public.performance_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_name TEXT NOT NULL,
  metric_value NUMERIC NOT NULL,
  metric_unit TEXT NOT NULL DEFAULT 'ms',
  user_id UUID REFERENCES public.users(id),
  route TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for performance metrics
CREATE INDEX IF NOT EXISTS idx_performance_metrics_name_date 
ON public.performance_metrics(metric_name, created_at DESC);

-- Cache table for expensive queries
CREATE TABLE IF NOT EXISTS public.query_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cache_key TEXT UNIQUE NOT NULL,
  cache_data JSONB NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for cache lookups
CREATE INDEX IF NOT EXISTS idx_query_cache_key 
ON public.query_cache(cache_key) 
WHERE expires_at > NOW();

-- Function to get cached query results
CREATE OR REPLACE FUNCTION public.get_cached_query(p_cache_key TEXT)
RETURNS JSONB AS $$
DECLARE
  cached_data JSONB;
BEGIN
  SELECT cache_data INTO cached_data
  FROM public.query_cache
  WHERE cache_key = p_cache_key
    AND expires_at > NOW();
  
  RETURN cached_data;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to set cached query results
CREATE OR REPLACE FUNCTION public.set_cached_query(
  p_cache_key TEXT,
  p_data JSONB,
  p_expires_minutes INTEGER DEFAULT 60
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO public.query_cache (cache_key, cache_data, expires_at)
  VALUES (
    p_cache_key,
    p_data,
    NOW() + (p_expires_minutes || ' minutes')::INTERVAL
  )
  ON CONFLICT (cache_key) 
  DO UPDATE SET 
    cache_data = EXCLUDED.cache_data,
    expires_at = EXCLUDED.expires_at,
    created_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Optimized dashboard query function with caching
CREATE OR REPLACE FUNCTION public.get_dashboard_metrics_cached(
  p_user_id UUID DEFAULT NULL,
  p_cache_minutes INTEGER DEFAULT 30
)
RETURNS JSONB AS $$
DECLARE
  cache_key TEXT;
  cached_result JSONB;
  fresh_result JSONB;
BEGIN
  -- Create cache key
  cache_key := 'dashboard_metrics_' || COALESCE(p_user_id::TEXT, 'all');
  
  -- Try to get cached result
  cached_result := public.get_cached_query(cache_key);
  
  IF cached_result IS NOT NULL THEN
    RETURN cached_result;
  END IF;
  
  -- Generate fresh result
  WITH user_stats AS (
    SELECT 
      COUNT(DISTINCT c.id) as total_clients,
      COUNT(DISTINCT cn.id) as total_notes,
      COUNT(DISTINCT a.id) as total_appointments,
      COUNT(DISTINCT CASE WHEN cn.status = 'draft' THEN cn.id END) as pending_notes
    FROM public.clients c
    LEFT JOIN public.clinical_notes cn ON cn.client_id = c.id
    LEFT JOIN public.appointments a ON a.client_id = c.id
    WHERE (p_user_id IS NULL OR c.assigned_clinician_id = p_user_id)
      AND c.is_active = true
      AND cn.created_at >= CURRENT_DATE - INTERVAL '30 days'
      AND a.created_at >= CURRENT_DATE - INTERVAL '30 days'
  )
  SELECT json_build_object(
    'totalClients', total_clients,
    'totalNotes', total_notes,
    'totalAppointments', total_appointments,
    'pendingNotes', pending_notes,
    'generatedAt', NOW()
  ) INTO fresh_result
  FROM user_stats;
  
  -- Cache the result
  PERFORM public.set_cached_query(cache_key, fresh_result, p_cache_minutes);
  
  RETURN fresh_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RLS policies for performance tables
ALTER TABLE public.performance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.query_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own performance metrics" 
ON public.performance_metrics 
FOR INSERT 
WITH CHECK (user_id = (SELECT id FROM public.users WHERE auth_user_id = auth.uid()));

CREATE POLICY "Admins can view all performance metrics" 
ON public.performance_metrics 
FOR SELECT 
USING (has_role((SELECT id FROM public.users WHERE auth_user_id = auth.uid()), 'Practice Administrator'));

CREATE POLICY "System can manage query cache" 
ON public.query_cache 
FOR ALL 
USING (true);