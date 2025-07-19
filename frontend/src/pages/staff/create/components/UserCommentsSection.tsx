
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

interface UserCommentsSectionProps {
  formData: any;
  onInputChange: (field: string, value: any) => void;
}

const UserCommentsSection: React.FC<UserCommentsSectionProps> = ({
  formData,
  onInputChange
}) => {
  return (
    <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-t-lg">
        <CardTitle className="text-xl font-semibold text-gray-800">User Comments</CardTitle>
        <p className="text-sm text-gray-600 mt-2">
          For info such as scheduling/billing comments. All users can see this. Conveniently visible in tooltips.
        </p>
      </CardHeader>
      <CardContent className="p-6">
        <Textarea
          value={formData.user_comments}
          onChange={(e) => onInputChange('user_comments', e.target.value)}
          placeholder="For info such as scheduling/billing comments. All users can see this. Conveniently visible in tooltips."
          className="bg-white/90 border-gray-200 focus:border-blue-400 transition-colors min-h-[100px]"
        />
      </CardContent>
    </Card>
  );
};

export default UserCommentsSection;
