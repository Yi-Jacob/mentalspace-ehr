import React, { memo, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  User, 
  Calendar, 
  FileText, 
  Phone,
  Mail,
  MapPin,
  ChevronRight
} from 'lucide-react';
import { ClientFormData } from '@/types/client';

type Client = ClientFormData & {
  id: string;
  created_at?: string;
  updated_at?: string;
  phone_numbers?: Array<{ phone_number: string; phone_type: string }>;
};
import { useOptimizedImage, usePerformanceMonitoring } from '@/hooks/usePerformanceOptimization';

interface OptimizedClientCardProps {
  client: Client;
  onClick: (client: Client) => void;
  priority?: 'high' | 'normal' | 'low';
}

// Memoized client card for better performance with large lists
const OptimizedClientCard: React.FC<OptimizedClientCardProps> = memo(({ 
  client, 
  onClick, 
  priority = 'normal' 
}) => {
  const { trackInteraction } = usePerformanceMonitoring('ClientCard');

  // Optimize avatar image loading
  const { src: avatarSrc, loaded: avatarLoaded } = useOptimizedImage(
    `/api/placeholder/40/40?text=${client.first_name?.[0] || 'U'}`,
    { width: 40, height: 40, quality: 80 }
  );

  // Memoize computed values to prevent unnecessary recalculations
  const clientInfo = useMemo(() => {
    const fullName = `${client.first_name || ''} ${client.last_name || ''}`.trim();
    const age = client.date_of_birth 
      ? new Date().getFullYear() - new Date(client.date_of_birth).getFullYear()
      : null;
    
    return {
      fullName: fullName || 'Unknown Client',
      age,
      initials: `${client.first_name?.[0] || ''}${client.last_name?.[0] || ''}`.toUpperCase()
    };
  }, [client.first_name, client.last_name, client.date_of_birth]);

  // Memoize contact info to prevent recalculation
  const contactInfo = useMemo(() => {
    const primaryPhone = client.phone_numbers?.find(p => p.phone_type === 'mobile') 
      || client.phone_numbers?.[0];
    
    return {
      email: client.email,
      phone: primaryPhone?.phone_number,
      address: [client.address_1, client.city, client.state].filter(Boolean).join(', ')
    };
  }, [client.email, client.phone_numbers, client.address_1, client.city, client.state]);

  const handleClick = () => {
    const endTracking = trackInteraction('client_card_click', clientInfo.fullName);
    onClick(client);
    endTracking();
  };

  return (
    <Card 
      className={`cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.02] ${
        priority === 'high' ? 'border-primary' : ''
      }`}
      onClick={handleClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* Optimized avatar with lazy loading */}
            <div className="relative">
              {avatarLoaded ? (
                <img 
                  src={avatarSrc} 
                  alt={clientInfo.fullName}
                  className="w-10 h-10 rounded-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-sm font-medium text-primary">
                    {clientInfo.initials}
                  </span>
                </div>
              )}
              
              {/* Status indicator */}
              <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-background ${
                client.is_active ? 'bg-green-500' : 'bg-gray-400'
              }`} />
            </div>

            <div className="min-w-0 flex-1">
              <CardTitle className="text-lg font-semibold truncate">
                {clientInfo.fullName}
              </CardTitle>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                {clientInfo.age && (
                  <span>{clientInfo.age} years old</span>
                )}
                {client.assigned_clinician_id && (
                  <>
                    <span>•</span>
                    <Badge variant="outline" className="text-xs">
                      Assigned
                    </Badge>
                  </>
                )}
              </div>
            </div>
          </div>

          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Contact Information */}
        <div className="space-y-2">
          {contactInfo.email && (
            <div className="flex items-center space-x-2 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="truncate">{contactInfo.email}</span>
            </div>
          )}
          
          {contactInfo.phone && (
            <div className="flex items-center space-x-2 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{contactInfo.phone}</span>
            </div>
          )}
          
          {contactInfo.address && (
            <div className="flex items-center space-x-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="truncate">{contactInfo.address}</span>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t">
          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Calendar className="h-3 w-3" />
              <span>Last: {new Date(client.updated_at || client.created_at || '').toLocaleDateString()}</span>
            </div>
          </div>
          
          {priority === 'high' && (
            <Badge variant="secondary" className="text-xs">
              Priority
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
});

OptimizedClientCard.displayName = 'OptimizedClientCard';

export default OptimizedClientCard;