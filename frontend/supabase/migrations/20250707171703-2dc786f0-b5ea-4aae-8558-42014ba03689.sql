-- Add the missing cache functions
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