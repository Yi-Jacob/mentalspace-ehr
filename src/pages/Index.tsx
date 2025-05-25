
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from '@/components/Sidebar';
import Dashboard from '@/components/Dashboard';
import ModulePage from '@/components/ModulePage';
import ClientList from '@/components/ClientList';
import Documentation from '@/pages/Documentation';

const moduleConfigs = {
  clients: {
    title: 'Client Management',
    description: 'Manage patient records, demographics, and contact information',
    features: ['Patient Profiles', 'Demographics', 'Contact Management', 'Insurance Information', 'Medical History', 'Family History']
  },
  documentation: {
    title: 'Clinical Documentation',
    description: 'Create and manage clinical notes, treatment plans, and assessments',
    features: ['Intake Assessments', 'Progress Notes', 'Treatment Plans', 'Cancellation Notes', 'Contact Notes', 'Consultation Notes', 'Signing System', 'Approval Workflow', 'Compliance Tracking']
  },
  scheduling: {
    title: 'Appointment Scheduling',
    description: 'Schedule and manage appointments with integrated calendar',
    features: ['Calendar View', 'Appointment Booking', 'Recurring Appointments', 'Waitlist Management', 'Reminder Notifications', 'Resource Scheduling']
  },
  message: {
    title: 'Secure Messaging',
    description: 'HIPAA-compliant messaging system for staff and patient communication',
    features: ['Internal Messaging', 'Patient Portal Messages', 'Secure File Sharing', 'Message Templates', 'Automated Notifications', 'Message Archiving']
  },
  billing: {
    title: 'Billing & Payments',
    description: 'Comprehensive billing system with insurance claims management',
    features: ['Invoice Generation', 'Insurance Claims', 'Payment Processing', 'Co-pay Collection', 'Financial Reports', 'ERA Processing']
  },
  reports: {
    title: 'Analytics & Reports',
    description: 'Generate comprehensive reports and practice analytics',
    features: ['Financial Reports', 'Clinical Outcomes', 'Practice Analytics', 'Compliance Reports', 'Custom Dashboards', 'Data Export']
  },
  crm: {
    title: 'Customer Relationship Management',
    description: 'Manage referrals, leads, and practice growth opportunities',
    features: ['Lead Management', 'Referral Tracking', 'Marketing Campaigns', 'Follow-up Automation', 'Contact Database', 'Communication History']
  },
  staff: {
    title: 'Staff Management',
    description: 'Manage staff schedules, roles, and permissions',
    features: ['Staff Profiles', 'Role Management', 'Schedule Management', 'Time Tracking', 'Performance Metrics', 'Training Records']
  },
  compliance: {
    title: 'Compliance & Security',
    description: 'Ensure HIPAA compliance and data security',
    features: ['HIPAA Compliance', 'Audit Trails', 'Access Controls', 'Data Encryption', 'Security Monitoring', 'Compliance Reports']
  },
  settings: {
    title: 'Practice Settings',
    description: 'Configure practice preferences and system settings',
    features: ['Practice Information', 'User Management', 'System Preferences', 'Integration Settings', 'Backup Configuration', 'License Management']
  }
};

const Index = () => {
  const location = useLocation();
  const [activeModule, setActiveModule] = useState('dashboard');

  // Update active module based on current route
  useEffect(() => {
    if (location.pathname === '/documentation') {
      setActiveModule('documentation');
    } else if (location.pathname === '/') {
      setActiveModule('dashboard');
    }
  }, [location.pathname]);

  const renderContent = () => {
    if (activeModule === 'dashboard') {
      return <Dashboard />;
    }

    if (activeModule === 'clients') {
      return <ClientList />;
    }

    if (activeModule === 'documentation') {
      return <Documentation />;
    }

    const config = moduleConfigs[activeModule as keyof typeof moduleConfigs];
    if (config) {
      return (
        <ModulePage
          title={config.title}
          description={config.description}
          features={config.features}
          comingSoon={true}
        />
      );
    }

    return <Dashboard />;
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeItem={activeModule} onItemClick={setActiveModule} />
      <div className="flex-1 overflow-auto">
        {renderContent()}
      </div>
    </div>
  );
};

export default Index;
