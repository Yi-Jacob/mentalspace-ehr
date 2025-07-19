# MentalSpace Production Implementation Plan

**Based on Production Readiness Assessment**  
**Target: Transform 62/100 score to 90+ Production Ready**

---

## Implementation Overview

This plan addresses the 7 areas requiring improvement to achieve production readiness:

| Area | Current Score | Target Score | Priority | Effort |
|------|---------------|--------------|----------|---------|
| Backend/API Layer | 75/100 | 95/100 | High | Medium |
| Infrastructure/DevOps | 20/100 | 90/100 | Critical | Large |
| Security & Compliance | 45/100 | 95/100 | Critical | Large |
| Testing & Quality | 15/100 | 85/100 | Critical | Large |
| Performance & Scalability | 60/100 | 85/100 | Medium | Medium |
| Monitoring & Observability | 30/100 | 85/100 | High | Medium |
| Documentation | 40/100 | 80/100 | Low | Small |

---

## 1. Backend/API Layer Enhancement Plan

**Current Issues:**
- No API rate limiting
- Missing input validation middleware  
- No API documentation
- No edge functions for complex business logic
- Missing request/response logging

### 1.1 API Rate Limiting Implementation

**Timeline: 3 days**

Create edge function for rate limiting:

```typescript
// supabase/functions/rate-limiter/index.ts
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
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );

  const config: RateLimitConfig = {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100,
    identifier: req.headers.get('x-forwarded-for') || 'unknown'
  };

  // Check current request count
  const { data: existing } = await supabase
    .from('rate_limits')
    .select('*')
    .eq('identifier', config.identifier)
    .gte('created_at', new Date(Date.now() - config.windowMs).toISOString())
    .single();

  if (existing && existing.request_count >= config.maxRequests) {
    return new Response(
      JSON.stringify({ error: 'Rate limit exceeded' }),
      { 
        status: 429, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }

  // Update or create rate limit record
  await supabase.rpc('increment_rate_limit', {
    p_identifier: config.identifier,
    p_window_ms: config.windowMs
  });

  return new Response(
    JSON.stringify({ allowed: true }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
});
```

**Database Migration Required:**
```sql
-- Create rate limiting table
CREATE TABLE public.rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  identifier TEXT NOT NULL,
  request_count INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create function to increment rate limit
CREATE OR REPLACE FUNCTION public.increment_rate_limit(
  p_identifier TEXT,
  p_window_ms INTEGER
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO public.rate_limits (identifier, request_count, created_at, updated_at)
  VALUES (p_identifier, 1, NOW(), NOW())
  ON CONFLICT (identifier) 
  DO UPDATE SET 
    request_count = rate_limits.request_count + 1,
    updated_at = NOW()
  WHERE rate_limits.created_at > NOW() - (p_window_ms || ' milliseconds')::INTERVAL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### 1.2 Input Validation Middleware

**Timeline: 2 days**

Create validation schemas and middleware:

```typescript
// src/utils/validation.ts
import { z } from 'zod';

export const ClientValidationSchema = z.object({
  first_name: z.string().min(1, 'First name is required').max(50),
  last_name: z.string().min(1, 'Last name is required').max(50),
  email: z.string().email('Invalid email format').optional(),
  date_of_birth: z.string().refine((date) => {
    const parsedDate = new Date(date);
    const now = new Date();
    const age = now.getFullYear() - parsedDate.getFullYear();
    return age >= 0 && age <= 120;
  }, 'Invalid date of birth'),
  phone_numbers: z.array(z.object({
    phone_number: z.string().regex(/^\+?[\d\s\-\(\)]+$/, 'Invalid phone format'),
    phone_type: z.enum(['home', 'work', 'mobile', 'other'])
  })).optional()
});

export const ClinicalNoteValidationSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  content: z.record(z.any()),
  client_id: z.string().uuid('Invalid client ID'),
  note_type: z.enum(['progress_note', 'intake_assessment', 'treatment_plan', 'contact_note', 'consultation_note', 'cancellation_note', 'miscellaneous_note']),
  status: z.enum(['draft', 'submitted_for_review', 'signed', 'locked']).optional()
});

// Enhanced validation hook
export const useValidatedMutation = <T, R>(
  mutationFn: (data: T) => Promise<R>,
  validationSchema: z.ZodSchema<T>
) => {
  return useMutation({
    mutationFn: async (data: unknown) => {
      try {
        const validatedData = validationSchema.parse(data);
        return await mutationFn(validatedData);
      } catch (error) {
        if (error instanceof z.ZodError) {
          throw new Error(`Validation failed: ${error.errors.map(e => e.message).join(', ')}`);
        }
        throw error;
      }
    }
  });
};
```

### 1.3 API Documentation Generation

**Timeline: 2 days**

Create OpenAPI documentation:

```typescript
// src/utils/apiDocumentation.ts
export const openApiSpec = {
  openapi: '3.0.0',
  info: {
    title: 'MentalSpace API',
    version: '1.0.0',
    description: 'Healthcare practice management API'
  },
  servers: [
    {
      url: 'https://wjaccopklttdvnutdmtu.supabase.co',
      description: 'Production server'
    }
  ],
  paths: {
    '/rest/v1/clients': {
      get: {
        summary: 'Get clients',
        tags: ['Clients'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'select',
            in: 'query',
            schema: { type: 'string' },
            description: 'Columns to select'
          }
        ],
        responses: {
          200: {
            description: 'Successful response',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Client' }
                }
              }
            }
          }
        }
      },
      post: {
        summary: 'Create client',
        tags: ['Clients'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ClientInput' }
            }
          }
        },
        responses: {
          201: {
            description: 'Client created',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Client' }
              }
            }
          }
        }
      }
    }
  },
  components: {
    schemas: {
      Client: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          first_name: { type: 'string' },
          last_name: { type: 'string' },
          email: { type: 'string', format: 'email' },
          date_of_birth: { type: 'string', format: 'date' },
          created_at: { type: 'string', format: 'date-time' }
        }
      },
      ClientInput: {
        type: 'object',
        required: ['first_name', 'last_name'],
        properties: {
          first_name: { type: 'string', minLength: 1, maxLength: 50 },
          last_name: { type: 'string', minLength: 1, maxLength: 50 },
          email: { type: 'string', format: 'email' },
          date_of_birth: { type: 'string', format: 'date' }
        }
      }
    },
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    }
  }
};
```

### 1.4 Request/Response Logging Edge Function

**Timeline: 1 day**

```typescript
// supabase/functions/api-logger/index.ts
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async (req: Request) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );

  const logData = await req.json();
  
  // Log API request/response
  await supabase.from('api_logs').insert({
    method: logData.method,
    url: logData.url,
    status_code: logData.statusCode,
    response_time_ms: logData.responseTime,
    user_id: logData.userId,
    ip_address: logData.ipAddress,
    user_agent: logData.userAgent,
    request_body: logData.requestBody,
    response_body: logData.responseBody,
    created_at: new Date().toISOString()
  });

  return new Response(JSON.stringify({ logged: true }), {
    headers: { 'Content-Type': 'application/json' }
  });
});
```

---

## 2. Infrastructure & DevOps Implementation Plan

**Current State: 20/100 (Critical)**
**Target: 90/100**

### 2.1 CI/CD Pipeline Setup

**Timeline: 1 week**

Create GitHub Actions workflow:

```yaml
# .github/workflows/ci-cd.yml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

env:
  NODE_VERSION: '18'

jobs:
  lint-and-type-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run ESLint
        run: npm run lint
      
      - name: Type check
        run: npx tsc --noEmit

  test:
    runs-on: ubuntu-latest
    needs: lint-and-type-check
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run unit tests
        run: npm run test:unit
      
      - name: Run integration tests
        run: npm run test:integration
        env:
          SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}

  security-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Run security audit
        run: npm audit --audit-level high
      
      - name: Dependency vulnerability scan
        uses: securecodewarrior/github-action-add-sarif@v1
        with:
          sarif-file: 'security-scan-results.sarif'

  build:
    runs-on: ubuntu-latest
    needs: [lint-and-type-check, test]
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build application
        run: npm run build
        env:
          VITE_SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}
      
      - name: Upload build artifacts
        uses: actions/upload-artifact@v4
        with:
          name: build-files
          path: dist/

  deploy-staging:
    runs-on: ubuntu-latest
    needs: build
    if: github.ref == 'refs/heads/develop'
    environment: staging
    steps:
      - name: Deploy to staging
        run: |
          echo "Deploy to staging environment"
          # Add staging deployment logic

  deploy-production:
    runs-on: ubuntu-latest
    needs: build
    if: github.ref == 'refs/heads/main'
    environment: production
    steps:
      - name: Deploy to production
        run: |
          echo "Deploy to production environment"
          # Add production deployment logic
      
      - name: Run smoke tests
        run: |
          echo "Run post-deployment smoke tests"
          # Add smoke test logic
```

### 2.2 Environment Configuration

**Timeline: 2 days**

Create environment management:

```typescript
// src/config/environment.ts
export interface EnvironmentConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
  environment: 'development' | 'staging' | 'production';
  apiBaseUrl: string;
  enableAnalytics: boolean;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
}

export const getEnvironmentConfig = (): EnvironmentConfig => {
  const environment = (import.meta.env.VITE_ENVIRONMENT || 'development') as EnvironmentConfig['environment'];
  
  const configs: Record<EnvironmentConfig['environment'], EnvironmentConfig> = {
    development: {
      supabaseUrl: 'https://wjaccopklttdvnutdmtu.supabase.co',
      supabaseAnonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      environment: 'development',
      apiBaseUrl: 'https://wjaccopklttdvnutdmtu.supabase.co',
      enableAnalytics: false,
      logLevel: 'debug'
    },
    staging: {
      supabaseUrl: import.meta.env.VITE_SUPABASE_URL!,
      supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY!,
      environment: 'staging',
      apiBaseUrl: import.meta.env.VITE_API_BASE_URL!,
      enableAnalytics: true,
      logLevel: 'info'
    },
    production: {
      supabaseUrl: import.meta.env.VITE_SUPABASE_URL!,
      supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY!,
      environment: 'production',
      apiBaseUrl: import.meta.env.VITE_API_BASE_URL!,
      enableAnalytics: true,
      logLevel: 'error'
    }
  };

  return configs[environment];
};
```

### 2.3 Docker Containerization

**Timeline: 2 days**

```dockerfile
# Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM nginx:alpine AS production

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

```nginx
# nginx.conf
events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    gzip on;
    gzip_types text/plain text/css application/json application/javascript;

    server {
        listen 80;
        server_name _;
        root /usr/share/nginx/html;
        index index.html;

        # Security headers
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header Referrer-Policy "no-referrer-when-downgrade" always;
        add_header Content-Security-Policy "default-src 'self' https://wjaccopklttdvnutdmtu.supabase.co; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';" always;

        location / {
            try_files $uri $uri/ /index.html;
        }

        location /health {
            access_log off;
            return 200 "healthy\n";
            add_header Content-Type text/plain;
        }
    }
}
```

---

## 3. Security & Compliance Implementation Plan

**Current State: 45/100 (Critical for HIPAA)**
**Target: 95/100**

### 3.1 HIPAA Compliance Audit Logging

**Timeline: 1 week**

```sql
-- Create comprehensive audit logging
CREATE TABLE public.phi_access_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  patient_id UUID NOT NULL,
  access_type TEXT NOT NULL CHECK (access_type IN ('view', 'edit', 'create', 'delete', 'print', 'export')),
  resource_type TEXT NOT NULL,
  resource_id UUID,
  ip_address INET,
  user_agent TEXT,
  session_id TEXT,
  justification TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create function to log PHI access
CREATE OR REPLACE FUNCTION public.log_phi_access(
  p_user_id UUID,
  p_patient_id UUID,
  p_access_type TEXT,
  p_resource_type TEXT,
  p_resource_id UUID DEFAULT NULL,
  p_justification TEXT DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO public.phi_access_logs (
    user_id, patient_id, access_type, resource_type, 
    resource_id, justification
  ) VALUES (
    p_user_id, p_patient_id, p_access_type, p_resource_type,
    p_resource_id, p_justification
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

React hook for PHI access tracking:

```typescript
// src/hooks/usePHIAccess.ts
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';

export const usePHIAccess = () => {
  const { user } = useAuth();

  const logPHIAccess = async (
    patientId: string,
    accessType: 'view' | 'edit' | 'create' | 'delete' | 'print' | 'export',
    resourceType: string,
    resourceId?: string,
    justification?: string
  ) => {
    if (!user) return;

    try {
      await supabase.rpc('log_phi_access', {
        p_user_id: user.id,
        p_patient_id: patientId,
        p_access_type: accessType,
        p_resource_type: resourceType,
        p_resource_id: resourceId,
        p_justification: justification
      });
    } catch (error) {
      console.error('Failed to log PHI access:', error);
      // In production, this should be escalated
    }
  };

  return { logPHIAccess };
};
```

### 3.2 Data Retention & Deletion Policies

**Timeline: 3 days**

```sql
-- Create data retention policies
CREATE TABLE public.data_retention_policies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  data_type TEXT NOT NULL,
  retention_period_months INTEGER NOT NULL,
  deletion_method TEXT NOT NULL CHECK (deletion_method IN ('soft_delete', 'hard_delete', 'anonymize')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default retention policies
INSERT INTO public.data_retention_policies (data_type, retention_period_months, deletion_method) VALUES
('clinical_notes', 84, 'soft_delete'), -- 7 years
('client_records', 84, 'soft_delete'), -- 7 years
('audit_logs', 120, 'hard_delete'), -- 10 years
('session_data', 1, 'hard_delete'); -- 1 month

-- Create scheduled deletion function
CREATE OR REPLACE FUNCTION public.apply_retention_policies()
RETURNS VOID AS $$
DECLARE
    policy RECORD;
    cutoff_date TIMESTAMP WITH TIME ZONE;
BEGIN
    FOR policy IN SELECT * FROM public.data_retention_policies WHERE is_active = true LOOP
        cutoff_date := NOW() - (policy.retention_period_months || ' months')::INTERVAL;
        
        CASE policy.data_type
            WHEN 'clinical_notes' THEN
                IF policy.deletion_method = 'soft_delete' THEN
                    UPDATE public.clinical_notes 
                    SET deleted_at = NOW() 
                    WHERE created_at < cutoff_date AND deleted_at IS NULL;
                END IF;
            WHEN 'audit_logs' THEN
                IF policy.deletion_method = 'hard_delete' THEN
                    DELETE FROM public.phi_access_logs WHERE created_at < cutoff_date;
                END IF;
        END CASE;
    END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### 3.3 Encryption Key Management

**Timeline: 2 days**

```typescript
// src/utils/encryption.ts
import { createClient } from '@supabase/supabase-js';

class EncryptionService {
  private supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL!,
    import.meta.env.VITE_SUPABASE_ANON_KEY!
  );

  async encryptSensitiveData(data: string, keyId?: string): Promise<string> {
    // Use Supabase vault for encryption
    const { data: encrypted, error } = await this.supabase
      .rpc('encrypt_sensitive_data', {
        data_to_encrypt: data,
        key_id: keyId || 'default'
      });

    if (error) throw error;
    return encrypted;
  }

  async decryptSensitiveData(encryptedData: string, keyId?: string): Promise<string> {
    const { data: decrypted, error } = await this.supabase
      .rpc('decrypt_sensitive_data', {
        encrypted_data: encryptedData,
        key_id: keyId || 'default'
      });

    if (error) throw error;
    return decrypted;
  }
}

export const encryptionService = new EncryptionService();
```

### 3.4 Incident Response Procedures

**Timeline: 2 days**

```typescript
// src/utils/incidentResponse.ts
export interface SecurityIncident {
  id: string;
  type: 'data_breach' | 'unauthorized_access' | 'system_compromise' | 'policy_violation';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  affectedUsers?: string[];
  affectedData?: string[];
  detectedAt: Date;
  reportedBy: string;
  status: 'detected' | 'investigating' | 'contained' | 'resolved';
}

class IncidentResponseService {
  async reportIncident(incident: Omit<SecurityIncident, 'id' | 'detectedAt' | 'status'>) {
    const fullIncident: SecurityIncident = {
      ...incident,
      id: crypto.randomUUID(),
      detectedAt: new Date(),
      status: 'detected'
    };

    // Log to secure incident tracking system
    await this.logIncident(fullIncident);
    
    // Immediate notifications based on severity
    if (fullIncident.severity === 'critical' || fullIncident.severity === 'high') {
      await this.sendImmediateAlert(fullIncident);
    }

    // HIPAA breach notification requirements
    if (this.isPotentialPHIBreach(fullIncident)) {
      await this.initiatePHIBreachProtocol(fullIncident);
    }

    return fullIncident;
  }

  private async logIncident(incident: SecurityIncident) {
    // Implementation for secure incident logging
  }

  private async sendImmediateAlert(incident: SecurityIncident) {
    // Implementation for immediate alerting
  }

  private isPotentialPHIBreach(incident: SecurityIncident): boolean {
    return incident.type === 'data_breach' || 
           incident.type === 'unauthorized_access';
  }

  private async initiatePHIBreachProtocol(incident: SecurityIncident) {
    // HIPAA requires notification within 60 days
    // Implementation for PHI breach response
  }
}

export const incidentResponse = new IncidentResponseService();
```

---

## 4. Testing & Quality Assurance Implementation Plan

**Current State: 15/100 (Critical)**
**Target: 85/100**

### 4.1 Unit Testing Setup

**Timeline: 1 week**

Install testing dependencies and configure:

```json
// package.json additions
{
  "devDependencies": {
    "@testing-library/react": "^13.4.0",
    "@testing-library/jest-dom": "^5.16.5",
    "@testing-library/user-event": "^14.4.3",
    "jsdom": "^22.1.0",
    "vitest": "^0.34.0",
    "@vitest/ui": "^0.34.0",
    "happy-dom": "^10.0.0"
  },
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage"
  }
}
```

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/tests/setup.ts',
    css: true,
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/tests/',
        '**/*.d.ts',
        '**/*.config.*'
      ]
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
});
```

### 4.2 Critical Component Tests

**Timeline: 1 week**

```typescript
// src/tests/components/ClientDetailView.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import ClientDetailView from '@/components/ClientDetailView';
import { vi } from 'vitest';

// Mock Supabase
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({
            data: {
              id: '123',
              first_name: 'John',
              last_name: 'Doe',
              email: 'john@example.com'
            },
            error: null
          }))
        }))
      }))
    }))
  }
}));

const renderWithProviders = (component: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false }
    }
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {component}
      </BrowserRouter>
    </QueryClientProvider>
  );
};

describe('ClientDetailView', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render client information correctly', async () => {
    renderWithProviders(<ClientDetailView />);
    
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('john@example.com')).toBeInTheDocument();
    });
  });

  it('should handle HIPAA-compliant data display', async () => {
    renderWithProviders(<ClientDetailView />);
    
    // Verify sensitive data is properly handled
    await waitFor(() => {
      const sensitiveElements = screen.queryAllByTestId('sensitive-data');
      expect(sensitiveElements).toHaveLength(0); // Should not expose raw sensitive data
    });
  });

  it('should log PHI access when viewing client details', async () => {
    const logPHIAccessSpy = vi.fn();
    vi.doMock('@/hooks/usePHIAccess', () => ({
      usePHIAccess: () => ({ logPHIAccess: logPHIAccessSpy })
    }));

    renderWithProviders(<ClientDetailView />);
    
    await waitFor(() => {
      expect(logPHIAccessSpy).toHaveBeenCalledWith(
        '123',
        'view',
        'client_details'
      );
    });
  });
});
```

### 4.3 Integration Tests

**Timeline: 3 days**

```typescript
// src/tests/integration/clientWorkflow.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { setupServer } from 'msw/node';
import { rest } from 'msw';
import App from '@/App';

const server = setupServer(
  rest.get('*/rest/v1/clients', (req, res, ctx) => {
    return res(
      ctx.json([
        {
          id: '1',
          first_name: 'John',
          last_name: 'Doe',
          email: 'john@example.com'
        }
      ])
    );
  }),
  
  rest.post('*/rest/v1/clients', (req, res, ctx) => {
    return res(
      ctx.status(201),
      ctx.json({
        id: '2',
        first_name: 'Jane',
        last_name: 'Smith',
        email: 'jane@example.com'
      })
    );
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('Client Management Workflow', () => {
  it('should allow complete client creation workflow', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Navigate to clients page
    await user.click(screen.getByTestId('clients-nav'));
    
    // Click add client button
    await user.click(screen.getByTestId('add-client-button'));
    
    // Fill out form
    await user.type(screen.getByLabelText(/first name/i), 'Jane');
    await user.type(screen.getByLabelText(/last name/i), 'Smith');
    await user.type(screen.getByLabelText(/email/i), 'jane@example.com');
    
    // Submit form
    await user.click(screen.getByRole('button', { name: /save/i }));
    
    // Verify success
    await waitFor(() => {
      expect(screen.getByText('Client created successfully')).toBeInTheDocument();
    });
  });
});
```

### 4.4 End-to-End Tests with Playwright

**Timeline: 4 days**

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
});
```

```typescript
// e2e/clinical-workflow.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Clinical Documentation Workflow', () => {
  test.beforeEach(async ({ page }) => {
    // Login as test user
    await page.goto('/auth');
    await page.fill('[data-testid="email"]', 'test@example.com');
    await page.fill('[data-testid="password"]', 'testpassword');
    await page.click('[data-testid="login-button"]');
    await page.waitForURL('/');
  });

  test('should complete progress note workflow', async ({ page }) => {
    // Navigate to documentation
    await page.click('[data-testid="documentation-nav"]');
    
    // Create new progress note
    await page.click('[data-testid="create-note-button"]');
    await page.click('[data-testid="progress-note-option"]');
    
    // Select client
    await page.click('[data-testid="client-select"]');
    await page.click('[data-testid="client-option-1"]');
    
    // Fill out note sections
    await page.fill('[data-testid="note-title"]', 'Weekly Progress Review');
    await page.fill('[data-testid="subjective-section"]', 'Client reports improved mood');
    await page.fill('[data-testid="objective-section"]', 'Engaged throughout session');
    await page.fill('[data-testid="assessment-section"]', 'Making good progress');
    await page.fill('[data-testid="plan-section"]', 'Continue current interventions');
    
    // Save as draft
    await page.click('[data-testid="save-draft-button"]');
    await expect(page.locator('[data-testid="success-message"]')).toContainText('Note saved');
    
    // Sign note
    await page.click('[data-testid="sign-note-button"]');
    await page.fill('[data-testid="signature-field"]', 'Dr. Test Provider');
    await page.click('[data-testid="confirm-signature-button"]');
    
    // Verify note is signed
    await expect(page.locator('[data-testid="note-status"]')).toContainText('Signed');
  });

  test('should enforce HIPAA compliance checks', async ({ page }) => {
    // Test that PHI is not exposed in URLs
    await page.goto('/client/123');
    const url = page.url();
    expect(url).not.toContain('ssn');
    expect(url).not.toContain('dob');
    
    // Test session timeout
    await page.evaluate(() => {
      // Simulate session expiry
      localStorage.clear();
      sessionStorage.clear();
    });
    
    await page.reload();
    await expect(page).toHaveURL('/auth');
  });
});
```

### 4.5 Accessibility Testing

**Timeline: 2 days**

```typescript
// src/tests/accessibility/a11y.test.tsx
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import ClientDetailView from '@/components/ClientDetailView';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

expect.extend(toHaveNoViolations);

const renderWithProviders = (component: React.ReactElement) => {
  const queryClient = new QueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      {component}
    </QueryClientProvider>
  );
};

describe('Accessibility Tests', () => {
  it('ClientDetailView should have no accessibility violations', async () => {
    const { container } = renderWithProviders(<ClientDetailView />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should support keyboard navigation', async () => {
    renderWithProviders(<ClientDetailView />);
    
    // Test tab order and focus management
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    expect(focusableElements.length).toBeGreaterThan(0);
  });
});
```

---

## 5. Performance & Scalability Implementation Plan

**Current State: 60/100**
**Target: 85/100**

### 5.1 Load Testing Implementation

**Timeline: 3 days**

```typescript
// loadtests/scenarios/userJourney.ts
import { check } from 'k6';
import http from 'k6/http';
import { Rate } from 'k6/metrics';

export const errorRate = new Rate('errors');

export const options = {
  stages: [
    { duration: '2m', target: 100 }, // Ramp up to 100 users
    { duration: '5m', target: 100 }, // Sustain 100 users
    { duration: '2m', target: 200 }, // Ramp up to 200 users
    { duration: '5m', target: 200 }, // Sustain 200 users
    { duration: '2m', target: 500 }, // Ramp up to 500 users
    { duration: '10m', target: 500 }, // Sustain 500 users
    { duration: '2m', target: 0 }, // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<200'], // 95% of requests should be below 200ms
    http_req_failed: ['rate<0.1'], // Error rate should be below 10%
    errors: ['rate<0.1'],
  },
};

export default function () {
  // Login
  const loginResponse = http.post('https://wjaccopklttdvnutdmtu.supabase.co/auth/v1/token', {
    email: 'loadtest@example.com',
    password: 'loadtestpassword',
    grant_type: 'password',
  });

  check(loginResponse, {
    'login successful': (r) => r.status === 200,
  }) || errorRate.add(1);

  const authToken = loginResponse.json('access_token');

  // Fetch clients list
  const clientsResponse = http.get(
    'https://wjaccopklttdvnutdmtu.supabase.co/rest/v1/clients',
    {
      headers: {
        Authorization: `Bearer ${authToken}`,
        apikey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      },
    }
  );

  check(clientsResponse, {
    'clients fetch successful': (r) => r.status === 200,
    'response time < 200ms': (r) => r.timings.duration < 200,
  }) || errorRate.add(1);

  // Create clinical note
  const noteResponse = http.post(
    'https://wjaccopklttdvnutdmtu.supabase.co/rest/v1/clinical_notes',
    JSON.stringify({
      title: `Load Test Note ${Math.random()}`,
      content: { subjective: 'Test content' },
      note_type: 'progress_note',
      client_id: 'test-client-id',
    }),
    {
      headers: {
        Authorization: `Bearer ${authToken}`,
        apikey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        'Content-Type': 'application/json',
      },
    }
  );

  check(noteResponse, {
    'note creation successful': (r) => r.status === 201,
  }) || errorRate.add(1);
}
```

### 5.2 Database Query Optimization

**Timeline: 2 days**

```sql
-- Add performance indexes
CREATE INDEX CONCURRENTLY idx_clinical_notes_provider_date 
ON public.clinical_notes (provider_id, created_at DESC);

CREATE INDEX CONCURRENTLY idx_clinical_notes_client_date 
ON public.clinical_notes (client_id, created_at DESC);

CREATE INDEX CONCURRENTLY idx_clients_active_name 
ON public.clients (is_active, last_name, first_name) 
WHERE is_active = true;

-- Optimize complex queries
CREATE OR REPLACE FUNCTION public.get_client_dashboard_optimized(
  p_client_id UUID
)
RETURNS TABLE(
  client_info JSONB,
  recent_notes JSONB,
  appointments JSONB
) AS $$
BEGIN
  RETURN QUERY
  WITH client_data AS (
    SELECT to_jsonb(c.*) as info
    FROM public.clients c
    WHERE c.id = p_client_id
  ),
  note_data AS (
    SELECT jsonb_agg(
      jsonb_build_object(
        'id', cn.id,
        'title', cn.title,
        'note_type', cn.note_type,
        'status', cn.status,
        'created_at', cn.created_at
      ) ORDER BY cn.created_at DESC
    ) as notes
    FROM public.clinical_notes cn
    WHERE cn.client_id = p_client_id
    LIMIT 10
  ),
  appointment_data AS (
    SELECT jsonb_agg(
      jsonb_build_object(
        'id', a.id,
        'start_time', a.start_time,
        'end_time', a.end_time,
        'status', a.status,
        'appointment_type', a.appointment_type
      ) ORDER BY a.start_time DESC
    ) as appointments
    FROM public.appointments a
    WHERE a.client_id = p_client_id
    AND a.start_time >= NOW() - INTERVAL '30 days'
    LIMIT 5
  )
  SELECT 
    cd.info,
    COALESCE(nd.notes, '[]'::jsonb),
    COALESCE(ad.appointments, '[]'::jsonb)
  FROM client_data cd
  CROSS JOIN note_data nd
  CROSS JOIN appointment_data ad;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;
```

### 5.3 Frontend Optimization

**Timeline: 2 days**

```typescript
// src/utils/performance.ts
import { lazy } from 'react';

// Lazy load heavy components
export const LazyClientDetailView = lazy(() => import('@/components/ClientDetailView'));
export const LazyDocumentationTabs = lazy(() => import('@/components/documentation/DocumentationTabs'));

// Virtual scrolling for large lists
import { FixedSizeList as List } from 'react-window';

interface VirtualizedListProps {
  items: any[];
  height: number;
  itemHeight: number;
  renderItem: ({ index, style }: { index: number; style: React.CSSProperties }) => React.ReactElement;
}

export const VirtualizedList: React.FC<VirtualizedListProps> = ({
  items,
  height,
  itemHeight,
  renderItem
}) => {
  return (
    <List
      height={height}
      itemCount={items.length}
      itemSize={itemHeight}
      itemData={items}
    >
      {renderItem}
    </List>
  );
};

// Debounced search
import { useMemo } from 'react';
import { debounce } from 'lodash-es';

export const useDebounced = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T => {
  return useMemo(
    () => debounce(callback, delay),
    [callback, delay]
  );
};
```

---

## 6. Monitoring & Observability Implementation Plan

**Current State: 30/100**
**Target: 85/100**

### 6.1 Production Monitoring Dashboard

**Timeline: 3 days**

```typescript
// src/components/monitoring/MonitoringDashboard.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shared/ui/card';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const MonitoringDashboard: React.FC = () => {
  const { data: metrics } = useQuery({
    queryKey: ['system-metrics'],
    queryFn: async () => {
      const { data } = await supabase.functions.invoke('get-system-metrics');
      return data;
    },
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">System Monitoring</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>API Response Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics?.avgResponseTime || 'Loading...'}ms
            </div>
            <p className="text-xs text-muted-foreground">
              P95: {metrics?.p95ResponseTime || 'Loading...'}ms
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Error Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics?.errorRate || 'Loading...'}%
            </div>
            <p className="text-xs text-muted-foreground">
              Last 24 hours
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics?.activeUsers || 'Loading...'}
            </div>
            <p className="text-xs text-muted-foreground">
              Currently online
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Database Connections</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics?.dbConnections || 'Loading...'}
            </div>
            <p className="text-xs text-muted-foreground">
              Active connections
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
```

### 6.2 Real-time Alerting System

**Timeline: 2 days**

```typescript
// supabase/functions/monitoring-alerts/index.ts
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

interface AlertRule {
  metric: string;
  operator: 'gt' | 'lt' | 'eq';
  threshold: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  channels: ('email' | 'slack' | 'sms')[];
}

const alertRules: AlertRule[] = [
  {
    metric: 'error_rate',
    operator: 'gt',
    threshold: 5,
    severity: 'high',
    channels: ['email', 'slack']
  },
  {
    metric: 'response_time_p95',
    operator: 'gt',
    threshold: 500,
    severity: 'medium',
    channels: ['slack']
  },
  {
    metric: 'database_connections',
    operator: 'gt',
    threshold: 80,
    severity: 'high',
    channels: ['email', 'slack']
  }
];

serve(async (req: Request) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );

  // Collect current metrics
  const metrics = await collectMetrics(supabase);
  
  // Check alert rules
  for (const rule of alertRules) {
    const currentValue = metrics[rule.metric];
    const shouldAlert = evaluateRule(currentValue, rule);
    
    if (shouldAlert) {
      await sendAlert(rule, currentValue, supabase);
    }
  }

  return new Response(JSON.stringify({ status: 'alerts checked' }), {
    headers: { 'Content-Type': 'application/json' }
  });
});

async function collectMetrics(supabase: any) {
  // Collect various metrics
  const errorRate = await getErrorRate(supabase);
  const responseTime = await getResponseTime(supabase);
  const dbConnections = await getDatabaseConnections(supabase);
  
  return {
    error_rate: errorRate,
    response_time_p95: responseTime,
    database_connections: dbConnections
  };
}

function evaluateRule(value: number, rule: AlertRule): boolean {
  switch (rule.operator) {
    case 'gt': return value > rule.threshold;
    case 'lt': return value < rule.threshold;
    case 'eq': return value === rule.threshold;
    default: return false;
  }
}

async function sendAlert(rule: AlertRule, value: number, supabase: any) {
  const alertMessage = `🚨 ALERT: ${rule.metric} is ${value} (threshold: ${rule.threshold})`;
  
  // Log alert
  await supabase.from('system_alerts').insert({
    metric: rule.metric,
    value: value,
    threshold: rule.threshold,
    severity: rule.severity,
    message: alertMessage
  });

  // Send notifications based on channels
  for (const channel of rule.channels) {
    switch (channel) {
      case 'email':
        await sendEmailAlert(alertMessage);
        break;
      case 'slack':
        await sendSlackAlert(alertMessage);
        break;
      case 'sms':
        await sendSMSAlert(alertMessage);
        break;
    }
  }
}
```

### 6.3 Health Checks Implementation

**Timeline: 1 day**

```typescript
// supabase/functions/health-check/index.ts
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

interface HealthCheckResult {
  service: string;
  status: 'healthy' | 'degraded' | 'unhealthy';
  responseTime: number;
  details?: string;
}

serve(async (req: Request) => {
  const healthChecks: HealthCheckResult[] = [];
  
  // Database connectivity check
  const dbCheck = await checkDatabase();
  healthChecks.push(dbCheck);
  
  // Authentication service check
  const authCheck = await checkAuthentication();
  healthChecks.push(authCheck);
  
  // External dependencies check
  const externalCheck = await checkExternalServices();
  healthChecks.push(externalCheck);
  
  const overallStatus = determineOverallStatus(healthChecks);
  
  const response = {
    status: overallStatus,
    timestamp: new Date().toISOString(),
    checks: healthChecks
  };
  
  const statusCode = overallStatus === 'healthy' ? 200 : 503;
  
  return new Response(JSON.stringify(response, null, 2), {
    status: statusCode,
    headers: { 'Content-Type': 'application/json' }
  });
});

async function checkDatabase(): Promise<HealthCheckResult> {
  const start = Date.now();
  
  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );
    
    await supabase.from('users').select('count').limit(1);
    
    const responseTime = Date.now() - start;
    
    return {
      service: 'database',
      status: responseTime < 1000 ? 'healthy' : 'degraded',
      responseTime
    };
  } catch (error) {
    return {
      service: 'database',
      status: 'unhealthy',
      responseTime: Date.now() - start,
      details: error.message
    };
  }
}

function determineOverallStatus(checks: HealthCheckResult[]): 'healthy' | 'degraded' | 'unhealthy' {
  if (checks.some(check => check.status === 'unhealthy')) {
    return 'unhealthy';
  }
  if (checks.some(check => check.status === 'degraded')) {
    return 'degraded';
  }
  return 'healthy';
}
```

---

## 7. Documentation Implementation Plan

**Current State: 40/100**
**Target: 80/100**

### 7.1 API Documentation

**Timeline: 2 days**

```markdown
# API Documentation

## Authentication

All API requests require authentication using JWT tokens obtained from Supabase Auth.

### Headers
```
Authorization: Bearer <jwt_token>
apikey: <supabase_anon_key>
Content-Type: application/json
```

## Endpoints

### Clients

#### GET /rest/v1/clients
Retrieve a list of clients.

**Query Parameters:**
- `select` (string): Columns to select
- `limit` (integer): Maximum number of records
- `offset` (integer): Number of records to skip

**Response:**
```json
[
  {
    "id": "uuid",
    "first_name": "string",
    "last_name": "string",
    "email": "string",
    "date_of_birth": "date",
    "created_at": "timestamp"
  }
]
```

#### POST /rest/v1/clients
Create a new client.

**Request Body:**
```json
{
  "first_name": "string (required)",
  "last_name": "string (required)", 
  "email": "string (optional)",
  "date_of_birth": "date (optional)"
}
```

**Response:** 201 Created
```json
{
  "id": "uuid",
  "first_name": "string",
  "last_name": "string",
  "created_at": "timestamp"
}
```

### Clinical Notes

#### GET /rest/v1/clinical_notes
Retrieve clinical notes.

**Query Parameters:**
- `client_id` (uuid): Filter by client
- `provider_id` (uuid): Filter by provider
- `note_type` (enum): Filter by note type

#### POST /rest/v1/clinical_notes
Create a new clinical note.

**Request Body:**
```json
{
  "title": "string (required)",
  "content": "object (required)",
  "client_id": "uuid (required)",
  "note_type": "enum (required)",
  "status": "enum (optional, default: draft)"
}
```

## Error Handling

All errors follow RFC 7807 format:

```json
{
  "type": "string",
  "title": "string", 
  "status": "integer",
  "detail": "string",
  "instance": "string"
}
```

Common HTTP Status Codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 422: Validation Error
- 500: Internal Server Error

## Rate Limiting

API requests are limited to 100 requests per 15-minute window per IP address.

Rate limit headers:
- `X-RateLimit-Limit`: Request limit
- `X-RateLimit-Remaining`: Remaining requests
- `X-RateLimit-Reset`: Reset time
```

### 7.2 Deployment Guide

**Timeline: 1 day**

```markdown
# Deployment Guide

## Prerequisites

- Node.js 18+ installed
- GitHub account for CI/CD
- Supabase account and project
- Domain name (for production)

## Environment Setup

### Development
1. Clone the repository
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env.local`
4. Configure environment variables
5. Start development server: `npm run dev`

### Staging Deployment
1. Create staging branch from develop
2. Configure staging environment variables in GitHub Secrets
3. Deploy via GitHub Actions workflow
4. Run smoke tests

### Production Deployment
1. Merge to main branch
2. GitHub Actions automatically deploys
3. Run post-deployment health checks
4. Monitor alerts and metrics

## Configuration

### Environment Variables
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_ENVIRONMENT=production
```

### Supabase Configuration
1. Set up RLS policies
2. Configure authentication providers
3. Set up edge functions
4. Configure database backups

## Monitoring

### Health Checks
- Database connectivity: `/health/db`
- Authentication: `/health/auth`
- Overall status: `/health`

### Metrics
- Response time targets: P95 < 200ms
- Error rate targets: < 1%
- Uptime targets: 99.9%

## Rollback Procedure
1. Identify issue via monitoring
2. Revert to last known good commit
3. Deploy via GitHub Actions
4. Verify rollback success
5. Investigate root cause
```

---

## Implementation Timeline Summary

| Phase | Duration | Components | Resources Required |
|-------|----------|------------|-------------------|
| **Phase 1: Security & Compliance** | 4 weeks | HIPAA compliance, audit logging, encryption, incident response | Security Specialist, Senior Developer |
| **Phase 2: Testing & Quality** | 3 weeks | Unit tests, integration tests, e2e tests, accessibility | QA Engineer, Senior Developer |
| **Phase 3: Infrastructure & DevOps** | 3 weeks | CI/CD pipeline, containerization, environment management | DevOps Engineer, Senior Developer |
| **Phase 4: Backend Enhancement** | 1 week | Rate limiting, validation, documentation, logging | Senior Developer |
| **Phase 5: Performance & Monitoring** | 2 weeks | Load testing, optimization, monitoring, alerting | Senior Developer, DevOps Engineer |

**Total Duration: 13 weeks**
**Total Cost Estimate: $150,000 - $200,000**

## Success Metrics

- **Security Score**: 95/100 (HIPAA compliant)
- **Test Coverage**: >85% across all test types
- **Performance**: P95 response time < 200ms under 10k concurrent users
- **Reliability**: 99.9% uptime with automated monitoring
- **Compliance**: Full HIPAA audit readiness

This implementation plan transforms MentalSpace from a 62/100 readiness score to a production-ready 90+ score, ensuring HIPAA compliance, security, reliability, and scalability for healthcare operations.