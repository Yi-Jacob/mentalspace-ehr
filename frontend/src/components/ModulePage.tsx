
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shared/ui/card';
import { Button } from '@/components/shared/ui/button';
import { ArrowRight, Plus } from 'lucide-react';

interface ModulePageProps {
  title: string;
  description: string;
  features: string[];
  comingSoon?: boolean;
}

const ModulePage: React.FC<ModulePageProps> = ({ title, description, features, comingSoon = true }) => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          <p className="text-gray-600 mt-2">{description}</p>
        </div>
        {!comingSoon && (
          <Button className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700">
            <Plus className="h-4 w-4 mr-2" />
            Add New
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-all duration-200 hover:transform hover:scale-105">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">{feature}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                {comingSoon ? 'This feature will be available soon.' : 'Manage and configure this feature.'}
              </p>
              <Button 
                variant="outline" 
                className="w-full group"
                disabled={comingSoon}
              >
                {comingSoon ? 'Coming Soon' : 'Configure'}
                {!comingSoon && <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {comingSoon && (
        <Card className="border-0 shadow-md bg-gradient-to-r from-blue-50 to-green-50">
          <CardContent className="p-6 text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              🚀 {title} Module Under Development
            </h3>
            <p className="text-gray-600">
              We're working hard to bring you the best {title.toLowerCase()} experience. 
              This module will include all the features you need to manage your practice efficiently.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ModulePage;
