
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shared/ui/card';
import { Button } from '@/components/shared/ui/button';
import { Progress } from '@/components/shared/ui/progress';
import { Target, Award, Calendar, FileText } from 'lucide-react';

interface ComplianceGoalsProps {
  compliance24h: number;
  onCreateReminder: () => void;
}

const ComplianceGoals: React.FC<ComplianceGoalsProps> = ({ 
  compliance24h, 
  onCreateReminder 
}) => {
  const weeklyStreak = Math.floor(Math.random() * 7) + 1;

  return (
    <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Target className="h-5 w-5 text-purple-600" />
          <span>Compliance Goals</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Monthly Goal */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">Monthly Target</span>
            <span className="text-sm text-purple-600 font-semibold">95%</span>
          </div>
          <Progress value={compliance24h} className="h-3" />
          <p className="text-xs text-gray-600">
            {compliance24h >= 95 ? 'Target achieved! 🎉' : `${95 - compliance24h}% to reach goal`}
          </p>
        </div>

        {/* Weekly Streak */}
        <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-purple-100">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-full">
              <Award className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Weekly Streak</p>
              <p className="text-sm text-gray-600">Consecutive compliant days</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-purple-600">{weeklyStreak}</p>
            <p className="text-xs text-purple-500">days</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">Quick Actions</p>
          <div className="flex space-x-2">
            <Button size="sm" variant="outline" className="flex-1" onClick={onCreateReminder}>
              <Calendar className="w-4 h-4 mr-1" />
              Schedule
            </Button>
            <Button size="sm" className="flex-1 bg-purple-600 hover:bg-purple-700">
              <FileText className="w-4 h-4 mr-1" />
              Review
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ComplianceGoals;
