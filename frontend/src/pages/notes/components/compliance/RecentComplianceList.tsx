
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp } from 'lucide-react';
import { format, subDays, isAfter } from 'date-fns';

interface Note {
  id: string;
  title: string;
  status: string;
  created_at: string;
  updated_at: string;
  clients?: { first_name: string; last_name: string };
  provider?: { first_name: string; last_name: string };
}

interface RecentComplianceListProps {
  notes: Note[];
}

const RecentComplianceList: React.FC<RecentComplianceListProps> = ({ notes }) => {
  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <TrendingUp className="h-5 w-5 text-purple-600" />
          <span>Recent Notes Compliance</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {notes.slice(0, 4).map((note) => {
          const isOverdue = note.status === 'draft' && 
            isAfter(subDays(new Date(), 7), new Date(note.updated_at));
          
          return (
            <div key={note.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <p className="font-medium text-gray-900">{note.title}</p>
                  <Badge 
                    className={`text-xs ${
                      note.status === 'signed' 
                        ? 'bg-green-100 text-green-800 border-green-200' 
                        : isOverdue 
                          ? 'bg-red-100 text-red-800 border-red-200'
                          : 'bg-yellow-100 text-yellow-800 border-yellow-200'
                    }`}
                  >
                    {note.status === 'signed' ? 'Signed' : isOverdue ? 'Overdue' : 'Pending'}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">
                  {note.clients?.first_name} {note.clients?.last_name} • 
                  Created: {format(new Date(note.created_at), 'MMM d, yyyy')}
                </p>
              </div>
              <div className="text-sm text-gray-500">
                {note.provider?.first_name} {note.provider?.last_name}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default RecentComplianceList;
