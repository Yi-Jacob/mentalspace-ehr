import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

interface SecurityEvent {
  type: 'failed_login' | 'brute_force' | 'suspicious_activity' | 'data_breach' | 'privilege_escalation';
  severity: 'low' | 'medium' | 'high' | 'critical';
  user_id?: string;
  ip_address?: string;
  details: Record<string, any>;
}

interface SecurityAlert {
  id: string;
  alert_type: string;
  severity: string;
  message: string;
  details: any;
  resolved: boolean;
  created_at: string;
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
    const url = new URL(req.url);
    const action = url.searchParams.get('action') || 'monitor';

    switch (action) {
      case 'monitor':
        return await monitorSecurityEvents(supabase);
      case 'analyze':
        return await analyzeSecurityThreats(req, supabase);
      case 'alert':
        return await createSecurityAlert(req, supabase);
      case 'status':
        return await getSecurityStatus(supabase);
      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }
  } catch (error) {
    console.error('Security monitor error:', error);
    return new Response(
      JSON.stringify({ error: 'Security monitoring failed', details: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

async function monitorSecurityEvents(supabase: any) {
  const now = new Date();
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

  // Check for recent security events
  const { data: recentEvents, error } = await supabase
    .from('security_audit_logs')
    .select('*')
    .gte('created_at', oneHourAgo.toISOString())
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch security events: ${error.message}`);
  }

  // Analyze events for threats
  const threats = await detectThreats(recentEvents || [], supabase);
  
  // Generate security score
  const securityScore = calculateSecurityScore(recentEvents || [], threats);

  return new Response(
    JSON.stringify({
      status: 'monitoring',
      period: {
        start: oneHourAgo.toISOString(),
        end: now.toISOString()
      },
      events: recentEvents?.length || 0,
      threats: threats.length,
      securityScore,
      threats: threats.slice(0, 10), // Return top 10 threats
      timestamp: now.toISOString()
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function analyzeSecurityThreats(req: Request, supabase: any) {
  const { events }: { events: any[] } = await req.json();
  
  const threats = await detectThreats(events, supabase);
  const recommendations = generateSecurityRecommendations(threats);

  return new Response(
    JSON.stringify({
      threats,
      recommendations,
      riskLevel: calculateRiskLevel(threats),
      analysis: {
        totalEvents: events.length,
        threatsDetected: threats.length,
        criticalThreats: threats.filter(t => t.severity === 'critical').length,
        highThreats: threats.filter(t => t.severity === 'high').length
      }
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function createSecurityAlert(req: Request, supabase: any) {
  const { event }: { event: SecurityEvent } = await req.json();
  
  // Create alert in database (would need to create this table)
  const alert = {
    alert_type: event.type,
    severity: event.severity,
    message: generateAlertMessage(event),
    details: event.details,
    resolved: false,
    created_at: new Date().toISOString()
  };

  // Log the security event
  await supabase.rpc('log_security_event', {
    p_action: 'security_alert_created',
    p_resource_type: 'security',
    p_details: alert,
    p_severity: event.severity === 'critical' ? 'critical' : 'warning'
  });

  // In production, this would also trigger notifications (email, Slack, etc.)
  console.log(`SECURITY ALERT [${event.severity.toUpperCase()}]: ${alert.message}`);

  return new Response(
    JSON.stringify({
      success: true,
      alert,
      message: 'Security alert created and logged'
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function getSecurityStatus(supabase: any) {
  const now = new Date();
  const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  // Get security metrics for last 24 hours
  const { data: events } = await supabase
    .from('security_audit_logs')
    .select('severity, status, action')
    .gte('created_at', last24Hours.toISOString());

  const { data: hipaaAccess } = await supabase
    .from('hipaa_access_logs')
    .select('authorized, access_type')
    .gte('created_at', last24Hours.toISOString());

  const metrics = {
    totalSecurityEvents: events?.length || 0,
    criticalEvents: events?.filter(e => e.severity === 'critical').length || 0,
    failedEvents: events?.filter(e => e.status === 'failure').length || 0,
    hipaaAccesses: hipaaAccess?.length || 0,
    unauthorizedAccesses: hipaaAccess?.filter(a => !a.authorized).length || 0
  };

  const healthScore = calculateHealthScore(metrics);

  return new Response(
    JSON.stringify({
      status: healthScore > 80 ? 'healthy' : healthScore > 60 ? 'warning' : 'critical',
      healthScore,
      metrics,
      lastChecked: now.toISOString()
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function detectThreats(events: any[], supabase: any): Promise<SecurityEvent[]> {
  const threats: SecurityEvent[] = [];

  // Group events by user and IP
  const userEvents = groupBy(events, 'user_id');
  const ipEvents = groupBy(events, 'ip_address');

  // Detect brute force attacks
  for (const [userId, userEventList] of Object.entries(userEvents)) {
    const failedLogins = (userEventList as any[]).filter(e => 
      e.action === 'login_failed' || e.status === 'failure'
    );
    
    if (failedLogins.length > 5) {
      threats.push({
        type: 'brute_force',
        severity: 'high',
        user_id: userId,
        details: {
          failedAttempts: failedLogins.length,
          timeRange: '1 hour',
          actions: failedLogins.map(e => e.action)
        }
      });
    }
  }

  // Detect suspicious IP activity
  for (const [ip, ipEventList] of Object.entries(ipEvents)) {
    if ((ipEventList as any[]).length > 20) {
      threats.push({
        type: 'suspicious_activity',
        severity: 'medium',
        ip_address: ip,
        details: {
          eventCount: (ipEventList as any[]).length,
          timeRange: '1 hour',
          uniqueUsers: new Set((ipEventList as any[]).map(e => e.user_id)).size
        }
      });
    }
  }

  // Detect privilege escalation attempts
  const privilegeEvents = events.filter(e => 
    e.action.includes('role_change') || 
    e.action.includes('permission_grant') ||
    e.resource_type === 'permissions'
  );

  if (privilegeEvents.length > 0) {
    threats.push({
      type: 'privilege_escalation',
      severity: 'high',
      details: {
        events: privilegeEvents.length,
        actions: privilegeEvents.map(e => e.action)
      }
    });
  }

  return threats;
}

function generateAlertMessage(event: SecurityEvent): string {
  switch (event.type) {
    case 'brute_force':
      return `Brute force attack detected from ${event.ip_address || 'unknown IP'} with ${event.details.failedAttempts} failed attempts`;
    case 'suspicious_activity':
      return `Suspicious activity detected: ${event.details.eventCount} events in ${event.details.timeRange}`;
    case 'privilege_escalation':
      return `Privilege escalation attempt detected: ${event.details.events} permission changes`;
    case 'data_breach':
      return `Potential data breach detected: unauthorized access to sensitive data`;
    case 'failed_login':
      return `Multiple failed login attempts detected for user ${event.user_id}`;
    default:
      return `Security event detected: ${event.type}`;
  }
}

function generateSecurityRecommendations(threats: SecurityEvent[]): string[] {
  const recommendations = [];

  if (threats.some(t => t.type === 'brute_force')) {
    recommendations.push('Implement account lockout policies after failed login attempts');
    recommendations.push('Enable multi-factor authentication for all users');
  }

  if (threats.some(t => t.type === 'suspicious_activity')) {
    recommendations.push('Review and tighten rate limiting policies');
    recommendations.push('Implement IP-based access controls');
  }

  if (threats.some(t => t.type === 'privilege_escalation')) {
    recommendations.push('Review and audit all role assignments');
    recommendations.push('Implement approval workflows for privilege changes');
  }

  if (threats.length === 0) {
    recommendations.push('No immediate security concerns detected');
    recommendations.push('Continue regular security monitoring');
  }

  return recommendations;
}

function calculateSecurityScore(events: any[], threats: SecurityEvent[]): number {
  let score = 100;
  
  // Deduct points for threats
  score -= threats.filter(t => t.severity === 'critical').length * 20;
  score -= threats.filter(t => t.severity === 'high').length * 10;
  score -= threats.filter(t => t.severity === 'medium').length * 5;
  score -= threats.filter(t => t.severity === 'low').length * 2;

  // Deduct points for failed events
  const failedEvents = events.filter(e => e.status === 'failure');
  score -= Math.min(failedEvents.length * 2, 30);

  return Math.max(0, score);
}

function calculateRiskLevel(threats: SecurityEvent[]): string {
  if (threats.some(t => t.severity === 'critical')) return 'critical';
  if (threats.some(t => t.severity === 'high')) return 'high';
  if (threats.some(t => t.severity === 'medium')) return 'medium';
  return 'low';
}

function calculateHealthScore(metrics: any): number {
  let score = 100;
  
  if (metrics.criticalEvents > 0) score -= 30;
  if (metrics.failedEvents > 10) score -= 20;
  if (metrics.unauthorizedAccesses > 0) score -= 25;
  if (metrics.totalSecurityEvents > 100) score -= 15;

  return Math.max(0, score);
}

function groupBy(array: any[], key: string): Record<string, any[]> {
  return array.reduce((groups, item) => {
    const group = item[key] || 'unknown';
    groups[group] = groups[group] || [];
    groups[group].push(item);
    return groups;
  }, {});
}