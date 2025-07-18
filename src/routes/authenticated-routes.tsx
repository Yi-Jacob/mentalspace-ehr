import React from 'react';
import { Navigate, RouteObject } from 'react-router-dom';

// Import all route arrays
import Dashboard from '../pages/Dashboard';
import clientsRoutes from './clients-routes';
import documentationRoutes from './documentation-routes';
import schedulingRoutes from './scheduling-routes';
import messageRoutes from './message-routes';
import billingRoutes from './billing-routes';
import reportsRoutes from './reports-routes';
import crmRoutes from './crm-routes';
import staffRoutes from './staff-routes';
import complianceRoutes from './compliance-routes';
import practiceSettingRoutes from './practice-setting-routes';

const authenticatedRoutes: RouteObject[] = [
  // Dashboard (index route)
  {
    index: true,
    element: <Dashboard />,
  },
  // Clients
  {
    path: 'clients',
    children: clientsRoutes,
  },
  // Documentation
  {
    path: 'documentation',
    children: documentationRoutes,
  },
  // Scheduling
  {
    path: 'scheduling',
    children: schedulingRoutes,
  },
  // Messaging
  {
    path: 'message',
    children: messageRoutes,
  },
  // Billing
  {
    path: 'billing',
    children: billingRoutes,
  },
  // Reports
  {
    path: 'reports',
    children: reportsRoutes,
  },
  // CRM
  {
    path: 'crm',
    children: crmRoutes,
  },
  // Staff
  {
    path: 'staff',
    children: staffRoutes,
  },
  // Compliance
  {
    path: 'compliance',
    children: complianceRoutes,
  },
  // Practice Settings
  {
    path: 'settings',
    children: practiceSettingRoutes,
  },
  {
    path: '*',
    element: <Navigate to="/404" replace />,
  },
];

export default authenticatedRoutes; 