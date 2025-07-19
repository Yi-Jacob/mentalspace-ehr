
import React from 'react';
import { Card, CardContent } from '@/components/shared/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: number;
  change: number;
  icon: React.ComponentType<any>;
  format?: 'number' | 'currency';
}

const KPICard: React.FC<KPICardProps> = ({ title, value, change, icon: Icon, format = 'number' }) => {
  const isPositive = change > 0;
  const formattedValue = format === 'currency' ? `$${value.toLocaleString()}` : value.toLocaleString();
  
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold">{formattedValue}</p>
            <div className="flex items-center mt-2">
              {isPositive ? (
                <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
              )}
              <span className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {Math.abs(change).toFixed(1)}%
              </span>
              <span className="text-sm text-gray-500 ml-1">vs last period</span>
            </div>
          </div>
          <Icon className="h-8 w-8 text-gray-400" />
        </div>
      </CardContent>
    </Card>
  );
};

export default KPICard;
