
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Target, Plus, BarChart3 } from 'lucide-react';
import { usePerformanceTracking } from '@/hooks/usePerformanceTracking';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const PerformanceView: React.FC = () => {
  const { performanceMetrics, isLoading, addPerformanceMetric, isAdding } = usePerformanceTracking();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newMetric, setNewMetric] = useState({
    user_id: '',
    metric_type: '',
    metric_value: '',
    target_value: '',
    measurement_period: 'monthly',
    period_start: '',
    period_end: '',
    notes: '',
  });

  const handleAddMetric = async () => {
    await addPerformanceMetric.mutateAsync({
      user_id: newMetric.user_id,
      metric_type: newMetric.metric_type,
      metric_value: parseFloat(newMetric.metric_value),
      target_value: newMetric.target_value ? parseFloat(newMetric.target_value) : undefined,
      measurement_period: newMetric.measurement_period,
      period_start: newMetric.period_start,
      period_end: newMetric.period_end,
      notes: newMetric.notes || undefined,
    });
    setShowAddDialog(false);
    setNewMetric({
      user_id: '',
      metric_type: '',
      metric_value: '',
      target_value: '',
      measurement_period: 'monthly',
      period_start: '',
      period_end: '',
      notes: '',
    });
  };

  const getPerformanceStatus = (value: number, target?: number) => {
    if (!target) return 'neutral';
    const percentage = (value / target) * 100;
    if (percentage >= 100) return 'excellent';
    if (percentage >= 80) return 'good';
    if (percentage >= 60) return 'fair';
    return 'poor';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'bg-green-500';
      case 'good': return 'bg-blue-500';
      case 'fair': return 'bg-yellow-500';
      case 'poor': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <BarChart3 className="h-6 w-6" />
          <h2 className="text-2xl font-bold">Performance Tracking</h2>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Metric
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add Performance Metric</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Metric Type</Label>
                  <Select 
                    value={newMetric.metric_type}
                    onValueChange={(value) => setNewMetric(prev => ({ ...prev, metric_type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="client_satisfaction">Client Satisfaction</SelectItem>
                      <SelectItem value="session_completion_rate">Session Completion Rate</SelectItem>
                      <SelectItem value="note_completion_time">Note Completion Time</SelectItem>
                      <SelectItem value="revenue_generated">Revenue Generated</SelectItem>
                      <SelectItem value="training_hours">Training Hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Period</Label>
                  <Select 
                    value={newMetric.measurement_period}
                    onValueChange={(value) => setNewMetric(prev => ({ ...prev, measurement_period: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Actual Value</Label>
                  <Input
                    type="number"
                    value={newMetric.metric_value}
                    onChange={(e) => setNewMetric(prev => ({ ...prev, metric_value: e.target.value }))}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label>Target Value</Label>
                  <Input
                    type="number"
                    value={newMetric.target_value}
                    onChange={(e) => setNewMetric(prev => ({ ...prev, target_value: e.target.value }))}
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Period Start</Label>
                  <Input
                    type="date"
                    value={newMetric.period_start}
                    onChange={(e) => setNewMetric(prev => ({ ...prev, period_start: e.target.value }))}
                  />
                </div>
                <div>
                  <Label>Period End</Label>
                  <Input
                    type="date"
                    value={newMetric.period_end}
                    onChange={(e) => setNewMetric(prev => ({ ...prev, period_end: e.target.value }))}
                  />
                </div>
              </div>
              <div>
                <Label>Notes</Label>
                <Textarea
                  value={newMetric.notes}
                  onChange={(e) => setNewMetric(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Additional notes..."
                />
              </div>
              <Button 
                onClick={handleAddMetric} 
                disabled={isAdding}
                className="w-full"
              >
                Add Metric
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Performance Metrics Grid */}
      <div className="grid gap-4">
        {performanceMetrics?.map((metric) => {
          const status = getPerformanceStatus(metric.metric_value, metric.target_value);
          return (
            <Card key={metric.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <TrendingUp className="h-5 w-5 text-blue-600" />
                      <div>
                        <h3 className="font-medium">{metric.metric_type.replace(/_/g, ' ').toUpperCase()}</h3>
                        <p className="text-sm text-gray-600">
                          {format(new Date(metric.period_start), 'MMM dd')} - {format(new Date(metric.period_end), 'MMM dd, yyyy')}
                        </p>
                      </div>
                    </div>
                    {metric.notes && (
                      <p className="text-sm text-gray-500 mt-2">{metric.notes}</p>
                    )}
                  </div>
                  <div className="text-right space-y-2">
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(status)}>
                        {status}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold">{metric.metric_value}</span>
                      {metric.target_value && (
                        <div className="text-sm text-gray-500">
                          <Target className="h-4 w-4 inline mr-1" />
                          {metric.target_value}
                        </div>
                      )}
                    </div>
                    {metric.target_value && (
                      <div className="text-xs text-gray-500">
                        {Math.round((metric.metric_value / metric.target_value) * 100)}% of target
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {(!performanceMetrics || performanceMetrics.length === 0) && (
        <Card>
          <CardContent className="text-center py-8">
            <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">No Performance Metrics</h3>
            <p className="text-gray-500 mb-4">Start tracking performance by adding your first metric.</p>
            <Button onClick={() => setShowAddDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add First Metric
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PerformanceView;
