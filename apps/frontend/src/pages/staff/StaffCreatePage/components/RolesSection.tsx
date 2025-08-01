
import React from 'react';
import { Button } from '@/components/basic/button';
import { UserRole } from '@/types/staffType';
import { HelpCircle } from 'lucide-react';
import CheckboxGroup from '@/components/basic/CheckboxGroup';
import CategorySection from '@/components/basic/CategorySection';
import { ROLE_DESCRIPTIONS } from '@/types/enums/staffEnum';

interface RolesSectionProps {
  formData: any;
  onRoleToggle: (role: UserRole) => void;
}

const roleCategories = [
  {
    title: 'Practice Administration',
    items: [
      {
        id: 'Practice Administrator',
        label: 'Practice Administrator',
        description: ROLE_DESCRIPTIONS['Practice Administrator']
      }
    ]
  },
  {
    title: 'Scheduling Access',
    items: [
      {
        id: 'Practice Scheduler',
        label: 'Practice Scheduler',
        description: ROLE_DESCRIPTIONS['Practice Scheduler']
      }
    ]
  },
  {
    title: 'Clinical Access',
    items: [
      {
        id: 'Clinician',
        label: 'Clinician',
        description: ROLE_DESCRIPTIONS['Clinician']
      },
      {
        id: 'Intern',
        label: 'Intern',
        displayName: 'Intern / Assistant / Associate',
        description: ROLE_DESCRIPTIONS['Intern']
      },
      {
        id: 'Supervisor',
        label: 'Supervisor',
        description: ROLE_DESCRIPTIONS['Supervisor']
      },
      {
        id: 'Clinical Administrator',
        label: 'Clinical Administrator',
        description: ROLE_DESCRIPTIONS['Clinical Administrator']
      }
    ]
  },
  {
    title: 'Billing Access',
    items: [
      {
        id: 'Biller for Assigned Patients Only',
        label: 'Biller for Assigned Patients Only',
        description: ROLE_DESCRIPTIONS['Biller for Assigned Patients Only']
      },
      {
        id: 'Practice Biller',
        label: 'Practice Biller',
        description: ROLE_DESCRIPTIONS['Practice Biller']
      }
    ]
  }
];

const RolesSection: React.FC<RolesSectionProps> = ({
  formData,
  onRoleToggle
}) => {
  const [showInstructions, setShowInstructions] = React.useState(false);

  return (
    <CategorySection
      title="Roles"
      description="Each user can have multiple roles. A user's roles determine what they can access within TherapyNotes."
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {roleCategories.map((category) => (
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
