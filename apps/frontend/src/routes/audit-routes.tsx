import React from 'react';
import { RouteObject } from 'react-router-dom';
import AuditLogsPage from '../pages/audit/AuditLogsPage/index';
import AuditStatsPage from '../pages/audit/AuditStatsPage/index';

const auditRoutes: RouteObject[] = [
  {
    index: true,
    element: <AuditLogsPage />,
  },
  {
    path: 'logs',
    element: <AuditLogsPage />,
  },
  {
    path: 'stats',
    element: <AuditStatsPage />,
  },
];

export default auditRoutes;
