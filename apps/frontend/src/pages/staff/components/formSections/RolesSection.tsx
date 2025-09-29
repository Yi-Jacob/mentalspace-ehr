
import React from 'react';
import { Button } from '@/components/basic/button';
import { UserRole } from '@/types/staffType';
import { HelpCircle } from 'lucide-react';
import CheckboxGroup from '@/components/basic/CheckboxGroup';
import CategorySection from '@/components/basic/CategorySection';
import { ROLE_CATEGORIES } from '@/types/enums/staffEnum';

interface RolesSectionProps {
  formData: any;
  onRoleToggle: (role: UserRole) => void;
}

const RolesSection: React.FC<RolesSectionProps> = ({
  formData,
  onRoleToggle
}) => {
  const [showInstructions, setShowInstructions] = React.useState(false);

  return (
    <CategorySection
      title="Roles"
      description="Each user can have multiple roles. A user's roles determine what they can access."
      headerAction={
        <Button 
          type="button" 
          variant="outline" 
          size="sm"
          onClick={() => setShowInstructions(!showInstructions)}
          className="flex items-center space-x-2 bg-white/80 border-blue-200 hover:bg-blue-50 transition-colors"
        >
          <HelpCircle className="h-4 w-4" />
          <span>{showInstructions ? 'Hide Instructions' : 'Show Instructions'}</span>
        </Button>
      }
    >
      {(!formData.roles || formData.roles.length === 0) && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">
            <strong>Required:</strong> Please select at least one role for this staff member.
          </p>
        </div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {ROLE_CATEGORIES.filter(category => category.title !== 'Patient Access').map((category) => (
          <CheckboxGroup
            key={category.title}
            title={category.title}
            items={category.items}
            checkedItems={formData.roles}
            onToggle={onRoleToggle}
            showDescriptions={showInstructions}
          />
        ))}
      </div>
    </CategorySection>
  );
};

export default RolesSection;
