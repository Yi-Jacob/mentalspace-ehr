import React from 'react';
import { Card, CardContent } from '@/components/basic/card';
import { Badge } from '@/components/basic/badge';

interface SessionMultiplier {
  id: string;
  sessionType: string;
  multiplier: number;
  durationMinutes: number;
  isActive: boolean;
}

interface SessionMultipliersProps {
  sessionMultipliers: SessionMultiplier[];
}

const SessionMultipliers: React.FC<SessionMultipliersProps> = ({ sessionMultipliers }) => {
  if (!sessionMultipliers || sessionMultipliers.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Session Multipliers</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sessionMultipliers.map((multiplier) => (
          <Card key={multiplier.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">{multiplier.sessionType}</h4>
                  <Badge className="bg-green-100 text-green-800">
                    {multiplier.multiplier}x
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">{multiplier.durationMinutes} minutes</p>
                <div className="text-sm text-gray-600">
                  <strong>Status:</strong> {multiplier.isActive ? 'Active' : 'Inactive'}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SessionMultipliers;
