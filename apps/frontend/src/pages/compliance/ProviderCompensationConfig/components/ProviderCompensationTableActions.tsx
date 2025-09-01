import React from 'react';
import { Button } from '@/components/basic/button';
import { Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { type ProviderCompensationConfig } from '@/services/complianceService';

interface ProviderCompensationTableActionsProps {
  config: ProviderCompensationConfig;
  onEdit: (config: ProviderCompensationConfig) => void;
  onDelete: (id: string) => void;
  onToggleActive: (id: string, isActive: boolean) => void;
  isPending: boolean;
}

const ProviderCompensationTableActions: React.FC<ProviderCompensationTableActionsProps> = ({
  config,
  onEdit,
  onDelete,
  onToggleActive,
  isPending,
}) => {
  return (
    <div className="flex items-center space-x-2">
      <Button
        size="sm"
        variant="outline"
        onClick={() => onEdit(config)}
        disabled={isPending}
      >
        <Edit className="h-4 w-4" />
        <span className="sr-only">Edit</span>
      </Button>
      
      <Button
        size="sm"
        variant={config.isActive ? "destructive" : "default"}
        onClick={() => onToggleActive(config.id, !config.isActive)}
        disabled={isPending}
        className={config.isActive ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}
      >
        {config.isActive ? (
          <>
            <XCircle className="h-4 w-4" />
            <span className="sr-only">Deactivate</span>
          </>
        ) : (
          <>
            <CheckCircle className="h-4 w-4" />
            <span className="sr-only">Activate</span>
          </>
        )}
      </Button>
      
      <Button
        size="sm"
        variant="destructive"
        onClick={() => onDelete(config.id)}
        disabled={isPending}
      >
        <Trash2 className="h-4 w-4" />
        <span className="sr-only">Delete</span>
      </Button>
    </div>
  );
};

export default ProviderCompensationTableActions;
