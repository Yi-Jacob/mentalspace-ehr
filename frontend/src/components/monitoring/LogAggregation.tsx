import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Filter, 
  Download, 
  RefreshCw,
  AlertTriangle,
  Info,
  XCircle,
  Clock,
  Database,
  Globe,
  Shield,
  Eye
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface LogEntry {
  id: string;
  timestamp: Date;
  level: 'info' | 'warn' | 'error' | 'debug';
  source: string;
  message: string;
  context?: Record<string, any>;
  userId?: string;
  requestId?: string;
  duration?: number;
}

interface LogFilter {
  level?: string;
  source?: string;
  timeRange: string;
  searchQuery: string;
  userId?: string;
}

export const LogAggregation: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<LogEntry[]>([]);
  const [filter, setFilter] = useState<LogFilter>({
    timeRange: '1h',
    searchQuery: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState('all');

  // Initialize sample log data
  useEffect(() => {
    const sampleLogs: LogEntry[] = [
      {
        id: '1',
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        level: 'error',
        source: 'api',
        message: 'Database connection timeout',
        context: { 
          query: 'SELECT * FROM clients', 
          timeout: 5000,
          retries: 3
        },
        requestId: 'req_123456',
        duration: 5000
      },
      {
        id: '2',
        timestamp: new Date(Date.now() - 10 * 60 * 1000),
        level: 'warn',
        source: 'auth',
        message: 'Failed login attempt',
        context: { 
          email: 'user@example.com',
          ip: '192.168.1.100',
          userAgent: 'Mozilla/5.0...'
        },
        requestId: 'req_123455',
        userId: 'user_789'
      },
      {
        id: '3',
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        level: 'info',
        source: 'api',
        message: 'Note created successfully',
        context: { 
          noteId: 'note_456',
          clientId: 'client_123',
          noteType: 'progress_note'
        },
        requestId: 'req_123454',
        userId: 'user_456',
        duration: 150
      },
      {
        id: '4',
        timestamp: new Date(Date.now() - 20 * 60 * 1000),
        level: 'info',
        source: 'scheduler',
        message: 'Appointment reminder sent',
        context: { 
          appointmentId: 'appt_789',
          clientId: 'client_456',
          reminderType: 'email'
        },
        requestId: 'req_123453'
      },
      {
        id: '5',
        timestamp: new Date(Date.now() - 25 * 60 * 1000),
        level: 'debug',
        source: 'api',
        message: 'Cache miss for client data',
        context: { 
          cacheKey: 'client_123',
          ttl: 3600
        },
        requestId: 'req_123452',
        duration: 25
      },
      {
        id: '6',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        level: 'error',
        source: 'payment',
        message: 'Payment processing failed',
        context: { 
          paymentId: 'pay_789',
          amount: 150.00,
          currency: 'USD',
          errorCode: 'CARD_DECLINED'
        },
        requestId: 'req_123451',
        userId: 'user_123'
      }
    ];

    setLogs(sampleLogs);
    setFilteredLogs(sampleLogs);
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = [...logs];

    // Filter by level
    if (filter.level && filter.level !== 'all') {
      filtered = filtered.filter(log => log.level === filter.level);
    }

    // Filter by source
    if (filter.source && filter.source !== 'all') {
      filtered = filtered.filter(log => log.source === filter.source);
    }

    // Filter by search query
    if (filter.searchQuery) {
      const query = filter.searchQuery.toLowerCase();
      filtered = filtered.filter(log => 
        log.message.toLowerCase().includes(query) ||
        log.source.toLowerCase().includes(query) ||
        (log.userId && log.userId.toLowerCase().includes(query)) ||
        (log.requestId && log.requestId.toLowerCase().includes(query))
      );
    }

    // Filter by time range
    const now = Date.now();
    const timeRangeMs = {
      '1h': 60 * 60 * 1000,
      '6h': 6 * 60 * 60 * 1000,
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000
    };

    if (timeRangeMs[filter.timeRange as keyof typeof timeRangeMs]) {
      const cutoff = now - timeRangeMs[filter.timeRange as keyof typeof timeRangeMs];
      filtered = filtered.filter(log => log.timestamp.getTime() > cutoff);
    }

    setFilteredLogs(filtered);
  }, [logs, filter]);

  const refreshLogs = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    toast({
      title: "Logs Refreshed",
      description: "Log data has been updated.",
    });
  };

  const exportLogs = () => {
    const logData = filteredLogs.map(log => ({
      timestamp: log.timestamp.toISOString(),
      level: log.level,
      source: log.source,
      message: log.message,
      requestId: log.requestId,
      userId: log.userId,
      duration: log.duration,
      context: JSON.stringify(log.context)
    }));

    const csv = [
      'timestamp,level,source,message,requestId,userId,duration,context',
      ...logData.map(row => 
        Object.values(row).map(value => 
          typeof value === 'string' && value.includes(',') 
            ? `"${value}"` 
            : value || ''
        ).join(',')
      )
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `logs-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Logs Exported",
      description: "Log data has been exported to CSV.",
    });
  };

  const getLevelIcon = (level: LogEntry['level']) => {
    switch (level) {
      case 'error':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'warn':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'info':
        return <Info className="h-4 w-4 text-blue-600" />;
      case 'debug':
        return <Eye className="h-4 w-4 text-gray-400" />;
      default:
        return <Info className="h-4 w-4 text-gray-400" />;
    }
  };

  const getLevelBadge = (level: LogEntry['level']) => {
    const variants = {
      error: 'destructive',
      warn: 'secondary',
      info: 'default',
      debug: 'outline'
    } as const;

    return (
      <Badge variant={variants[level]} className="capitalize">
        {level}
      </Badge>
    );
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'api':
        return <Globe className="h-4 w-4" />;
      case 'auth':
        return <Shield className="h-4 w-4" />;
      case 'database':
        return <Database className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const logsByLevel = {
    all: filteredLogs,
    error: filteredLogs.filter(log => log.level === 'error'),
    warn: filteredLogs.filter(log => log.level === 'warn'),
    info: filteredLogs.filter(log => log.level === 'info'),
    debug: filteredLogs.filter(log => log.level === 'debug')
  };

  const uniqueSources = [...new Set(logs.map(log => log.source))];

  return (
    <div className="space-y-6">
      {/* Log Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Logs</CardTitle>
            <Info className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredLogs.length}</div>
            <p className="text-xs text-muted-foreground">
              In selected time range
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Errors</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {logsByLevel.error.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Error level logs
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Warnings</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {logsByLevel.warn.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Warning level logs
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sources</CardTitle>
            <Globe className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{uniqueSources.length}</div>
            <p className="text-xs text-muted-foreground">
              Active log sources
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Log Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-end gap-4">
            <div className="flex-1 min-w-[200px]">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search logs..."
                  value={filter.searchQuery}
                  onChange={(e) => setFilter(prev => ({ ...prev, searchQuery: e.target.value }))}
                  className="pl-8"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="level">Level</Label>
              <Select 
                value={filter.level || 'all'} 
                onValueChange={(value) => setFilter(prev => ({ ...prev, level: value }))}
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="All levels" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                  <SelectItem value="warn">Warning</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="debug">Debug</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="source">Source</Label>
              <Select 
                value={filter.source || 'all'} 
                onValueChange={(value) => setFilter(prev => ({ ...prev, source: value }))}
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="All sources" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sources</SelectItem>
                  {uniqueSources.map(source => (
                    <SelectItem key={source} value={source} className="capitalize">
                      {source}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="timeRange">Time Range</Label>
              <Select 
                value={filter.timeRange} 
                onValueChange={(value) => setFilter(prev => ({ ...prev, timeRange: value }))}
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1h">Last Hour</SelectItem>
                  <SelectItem value="6h">Last 6 Hours</SelectItem>
                  <SelectItem value="24h">Last 24 Hours</SelectItem>
                  <SelectItem value="7d">Last 7 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={refreshLogs}
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button
                variant="outline"
                onClick={exportLogs}
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Log Entries */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="all">
            All ({logsByLevel.all.length})
          </TabsTrigger>
          <TabsTrigger value="error">
            Errors ({logsByLevel.error.length})
          </TabsTrigger>
          <TabsTrigger value="warn">
            Warnings ({logsByLevel.warn.length})
          </TabsTrigger>
          <TabsTrigger value="info">
            Info ({logsByLevel.info.length})
          </TabsTrigger>
          <TabsTrigger value="debug">
            Debug ({logsByLevel.debug.length})
          </TabsTrigger>
        </TabsList>

        {Object.entries(logsByLevel).map(([level, levelLogs]) => (
          <TabsContent key={level} value={level}>
            <Card>
              <CardHeader>
                <CardTitle className="capitalize">
                  {level === 'all' ? 'All Logs' : `${level} Logs`}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  <div className="space-y-3">
                    {levelLogs.map((log) => (
                      <div 
                        key={log.id}
                        className="flex items-start space-x-3 p-4 border rounded-lg"
                      >
                        <div className="flex items-center space-x-2 min-w-0">
                          {getLevelIcon(log.level)}
                          {getSourceIcon(log.source)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-mono text-xs text-muted-foreground">
                              {log.timestamp.toLocaleString()}
                            </span>
                            {getLevelBadge(log.level)}
                            <Badge variant="outline" className="text-xs">
                              {log.source}
                            </Badge>
                            {log.duration && (
                              <Badge variant="outline" className="text-xs">
                                {log.duration}ms
                              </Badge>
                            )}
                          </div>
                          
                          <p className="text-sm font-medium mb-1">
                            {log.message}
                          </p>
                          
                          <div className="flex items-center space-x-4 text-xs text-muted-foreground mb-2">
                            {log.requestId && (
                              <span>Request: {log.requestId}</span>
                            )}
                            {log.userId && (
                              <span>User: {log.userId}</span>
                            )}
                          </div>
                          
                          {log.context && (
                            <details className="text-xs">
                              <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                                Show context
                              </summary>
                              <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-x-auto">
                                {JSON.stringify(log.context, null, 2)}
                              </pre>
                            </details>
                          )}
                        </div>
                      </div>
                    ))}
                    
                    {levelLogs.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        No logs found for the selected filters.
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};