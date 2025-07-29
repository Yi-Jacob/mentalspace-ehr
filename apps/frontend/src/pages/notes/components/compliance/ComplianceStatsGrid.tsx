
import React from 'react';
import { Card, CardContent } from '@/components/basic/card';
import { Progress } from '@/components/basic/progress';
import { CheckCircle, Target, FileText, AlertTriangle } from 'lucide-react';

interface ComplianceStatsGridProps {
  compliance24h: number;
  dailyGoal: { target_value: number; current_value: number };
  draftNotes: number;
  overdueNotes: number;
}

const ComplianceStatsGrid: React.FC<ComplianceStatsGridProps> = ({
  compliance24h,
  dailyGoal,
  draftNotes,
  overdueNotes,
}) => {
  const getComplianceColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const goalProgress = Math.min((dailyGoal.current_value / dailyGoal.target_value) * 100, 100);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* 24h Compliance */}
      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 hover:shadow-lg transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-700">24h Compliance</p>
              <p className={`text-3xl font-bold ${getComplianceColor(compliance24h)}`}>
                {compliance24h}%
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <Progress 
            value={compliance24h} 
            className="mt-3 h-2"
          />
        </CardContent>
      </Card>

      {/* Daily Goal Progress */}
      <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200 hover:shadow-lg transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700">Daily Goal</p>
              <p className="text-3xl font-bold text-blue-600">
                {dailyGoal.current_value}/{dailyGoal.target_value}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Target className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <Progress 
            value={goalProgress} 
            className="mt-3 h-2"
          />
          <p className="text-xs text-blue-600 mt-1">
            {goalProgress >= 100 ? 'Goal achieved! 🎉' : `${dailyGoal.target_value - dailyGoal.current_value} more to go`}
          </p>
        </CardContent>
      </Card>

      {/* Unsigned Notes */}
      <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200 hover:shadow-lg transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-700">Unsigned Notes</p>
              <p className="text-3xl font-bold text-orange-600">{draftNotes}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <FileText className="h-6 w-6 text-orange-600" />
            </div>
          </div>
          <p className="text-xs text-orange-600 mt-2">
            {draftNotes === 0 ? 'All caught up!' : 'Needs attention'}
          </p>
        </CardContent>
      </Card>

      {/* Overdue Notes */}
      <Card className="bg-gradient-to-br from-red-50 to-pink-50 border-red-200 hover:shadow-lg transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-700">Overdue Notes</p>
              <p className="text-3xl font-bold text-red-600">{overdueNotes}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
          </div>
          <p className="text-xs text-red-600 mt-2">
            {overdueNotes === 0 ? 'Great job!' : '7+ days old'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComplianceStatsGrid;
