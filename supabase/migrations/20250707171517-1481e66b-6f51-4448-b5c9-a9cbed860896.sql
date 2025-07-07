-- Performance and Cache Tables

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