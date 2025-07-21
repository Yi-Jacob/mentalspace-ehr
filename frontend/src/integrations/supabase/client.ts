// Enhanced Supabase client with connection pooling and environment configuration
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';
import { ENV_CONFIG } from '@/utils/environmentConfig';

const SUPABASE_URL = ENV_CONFIG.supabase.url;
const SUPABASE_PUBLISHABLE_KEY = ENV_CONFIG.supabase.anonKey;

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    storageKey: 'mentalspace-auth',
    storage: window?.localStorage,
    detectSessionInUrl: true,
    flowType: 'pkce'
  },
  realtime: {
    params: {
      eventsPerSecond: ENV_CONFIG.app.environment === 'production' ? 10 : 20
    }
  },
  global: {
    headers: {
      'x-application-name': ENV_CONFIG.app.name,
      'x-application-version': ENV_CONFIG.app.version,
      'x-environment': ENV_CONFIG.app.environment
    }
  },
  db: {
    schema: 'public'
  }
});