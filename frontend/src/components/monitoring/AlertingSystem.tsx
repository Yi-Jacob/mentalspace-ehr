import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shared/ui/card';
import { Badge } from '@/components/shared/ui/badge';
import { Button } from '@/components/shared/ui/button';
import { Switch } from '@/components/shared/ui/switch';
import { Input } from '@/components/shared/ui/input';
import { Label } from '@/components/shared/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/shared/ui/tabs';
import { ScrollArea } from '@/components/shared/ui/scroll-area';
import { 
  AlertTriangle, 
  Bell, 
  BellOff, 
  Clock,
  Mail,
  MessageSquare,
  Phone,
  Settings,
  Check,
  X,
  ExternalLink
} from 'lucide-react';
import { toast } from '@/components/shared/ui/use-toast';

interface Alert {
  id: string;
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'critical';
  timestamp: Date;
  source: string;
  acknowledged: boolean;
  resolved: boolean;
  acknowledgedBy?: string;
  resolvedBy?: string;
}

interface AlertRule {
  id: string;
  name: string;
  condition: string;
  threshold: number;
  enabled: boolean;
  channels: string[];
  description: string;
}

interface NotificationChannel {
  id: string;
  name: string;
  type: 'email' | 'slack' | 'webhook' | 'sms';
  configuration: Record<string, any>;
  enabled: boolean;
}

export const AlertingSystem: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [alertRules, setAlertRules] = useState<AlertRule[]>([]);
  const [notificationChannels, setNotificationChannels] = useState<NotificationChannel[]>([]);
  const [selectedTab, setSelectedTab] = useState('alerts');

  // Initialize sample data
  useEffect(() => {
    const sampleAlerts: Alert[] = [
      {
        id: '1',
        title: 'High Database Response Time',
        message: 'Database queries are taking longer than 500ms on average',
        severity: 'warning',
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        source: 'Database Monitor',
        acknowledged: false,
        resolved: false
      },
      {
        id: '2',
        title: 'Failed Login Attempts Spike',
        message: 'Detected 15 failed login attempts in the last 5 minutes',
        severity: 'critical',
        timestamp: new Date(Date.now() - 10 * 60 * 1000),
        source: 'Security Monitor',
        acknowledged: true,
        resolved: false,
        acknowledgedBy: 'admin@mentalspace.com'
      },
      {
        id: '3',
        title: 'Backup Completed Successfully',
        message: 'Daily database backup completed at 2:00 AM',
        severity: 'info',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        source: 'Backup Service',
        acknowledged: false,
        resolved: true
      }
    ];

    const sampleRules: AlertRule[] = [
      {
        id: '1',
        name: 'High Response Time',
        condition: 'average_response_time > threshold',
        threshold: 500,
        enabled: true,
        channels: ['email', 'slack'],
        description: 'Alert when average response time exceeds 500ms'
      },
      {
        id: '2',
        name: 'Failed Authentication',
        condition: 'failed_logins_5min > threshold',
        threshold: 10,
        enabled: true,
        channels: ['email', 'slack', 'sms'],
        description: 'Alert when failed login attempts exceed 10 in 5 minutes'
      },
      {
        id: '3',
        name: 'Low Disk Space',
        condition: 'disk_usage_percent > threshold',
        threshold: 85,
        enabled: true,
        channels: ['email'],
        description: 'Alert when disk usage exceeds 85%'
      },
      {
        id: '4',
        name: 'Error Rate Spike',
        condition: 'error_rate_1h > threshold',
        threshold: 5,
        enabled: false,
        channels: ['slack'],
        description: 'Alert when error rate exceeds 5% over 1 hour'
      }
    ];

    const sampleChannels: NotificationChannel[] = [
      {
        id: 'email',
        name: 'Email Notifications',
        type: 'email',
        configuration: {
          recipients: ['admin@mentalspace.com', 'support@mentalspace.com']
        },
        enabled: true
      },
      {
        id: 'slack',
        name: 'Slack Alerts',
        type: 'slack',
        configuration: {
          webhook_url: 'https://hooks.slack.com/services/...',
          channel: '#alerts'
        },
        enabled: true
      },
      {
        id: 'webhook',
        name: 'PagerDuty Integration',
        type: 'webhook',
        configuration: {
          url: 'https://events.pagerduty.com/integration/...'
        },
        enabled: false
      },
      {
        id: 'sms',
        name: 'SMS Alerts',
        type: 'sms',
        configuration: {
          phone_numbers: ['+1234567890']
        },
        enabled: false
      }
    ];

    setAlerts(sampleAlerts);
    setAlertRules(sampleRules);
    setNotificationChannels(sampleChannels);
  }, []);

  const acknowledgeAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId 
        ? { ...alert, acknowledged: true, acknowledgedBy: 'current-user@example.com' }
        : alert
    ));
    toast({
      title: "Alert Acknowledged",
      description: "The alert has been acknowledged successfully.",
    });
  };

  const resolveAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId 
        ? { ...alert, resolved: true, resolvedBy: 'current-user@example.com' }
        : alert
    ));
    toast({
      title: "Alert Resolved",
      description: "The alert has been marked as resolved.",
    });
  };

  const toggleAlertRule = (ruleId: string) => {
    setAlertRules(prev => prev.map(rule => 
      rule.id === ruleId 
        ? { ...rule, enabled: !rule.enabled }
        : rule
    ));
  };

  const toggleNotificationChannel = (channelId: string) => {
    setNotificationChannels(prev => prev.map(channel => 
      channel.id === channelId 
        ? { ...channel, enabled: !channel.enabled }
        : channel
    ));
  };

  const getSeverityIcon = (severity: Alert['severity']) => {
    switch (severity) {
      case 'critical':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'info':
        return <Bell className="h-4 w-4 text-blue-600" />;
      default:
        return <Bell className="h-4 w-4 text-gray-400" />;
    }
  };

  const getSeverityBadge = (severity: Alert['severity']) => {
    const variants = {
      critical: 'destructive',
      warning: 'secondary',
      info: 'default'
    } as const;

    return (
      <Badge variant={variants[severity]} className="capitalize">
        {severity}
      </Badge>
    );
  };

  const getChannelIcon = (type: NotificationChannel['type']) => {
    switch (type) {
      case 'email':
        return <Mail className="h-4 w-4" />;
      case 'slack':
        return <MessageSquare className="h-4 w-4" />;
      case 'sms':
        return <Phone className="h-4 w-4" />;
      case 'webhook':
        return <ExternalLink className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const unacknowledgedAlerts = alerts.filter(alert => !alert.acknowledged && !alert.resolved);
  const criticalAlerts = alerts.filter(alert => alert.severity === 'critical' && !alert.resolved);

  return (
    <div className="space-y-6">
      {/* Alert Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {unacknowledgedAlerts.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Require attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Alerts</CardTitle>
            <X className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {criticalAlerts.length}
            </div>
            <p className="text-xs text-muted-foreground">
              High priority issues
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alert Rules</CardTitle>
            <Settings className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {alertRules.filter(rule => rule.enabled).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Active monitoring rules
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="alerts">Recent Alerts</TabsTrigger>
          <TabsTrigger value="rules">Alert Rules</TabsTrigger>
          <TabsTrigger value="channels">Notification Channels</TabsTrigger>
        </TabsList>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-3">
                  {alerts.map((alert) => (
                    <div 
                      key={alert.id}
                      className="flex items-start justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-start space-x-3">
                        {getSeverityIcon(alert.severity)}
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-medium">{alert.title}</h4>
                            {getSeverityBadge(alert.severity)}
                            {alert.acknowledged && (
                              <Badge variant="outline" className="text-xs">
                                Acknowledged
                              </Badge>
                            )}
                            {alert.resolved && (
                              <Badge variant="default" className="text-xs">
                                Resolved
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {alert.message}
                          </p>
                          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                            <span className="flex items-center space-x-1">
                              <Clock className="h-3 w-3" />
                              <span>{alert.timestamp.toLocaleString()}</span>
                            </span>
                            <span>Source: {alert.source}</span>
                            {alert.acknowledgedBy && (
                              <span>Acknowledged by: {alert.acknowledgedBy}</span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        {!alert.acknowledged && !alert.resolved && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => acknowledgeAlert(alert.id)}
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Acknowledge
                          </Button>
                        )}
                        {!alert.resolved && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => resolveAlert(alert.id)}
                          >
                            <X className="h-4 w-4 mr-1" />
                            Resolve
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rules" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Alert Rules Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-4">
                  {alertRules.map((rule) => (
                    <div 
                      key={rule.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <Switch
                            checked={rule.enabled}
                            onCheckedChange={() => toggleAlertRule(rule.id)}
                          />
                          <h4 className="font-medium">{rule.name}</h4>
                          {rule.enabled ? (
                            <Badge variant="default">Active</Badge>
                          ) : (
                            <Badge variant="outline">Disabled</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {rule.description}
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <span>Condition: {rule.condition}</span>
                          <span>Threshold: {rule.threshold}</span>
                          <span>Channels: {rule.channels.join(', ')}</span>
                        </div>
                      </div>
                      
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4 mr-1" />
                        Configure
                      </Button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="channels" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Channels</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-4">
                  {notificationChannels.map((channel) => (
                    <div 
                      key={channel.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        {getChannelIcon(channel.type)}
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-medium">{channel.name}</h4>
                            {channel.enabled ? (
                              <Badge variant="default">Active</Badge>
                            ) : (
                              <Badge variant="outline">Disabled</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground capitalize">
                            {channel.type} notifications
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={channel.enabled}
                          onCheckedChange={() => toggleNotificationChannel(channel.id)}
                        />
                        <Button variant="outline" size="sm">
                          <Settings className="h-4 w-4 mr-1" />
                          Configure
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};