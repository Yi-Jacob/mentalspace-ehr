import React from 'react';
import { Link } from 'react-router-dom';
import PageLayout from '@/components/basic/PageLayout';
import PageHeader from '@/components/basic/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/basic/card';
import { Users, Shield, Settings } from 'lucide-react';

const UsersPage: React.FC = () => {
  return (
    <PageLayout variant="gradient">
      <PageHeader
        icon={Users}
        title="User Management"
        description="Manage user roles, permissions, and access controls"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Roles Card */}
        <Link to="/users/roles" className="group">
          <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 transform border-0 bg-gradient-to-r from-white to-blue-50/30">
            <CardHeader className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-t-lg">
              <CardTitle className="flex items-center space-x-2 text-xl">
                <Shield className="h-6 w-6" />
                <span>Roles</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-gray-600 group-hover:text-gray-800 transition-colors">
                Manage user roles and assign permissions to different user types. 
                Define what actions each role can perform within the system.
              </p>
              <div className="mt-4 flex items-center text-indigo-600 group-hover:text-indigo-800 transition-colors">
                <span className="text-sm font-medium">Manage Roles</span>
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Permissions Card */}
        <Link to="/users/permissions" className="group">
          <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 transform border-0 bg-gradient-to-r from-white to-green-50/30">
            <CardHeader className="bg-gradient-to-r from-green-500 via-teal-500 to-blue-500 text-white rounded-t-lg">
              <CardTitle className="flex items-center space-x-2 text-xl">
                <Settings className="h-6 w-6" />
                <span>Permissions</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-gray-600 group-hover:text-gray-800 transition-colors">
                Configure detailed permissions for different features and modules. 
                Control access to specific functionality across the application.
              </p>
              <div className="mt-4 flex items-center text-green-600 group-hover:text-green-800 transition-colors">
                <span className="text-sm font-medium">Manage Permissions</span>
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </PageLayout>
  );
};

export default UsersPage;
