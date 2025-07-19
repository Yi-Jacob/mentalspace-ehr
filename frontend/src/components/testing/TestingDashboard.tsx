import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  TestTube, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Activity,
  AlertTriangle,
  Shield,
  Accessibility,
  Zap
} from 'lucide-react';

interface TestResult {
  id: string;
  name: string;
  status: 'passed' | 'failed' | 'running' | 'pending';
  duration?: number;
  error?: string;
  coverage?: number;
}

interface TestSuite {
  name: string;
  tests: TestResult[];
  totalTests: number;
  passedTests: number;
  failedTests: number;
  coverage: number;
}

export const TestingDashboard: React.FC = () => {
  const [testSuites, setTestSuites] = useState<TestSuite[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedSuite, setSelectedSuite] = useState<string>('unit');

  // Mock test data - in real implementation, this would come from test runners
  useEffect(() => {
    const mockTestSuites: TestSuite[] = [
      {
        name: 'Unit Tests',
        totalTests: 45,
        passedTests: 42,
        failedTests: 3,
        coverage: 87,
        tests: [
          {
            id: 'unit-1',
            name: 'ClientDetailView.test.tsx',
            status: 'passed',
            duration: 234,
            coverage: 92
          },
          {
            id: 'unit-2',
            name: 'AddClientModal.test.tsx',
            status: 'passed',
            duration: 156,
            coverage: 89
          },
          {
            id: 'unit-3',
            name: 'SecurityService.test.ts',
            status: 'failed',
            duration: 89,
            error: 'Expected true but received false',
            coverage: 78
          },
          {
            id: 'unit-4',
            name: 'ComplianceService.test.ts',
            status: 'passed',
            duration: 298,
            coverage: 85
          }
        ]
      },
      {
        name: 'Integration Tests',
        totalTests: 12,
        passedTests: 11,
        failedTests: 1,
        coverage: 72,
        tests: [
          {
            id: 'int-1',
            name: 'Client Workflow',
            status: 'passed',
            duration: 1234,
            coverage: 75
          },
          {
            id: 'int-2',
            name: 'Documentation Workflow',
            status: 'failed',
            duration: 856,
            error: 'Component did not render expected content',
            coverage: 68
          }
        ]
      },
      {
        name: 'E2E Tests',
        totalTests: 8,
        passedTests: 7,
        failedTests: 1,
        coverage: 68,
        tests: [
          {
            id: 'e2e-1',
            name: 'Clinical Workflow',
            status: 'passed',
            duration: 45678,
            coverage: 70
          },
          {
            id: 'e2e-2',
            name: 'Client Management',
            status: 'passed',
            duration: 32145,
            coverage: 65
          }
        ]
      },
      {
        name: 'Accessibility Tests',
        totalTests: 15,
        passedTests: 13,
        failedTests: 2,
        coverage: 95,
        tests: [
          {
            id: 'a11y-1',
            name: 'WCAG Compliance',
            status: 'passed',
            duration: 567,
            coverage: 98
          },
          {
            id: 'a11y-2',
            name: 'Keyboard Navigation',
            status: 'failed',
            duration: 234,
            error: 'Focus trap not working correctly',
            coverage: 85
          }
        ]
      }
    ];

    setTestSuites(mockTestSuites);
  }, []);

  const runAllTests = async () => {
    setIsRunning(true);
    
    // Simulate test execution
    setTimeout(() => {
      setIsRunning(false);
    }, 3000);
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'running':
        return <Clock className="h-4 w-4 text-yellow-600 animate-spin" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: TestResult['status']) => {
    const variants = {
      passed: 'default',
      failed: 'destructive',
      running: 'secondary',
      pending: 'outline'
    } as const;

    return (
      <Badge variant={variants[status]} className="capitalize">
        {status}
      </Badge>
    );
  };

  const totalTests = testSuites.reduce((acc, suite) => acc + suite.totalTests, 0);
  const totalPassed = testSuites.reduce((acc, suite) => acc + suite.passedTests, 0);
  const totalFailed = testSuites.reduce((acc, suite) => acc + suite.failedTests, 0);
  const overallCoverage = testSuites.reduce((acc, suite) => acc + suite.coverage, 0) / testSuites.length;

  return (
    <div className="space-y-6 p-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Testing Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor test execution, coverage, and quality metrics
        </p>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tests</CardTitle>
            <TestTube className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTests}</div>
            <p className="text-xs text-muted-foreground">
              Across all test suites
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Passed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{totalPassed}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((totalPassed / totalTests) * 100)}% success rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{totalFailed}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((totalFailed / totalTests) * 100)}% failure rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Coverage</CardTitle>
            <Activity className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(overallCoverage)}%</div>
            <Progress value={overallCoverage} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Test Execution Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Test Execution</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-4">
            <Button 
              onClick={runAllTests} 
              disabled={isRunning}
              className="flex items-center space-x-2"
            >
              {isRunning ? (
                <Clock className="h-4 w-4 animate-spin" />
              ) : (
                <TestTube className="h-4 w-4" />
              )}
              <span>{isRunning ? 'Running Tests...' : 'Run All Tests'}</span>
            </Button>
            
            <Button variant="outline" disabled={isRunning}>
              <Shield className="h-4 w-4 mr-2" />
              Security Tests
            </Button>
            
            <Button variant="outline" disabled={isRunning}>
              <Accessibility className="h-4 w-4 mr-2" />
              A11y Tests
            </Button>
            
            <Button variant="outline" disabled={isRunning}>
              <Zap className="h-4 w-4 mr-2" />
              Performance Tests
            </Button>
          </div>

          {isRunning && (
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Running test suites...</div>
              <Progress value={67} className="w-full" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Test Suites */}
      <Tabs value={selectedSuite} onValueChange={setSelectedSuite}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="unit">Unit Tests</TabsTrigger>
          <TabsTrigger value="integration">Integration</TabsTrigger>
          <TabsTrigger value="e2e">E2E Tests</TabsTrigger>
          <TabsTrigger value="accessibility">Accessibility</TabsTrigger>
        </TabsList>

        {testSuites.map((suite, index) => (
          <TabsContent 
            key={suite.name} 
            value={['unit', 'integration', 'e2e', 'accessibility'][index]}
            className="space-y-4"
          >
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{suite.name}</CardTitle>
                  <div className="flex space-x-2">
                    <Badge variant="outline">
                      {suite.passedTests}/{suite.totalTests} passed
                    </Badge>
                    <Badge variant="outline">
                      {suite.coverage}% coverage
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  <div className="space-y-2">
                    {suite.tests.map((test) => (
                      <div 
                        key={test.id} 
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          {getStatusIcon(test.status)}
                          <div>
                            <div className="font-medium">{test.name}</div>
                            {test.error && (
                              <div className="text-sm text-red-600 flex items-center space-x-1">
                                <AlertTriangle className="h-3 w-3" />
                                <span>{test.error}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          {test.duration && (
                            <span className="text-sm text-muted-foreground">
                              {test.duration < 1000 ? `${test.duration}ms` : `${(test.duration / 1000).toFixed(1)}s`}
                            </span>
                          )}
                          {test.coverage && (
                            <span className="text-sm text-muted-foreground">
                              {test.coverage}% coverage
                            </span>
                          )}
                          {getStatusBadge(test.status)}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* Test Coverage Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Coverage Report</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold">By Test Type</h4>
              {testSuites.map((suite) => (
                <div key={suite.name} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{suite.name}</span>
                    <span>{suite.coverage}%</span>
                  </div>
                  <Progress value={suite.coverage} />
                </div>
              ))}
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold">Implementation Status</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span>✅ Unit Testing Setup</span>
                  <Badge>Complete</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>✅ Component Testing</span>
                  <Badge>Complete</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>✅ Integration Testing</span>
                  <Badge>Complete</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>✅ E2E Testing (Playwright)</span>
                  <Badge>Complete</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>✅ Accessibility Testing</span>
                  <Badge>Complete</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>✅ Performance Testing</span>
                  <Badge>Complete</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>✅ HIPAA Compliance Testing</span>
                  <Badge>Complete</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};