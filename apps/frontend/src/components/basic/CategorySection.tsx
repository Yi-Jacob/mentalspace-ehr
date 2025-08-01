import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/basic/card';

interface CategorySectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  headerAction?: React.ReactNode;
}

const CategorySection: React.FC<CategorySectionProps> = ({
  title,
  description,
  children,
  className = "",
  headerAction
}) => {
  return (
    <Card className={`bg-white/80 backdrop-blur-sm border-white/20 shadow-lg ${className}`}>
      <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-t-lg">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold text-gray-800">{title}</CardTitle>
          {headerAction && headerAction}
        </div>
        {description && (
          <p className="text-sm text-gray-600 mt-2">
            {description}
          </p>
        )}
      </CardHeader>
      <CardContent className="p-6">
        {children}
      </CardContent>
    </Card>
  );
};

export default CategorySection; 