
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, AlertTriangle, Eye, BookOpen } from 'lucide-react';

const SupervisionDashboard: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-t-lg">
          <CardTitle className="flex items-center space-x-2 text-blue-800">
            <Clock className="h-5 w-5" />
            <span>Upcoming Sessions</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {[
              { name: "Alex Johnson", time: "2:00 PM Today", type: "Individual", status: "confirmed" },
              { name: "Blake Wilson", time: "10:00 AM Tomorrow", type: "Group", status: "pending" },
              { name: "Casey Taylor", time: "3:30 PM Friday", type: "Case Review", status: "confirmed" }
            ].map((session, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border border-blue-100 hover:shadow-md transition-all duration-300">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {session.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{session.name}</p>
                    <p className="text-sm text-gray-600">{session.time} • {session.type}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge 
                    variant={session.status === 'confirmed' ? 'default' : 'secondary'}
                    className={session.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}
                  >
                    {session.status}
                  </Badge>
                  <Button size="sm" variant="outline" className="hover:bg-blue-50">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader className="bg-gradient-to-r from-red-50 to-pink-50 rounded-t-lg">
          <CardTitle className="flex items-center space-x-2 text-red-800">
            <AlertTriangle className="h-5 w-5" />
            <span>Priority Reviews</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {[
              { patient: "Jane Smith", supervisee: "Alex Johnson", type: "Progress Note", due: "Today", priority: "high" },
              { patient: "John Doe", supervisee: "Blake Wilson", type: "Treatment Plan", due: "Tomorrow", priority: "medium" },
              { patient: "Mary Johnson", supervisee: "Casey Taylor", type: "Assessment", due: "This Week", priority: "low" }
            ].map((review, index) => (
              <div key={index} className={`p-4 rounded-lg border-l-4 ${
                review.priority === 'high' ? 'bg-red-50 border-red-400' :
                review.priority === 'medium' ? 'bg-yellow-50 border-yellow-400' :
                'bg-blue-50 border-blue-400'
              } hover:shadow-md transition-all duration-300`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-800">{review.type} - {review.patient}</p>
                    <p className="text-sm text-gray-600">Supervisee: {review.supervisee}</p>
                    <p className="text-xs text-gray-500">Due: {review.due}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" className="hover:bg-blue-50">
                      <BookOpen className="h-4 w-4" />
                    </Button>
                    <Button size="sm" className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white">
                      Review
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SupervisionDashboard;
