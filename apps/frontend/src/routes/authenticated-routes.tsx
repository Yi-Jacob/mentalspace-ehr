import React from 'react';
import { Navigate, RouteObject } from 'react-router-dom';

// Import all route arrays
import Dashboard from '../pages/Dashboard';
import clientsRoutes from './clients-routes';
import notesRoutes from './notes-routes';
import schedulingRoutes from './scheduling-routes';
import messageRoutes from './message-routes';
import billingRoutes from './billing-routes';
import staffRoutes from './staff-routes';
import complianceRoutes from './compliance-routes';
import auditRoutes from './audit-routes';
import todoRoutes from './todo-routes';
import practiceSettingsRoutes from './practice-settings-routes';
import libraryRoutes from './library-routes';
import MyProfilePage from '../pages/my-profile';
import WorkScheduleManagement from '@/pages/work-schedule';

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
  // Notes
  {
    path: 'notes',
    children: notesRoutes,
  },
  // Scheduling
  {
    path: 'scheduling',
    children: schedulingRoutes,
  },
  {
    path: 'work-schedule',
    element: <WorkScheduleManagement />,
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
  // Audit
  {
    path: 'audit',
    children: auditRoutes,
  },
  // Todo
  {
    path: 'todo',
    children: todoRoutes,
  },
  // Practice Settings
  {
    path: 'practice-settings',
    children: practiceSettingsRoutes,
  },
  // Library
  {
    path: 'library',
    children: libraryRoutes,
  },
  // My Profile
  {
    path: 'my-profile',
    element: <MyProfilePage />,
  },
  {
    path: '*',
    element: <Navigate to="/404" replace />,
  },
];

export default authenticatedRoutes; 