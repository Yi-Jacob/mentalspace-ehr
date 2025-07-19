
import React from 'react';
import { Button } from '@/components/shared/ui/button';
import { 
  Monitor, 
  Video, 
  MessageSquare, 
  Bell, 
  Calendar,
  MapPin
} from 'lucide-react';

interface PortalNavigationButtonsProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const PortalNavigationButtons: React.FC<PortalNavigationButtonsProps> = ({ activeSection, onSectionChange }) => {
  const sectionButtons = [
    { id: 'portal', label: 'Client Portal', icon: Monitor },
    { id: 'telehealth', label: 'Telehealth', icon: Video },
    { id: 'messaging', label: 'Secure Messaging', icon: MessageSquare },
    { id: 'reminders', label: 'Reminders', icon: Bell },
    { id: 'calendar', label: 'Calendar Sync', icon: Calendar },
    { id: 'locations', label: 'Locations', icon: MapPin },
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {sectionButtons.map((section) => {
        const IconComponent = section.icon;
        return (
          <Button
            key={section.id}
            variant={activeSection === section.id ? "default" : "outline"}
            size="sm"
            onClick={() => onSectionChange(section.id)}
            className="flex items-center space-x-2"
          >
            <IconComponent className="h-4 w-4" />
            <span>{section.label}</span>
          </Button>
        );
      })}
    </div>
  );
};

export default PortalNavigationButtons;
