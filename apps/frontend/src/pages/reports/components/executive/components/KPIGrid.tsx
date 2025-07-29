
import React from 'react';
import { DollarSign, Users, Calendar, FileText } from 'lucide-react';
import KPICard from './KPICard';
import { ExecutiveDashboardData } from '@/hooks/useReportData';

interface KPIGridProps {
  dashboardData: ExecutiveDashboardData;
}

const KPIGrid: React.FC<KPIGridProps> = ({ dashboardData }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <KPICard
        title="Total Revenue"
        value={dashboardData.totalRevenue}
        change={dashboardData.revenueChange}
        icon={DollarSign}
        format="currency"
      />
      <KPICard
        title="Active Patients"
        value={dashboardData.totalPatients}
        change={dashboardData.patientsChange}
        icon={Users}
      />
      <KPICard
        title="Appointments Completed"
        value={dashboardData.appointmentsCompleted}
        change={dashboardData.appointmentsChange}
        icon={Calendar}
      />
      <KPICard
        title="Notes Completed"
        value={dashboardData.notesCompleted}
        change={dashboardData.notesChange}
        icon={FileText}
      />
    </div>
  );
};

export default KPIGrid;
