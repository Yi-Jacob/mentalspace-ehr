import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { securityService } from '@/services/securityService';
import { complianceService } from '@/services/complianceService';
import { supabase } from '@/integrations/supabase/client';
import { 
  Shield, 
  Eye, 
  Lock, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  FileCheck,
  Users,
  Database,
  Activity
} from 'lucide-react';

interface ComplianceMetrics {
  hipaaCompliance: number;
  dataRetention: number;
  accessControls: number;
  auditTrails: number;
  overall: number;
}

export const SecurityComplianceTestComponent: React.FC = () => {
  const [metrics, setMetrics] = useState<ComplianceMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [testResults, setTestResults] = useState<Record<string, any>>({});
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [hipaaLogs, setHipaaLogs] = useState<any[]>([]);

  useEffect(() => {
    loadComplianceData();
  }, []);

  const loadComplianceData = async () => {
    setIsLoading(true);
    try {
      // Load compliance metrics
      const complianceMetrics = await complianceService.calculateComplianceMetrics();
      setMetrics(complianceMetrics);

      // Load recent audit logs
      const { data: securityLogs } = await supabase
        .from('security_audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      const { data: hipaaAccessLogs } = await supabase
        .from('hipaa_access_logs')
        .select(`
          *,
          users!inner(first_name, last_name),
          clients!inner(first_name, last_name)
        `)
        .order('created_at', { ascending: false })
        .limit(10);

      setAuditLogs(securityLogs || []);
      setHipaaLogs(hipaaAccessLogs || []);

    } catch (error) {
      console.error('Failed to load compliance data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const testSecurityService = async () => {
    const results: Record<string, any> = {};

    try {
      // Test security logging
      await securityService.logSecurityEvent({
        action: 'test_security_log',
        resource_type: 'test',
        details: { message: 'Security service test' }
      });
      results.securityLogging = { status: 'success', logged: true };
    } catch (error) {
      results.securityLogging = { status: 'error', error: error.message };
    }

    try {
      // Test HIPAA logging
      const testPatientId = 'test-patient-' + Date.now();
      await securityService.logHIPAAAccess({
        patient_id: testPatientId,
        access_type: 'view',
        purpose: 'Security system test'
      });
      results.hipaaLogging = { status: 'success', logged: true };
    } catch (error) {
      results.hipaaLogging = { status: 'error', error: error.message };
    }

    try {
      // Test permission checking
      const hasPermission = await securityService.hasPermission('patient_records', 'read');
      results.permissionCheck = { status: 'success', hasPermission };
    } catch (error) {
      results.permissionCheck = { status: 'error', error: error.message };
    }

    try {
      // Test data anonymization
      const testData = {
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@example.com',
        phone_number: '555-123-4567'
      };
      const anonymized = securityService.anonymizeData(testData, 'clients');
      results.dataAnonymization = { 
        status: 'success', 
        original: testData,
        anonymized 
      };
    } catch (error) {
      results.dataAnonymization = { status: 'error', error: error.message };
    }

    try {
      // Test rate limiting
      const rateLimitOk = await securityService.checkRateLimit('test_action', 5);
      results.rateLimiting = { status: 'success', allowed: rateLimitOk };
    } catch (error) {
      results.rateLimiting = { status: 'error', error: error.message };
    }

    setTestResults(results);
  };

  const generateComplianceReport = async () => {
    setIsLoading(true);
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);

      const report = await complianceService.generateHIPAAReport(startDate, endDate);
      
      setTestResults(prev => ({
        ...prev,
        complianceReport: {
          status: 'success',
          reportId: report.id,
          generated: new Date(report.created_at).toLocaleString()
        }
      }));
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        complianceReport: { status: 'error', error: error.message }
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 90) return <Badge className="bg-green-100 text-green-800">Excellent</Badge>;
    if (score >= 75) return <Badge className="bg-yellow-100 text-yellow-800">Good</Badge>;
    if (score >= 60) return <Badge className="bg-orange-100 text-orange-800">Fair</Badge>;
    return <Badge className="bg-red-100 text-red-800">Poor</Badge>;
  };

  return (
    <div className="space-y-6 p-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Security & Compliance Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor HIPAA compliance, security controls, and audit trails
        </p>
      </div>

      {/* Compliance Metrics Overview */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overall Score</CardTitle>
              <Shield className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getScoreColor(metrics.overall)}`}>
                {metrics.overall}%
              </div>
              {getScoreBadge(metrics.overall)}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">HIPAA Compliance</CardTitle>
              <FileCheck className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getScoreColor(metrics.hipaaCompliance)}`}>
                {metrics.hipaaCompliance}%
              </div>
              <Progress value={metrics.hipaaCompliance} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Access Controls</CardTitle>
              <Lock className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getScoreColor(metrics.accessControls)}`}>
                {metrics.accessControls}%
              </div>
              <Progress value={metrics.accessControls} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Data Retention</CardTitle>
              <Database className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getScoreColor(metrics.dataRetention)}`}>
                {metrics.dataRetention}%
              </div>
              <Progress value={metrics.dataRetention} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Audit Trails</CardTitle>
              <Activity className="h-4 w-4 text-indigo-600" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getScoreColor(metrics.auditTrails)}`}>
                {metrics.auditTrails}%
              </div>
              <Progress value={metrics.auditTrails} className="mt-2" />
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="testing" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="testing">Security Testing</TabsTrigger>
          <TabsTrigger value="audit">Audit Logs</TabsTrigger>
          <TabsTrigger value="hipaa">HIPAA Logs</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
        </TabsList>

        <TabsContent value="testing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Service Tests</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button onClick={testSecurityService} disabled={isLoading} className="w-full">
                  Run Security Tests
                </Button>
                <Button onClick={generateComplianceReport} disabled={isLoading} className="w-full">
                  Generate HIPAA Report
                </Button>
                <Button onClick={loadComplianceData} disabled={isLoading} className="w-full">
                  Refresh Data
                </Button>
              </div>

              {Object.keys(testResults).length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  {Object.entries(testResults).map(([test, result]) => (
                    <div key={test} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold capitalize">
                          {test.replace(/([A-Z])/g, ' $1')}
                        </h4>
                        {result.status === 'success' ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-600" />
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Status: {result.status}
                        {result.error && (
                          <div className="text-red-600 mt-1">Error: {result.error}</div>
                        )}
                        {result.logged && (
                          <div className="text-green-600 mt-1">✓ Successfully logged</div>
                        )}
                        {result.hasPermission !== undefined && (
                          <div className="mt-1">Permission: {result.hasPermission ? 'Granted' : 'Denied'}</div>
                        )}
                        {result.anonymized && (
                          <div className="mt-1">
                            <div>Original: {JSON.stringify(result.original)}</div>
                            <div>Anonymized: {JSON.stringify(result.anonymized)}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Security Audit Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                {auditLogs.length > 0 ? (
                  <div className="space-y-2">
                    {auditLogs.map((log) => (
                      <div key={log.id} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium">{log.action}</span>
                          <Badge variant={log.severity === 'critical' ? 'destructive' : 
                                        log.severity === 'warning' ? 'secondary' : 'default'}>
                            {log.severity}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <div>Resource: {log.resource_type}</div>
                          <div>Status: {log.status}</div>
                          <div>Time: {new Date(log.created_at).toLocaleString()}</div>
                          {log.details && Object.keys(log.details).length > 0 && (
                            <div>Details: {JSON.stringify(log.details, null, 2)}</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No audit logs found. Run security tests to generate logs.
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hipaa" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent HIPAA Access Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                {hipaaLogs.length > 0 ? (
                  <div className="space-y-2">
                    {hipaaLogs.map((log) => (
                      <div key={log.id} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium">{log.access_type.toUpperCase()}</span>
                          <Badge variant={log.authorized ? 'default' : 'destructive'}>
                            {log.authorized ? 'Authorized' : 'Unauthorized'}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <div>User: {log.users?.first_name} {log.users?.last_name}</div>
                          <div>Patient: {log.clients?.first_name} {log.clients?.last_name}</div>
                          <div>Purpose: {log.purpose || 'Not specified'}</div>
                          <div>Time: {new Date(log.created_at).toLocaleString()}</div>
                          {log.data_accessed && (
                            <div>Data: {log.data_accessed}</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No HIPAA access logs found. Run HIPAA tests to generate logs.
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Implementation Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span>✅ Security audit logging system</span>
                  <Badge variant="default">Implemented</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>✅ HIPAA access tracking</span>
                  <Badge variant="default">Implemented</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>✅ Role-based access controls (RBAC)</span>
                  <Badge variant="default">Enhanced</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>✅ Data classification & anonymization</span>
                  <Badge variant="default">Implemented</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>✅ Compliance reporting system</span>
                  <Badge variant="default">Implemented</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>✅ Security headers & CSP</span>
                  <Badge variant="default">Configured</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>✅ Session security validation</span>
                  <Badge variant="default">Implemented</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>✅ Rate limiting protection</span>
                  <Badge variant="default">Active</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {testResults.complianceReport && (
            <Alert>
              <FileCheck className="h-4 w-4" />
              <AlertDescription>
                HIPAA compliance report generated successfully. 
                Report ID: {testResults.complianceReport.reportId}
                <br />
                Generated: {testResults.complianceReport.generated}
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};