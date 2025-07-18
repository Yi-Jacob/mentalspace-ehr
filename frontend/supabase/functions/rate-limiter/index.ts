import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  identifier: string;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );

  try {
    const { identifier, endpoint } = await req.json();
    
    // Rate limit configurations by endpoint
    const rateLimitConfigs: Record<string, RateLimitConfig> = {
      '/rest/v1/clients': {
        windowMs: 15 * 60 * 1000, // 15 minutes
        maxRequests: 100,
        identifier: identifier || req.headers.get('x-forwarded-for') || 'unknown'
      },
      '/rest/v1/clinical_notes': {
        windowMs: 15 * 60 * 1000, // 15 minutes
        maxRequests: 50, // More restrictive for sensitive data
        identifier: identifier || req.headers.get('x-forwarded-for') || 'unknown'
      },
      default: {
        windowMs: 15 * 60 * 1000, // 15 minutes
        maxRequests: 200,
        identifier: identifier || req.headers.get('x-forwarded-for') || 'unknown'
      }
    };

    const config = rateLimitConfigs[endpoint] || rateLimitConfigs.default;
    
    // Check current request count using our database function
    const { data: currentCount, error } = await supabase.rpc('increment_rate_limit', {
      p_identifier: config.identifier,
      p_window_ms: config.windowMs
    });

    if (error) {
      console.error('Rate limit check error:', error);
      return new Response(
        JSON.stringify({ error: 'Rate limit service unavailable' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    if (currentCount > config.maxRequests) {
      console.log(`Rate limit exceeded for ${config.identifier}: ${currentCount}/${config.maxRequests}`);
      
      return new Response(
        JSON.stringify({ 
          error: 'Rate limit exceeded',
          retryAfter: Math.ceil(config.windowMs / 1000),
          limit: config.maxRequests,
          remaining: 0,
          reset: new Date(Date.now() + config.windowMs).toISOString()
        }),
        { 
          status: 429, 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json',
            'Retry-After': Math.ceil(config.windowMs / 1000).toString(),
            'X-RateLimit-Limit': config.maxRequests.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': new Date(Date.now() + config.windowMs).toISOString()
          }
        }
      );
    }

    const remaining = Math.max(0, config.maxRequests - currentCount);
    
    return new Response(
      JSON.stringify({ 
        allowed: true,
        limit: config.maxRequests,
        remaining,
        reset: new Date(Date.now() + config.windowMs).toISOString()
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json',
          'X-RateLimit-Limit': config.maxRequests.toString(),
          'X-RateLimit-Remaining': remaining.toString(),
          'X-RateLimit-Reset': new Date(Date.now() + config.windowMs).toISOString()
        }
      }
    );

  } catch (error) {
    console.error('Rate limiter error:', error);
    return new Response(
      JSON.stringify({ error: 'Invalid request format' }),
      { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});