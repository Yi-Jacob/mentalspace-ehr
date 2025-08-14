import React, { useState } from 'react';
import { Button } from '@/components/basic/button';
import { Calendar, Clock, Repeat } from 'lucide-react';
import RecurringRuleModal from './RecurringRuleModal';

interface RecurringSectionProps {
  recurring_period: 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom';
  onRecurringPeriodChange: (value: 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom') => void;
}

const RecurringSection: React.FC<RecurringSectionProps> = ({
  recurring_period,
  onRecurringPeriodChange
}) => {
  const [showRecurringRuleModal, setShowRecurringRuleModal] = useState(false);

  const recurringOptions = [
    { value: 'none', label: 'None', description: 'One-time appointment' },
    { value: 'daily', label: 'Daily', description: 'Every day' },
    { value: 'weekly', label: 'Weekly', description: 'Every week on the same day' },
    { value: 'monthly', label: 'Monthly', description: 'Every month on the same date' },
    { value: 'yearly', label: 'Yearly', description: 'Every year on the same date' },
    { value: 'custom', label: 'Custom', description: 'Advanced recurring pattern' }
  ];

  const handleRecurringPeriodChange = (value: string) => {
    if (value === 'custom') {
      setShowRecurringRuleModal(true);
    } else {
      onRecurringPeriodChange(value as any);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 mb-4">
        <Repeat className="h-5 w-5 text-purple-600" />
        <span className="text-sm font-medium text-gray-700">Recurring Period</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {recurringOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => handleRecurringPeriodChange(option.value)}
            className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
              recurring_period === option.value
                ? 'border-purple-500 bg-purple-50 text-purple-700'
                : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            <div className="font-medium text-sm">{option.label}</div>
            <div className="text-xs text-gray-500 mt-1">{option.description}</div>
          </button>
        ))}
      </div>

      {recurring_period !== 'none' && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">
              Recurring appointment configured
            </span>
          </div>
          <p className="text-sm text-blue-600 mt-1">
            This appointment will repeat {recurring_period === 'daily' ? 'every day' :
              recurring_period === 'weekly' ? 'every week' :
              recurring_period === 'monthly' ? 'every month' :
              recurring_period === 'yearly' ? 'every year' : 'based on custom rules'}
          </p>
        </div>
      )}

      {/* Recurring Rule Modal */}
      {showRecurringRuleModal && (
        <RecurringRuleModal
          open={showRecurringRuleModal}
          onOpenChange={setShowRecurringRuleModal}
          onRecurringRuleCreated={(ruleId) => {
            onRecurringPeriodChange('custom');
            setShowRecurringRuleModal(false);
          }}
        />
      )}
    </div>
  );
};

export default RecurringSection;
