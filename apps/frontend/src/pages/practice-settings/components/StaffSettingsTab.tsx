import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/basic/card';
import { LICENSE_TYPE_OPTIONS, ISSUED_BY_OPTIONS } from '@/types/enums/staffEnum';

const StaffSettingsTab: React.FC = () => {

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Available License Types</CardTitle>
          <CardDescription>
            Reference list of available professional license types for staff verification.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="max-h-96 overflow-y-auto">
            <div className="grid grid-cols-1 gap-2">
              {LICENSE_TYPE_OPTIONS.map((license) => (
                <div key={license.value} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                  <span className="font-mono text-blue-600">{license.value}</span>
                  <span className="text-gray-700">{license.label}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Issuing Authorities Reference */}
      <Card>
        <CardHeader>
          <CardTitle>Available Issuing Authorities</CardTitle>
          <CardDescription>
            Reference list of common licensing authorities for professional verification.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="max-h-96 overflow-y-auto">
            <div className="grid grid-cols-1 gap-2">
              {ISSUED_BY_OPTIONS.map((authority) => (
                <div key={authority.value} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                  <span className="font-mono text-green-600">{authority.value}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StaffSettingsTab;
