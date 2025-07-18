-- Create rate limiting table
CREATE TABLE public.rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  identifier TEXT NOT NULL,
  request_count INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(identifier)
);

-- Create API logging table
CREATE TABLE public.api_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  method TEXT NOT NULL,
  url TEXT NOT NULL,
  status_code INTEGER NOT NULL,
  response_time_ms INTEGER,
  user_id UUID,
  ip_address INET,
  user_agent TEXT,
  request_body JSONB,
  response_body JSONB,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create function to increment rate limit
CREATE OR REPLACE FUNCTION public.increment_rate_limit(
  p_identifier TEXT,
  p_window_ms INTEGER
)
RETURNS INTEGER AS $$
DECLARE
  current_count INTEGER;
  cutoff_time TIMESTAMP WITH TIME ZONE;
BEGIN
  cutoff_time := NOW() - (p_window_ms || ' milliseconds')::INTERVAL;
  
  -- Clean up old entries
  DELETE FROM public.rate_limits 
  WHERE identifier = p_identifier AND created_at < cutoff_time;
  
  -- Get or create current count
  INSERT INTO public.rate_limits (identifier, request_count, created_at, updated_at)
  VALUES (p_identifier, 1, NOW(), NOW())
  ON CONFLICT (identifier) 
  DO UPDATE SET 
    request_count = rate_limits.request_count + 1,
    updated_at = NOW()
  RETURNING request_count INTO current_count;
  
  RETURN current_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create indexes for performance
CREATE INDEX idx_rate_limits_identifier_created ON public.rate_limits (identifier, created_at);
CREATE INDEX idx_api_logs_created_at ON public.api_logs (created_at);
CREATE INDEX idx_api_logs_user_id ON public.api_logs (user_id);
CREATE INDEX idx_api_logs_status_code ON public.api_logs (status_code);

-- Enable RLS
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_logs ENABLE ROW LEVEL SECURITY;

-- Rate limits policies (admin only)
CREATE POLICY "Administrators can view rate limits" 
ON public.rate_limits FOR SELECT 
USING (has_role((SELECT users.id FROM users WHERE users.auth_user_id = auth.uid()), 'Practice Administrator'::user_role));

-- API logs policies (admin only)
CREATE POLICY "Administrators can view API logs" 
ON public.api_logs FOR SELECT 
USING (has_role((SELECT users.id FROM users WHERE users.auth_user_id = auth.uid()), 'Practice Administrator'::user_role));

CREATE POLICY "System can insert API logs" 
ON public.api_logs FOR INSERT 
WITH CHECK (true);