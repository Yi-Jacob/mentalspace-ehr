import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

interface LogRequest {
  method: string;
  url: string;
  statusCode: number;
  responseTime?: number;
  userId?: string;
  ipAddress?: string;
  userAgent?: string;
  requestBody?: any;
  responseBody?: any;
  errorMessage?: string;
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
    const logData: LogRequest = await req.json();
    
    // Sanitize sensitive data
    const sanitizedRequestBody = sanitizeData(logData.requestBody);
    const sanitizedResponseBody = sanitizeData(logData.responseBody);
    
    // Log API request/response to database
    const { error } = await supabase.from('api_logs').insert({
      method: logData.method,
      url: logData.url,
      status_code: logData.statusCode,
      response_time_ms: logData.responseTime,
      user_id: logData.userId,
      ip_address: logData.ipAddress,
      user_agent: logData.userAgent,
      request_body: sanitizedRequestBody,
      response_body: sanitizedResponseBody,
      error_message: logData.errorMessage,
      created_at: new Date().toISOString()
    });

    if (error) {
      console.error('Failed to log API request:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to log request' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Log to console for real-time monitoring
    const logLevel = getLogLevel(logData.statusCode);
    const logMessage = `${logData.method} ${logData.url} - ${logData.statusCode} (${logData.responseTime}ms)`;
    
    if (logLevel === 'error') {
      console.error(logMessage, { error: logData.errorMessage });
    } else if (logLevel === 'warn') {
      console.warn(logMessage);
    } else {
      console.log(logMessage);
    }

    return new Response(
      JSON.stringify({ logged: true }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('API logger error:', error);
    return new Response(
      JSON.stringify({ error: 'Invalid log request format' }),
      { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

function sanitizeData(data: any): any {
  if (!data) return null;
  
  const sensitiveFields = [
    'password', 'token', 'secret', 'key', 'ssn', 'social_security_number',
    'date_of_birth', 'dob', 'credit_card', 'phone_number', 'email'
  ];
  
  if (typeof data === 'object') {
    const sanitized = { ...data };
    
    for (const field of sensitiveFields) {
      if (sanitized[field]) {
        sanitized[field] = '[REDACTED]';
      }
    }
    
    // Recursively sanitize nested objects
    for (const key in sanitized) {
      if (typeof sanitized[key] === 'object') {
        sanitized[key] = sanitizeData(sanitized[key]);
      }
    }
    
    return sanitized;
  }
  
  return data;
}

function getLogLevel(statusCode: number): string {
  if (statusCode >= 500) return 'error';
  if (statusCode >= 400) return 'warn';
  return 'info';
}