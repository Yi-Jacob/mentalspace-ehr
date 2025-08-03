
import React from 'react';
import { TextareaField } from '@/components/basic/textarea';
import CategorySection from '@/components/basic/CategorySection';

interface UserCommentsSectionProps {
  formData: any;
  onInputChange: (field: string, value: any) => void;
}

const UserCommentsSection: React.FC<UserCommentsSectionProps> = ({
  formData,
  onInputChange
}) => {
  return (
    <CategorySection
      title="User Comments"
      description="For info such as scheduling/billing comments. All users can see this. Conveniently visible in tooltips."
    >
      <TextareaField
        id="userComments"
        label="Comments"
        value={formData.userComments}
        onChange={(e) => onInputChange('userComments', e.target.value)}
        placeholder="For info such as scheduling/billing comments. All users can see this. Conveniently visible in tooltips."
        rows={4}
      />
    </CategorySection>
  );
};

export default UserCommentsSection;
