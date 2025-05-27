
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileCheck, Filter, Search, UserCheck, Users, Calendar, Clock, Target, Timer, BookOpen, MessageSquare, CheckCircle, AlertTriangle, BarChart3, Sparkles } from 'lucide-react';

const SupervisionReviews: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Review Queue */}
      <div className="lg:col-span-2">
        <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-t-lg">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2 text-yellow-800">
                <FileCheck className="h-5 w-5" />
                <span>Review Queue</span>
              </CardTitle>
              <div className="flex items-center space-x-2">
                <Button size="sm" variant="outline" className="hover:bg-yellow-50">
                  <Filter className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" className="hover:bg-yellow-50">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {[
                { 
                  patient: "Jane Smith", 
                  supervisee: "Alex Johnson", 
                  type: "Progress Note", 
                  date: "2024-01-15",
                  due: "Today", 
                  priority: "high",
                  service: "Individual Therapy",
                  duration: "50 min"
                },
                { 
                  patient: "John Doe", 
                  supervisee: "Blake Wilson", 
                  type: "Treatment Plan", 
                  date: "2024-01-14",
                  due: "Tomorrow", 
                  priority: "medium",
                  service: "Family Therapy",
                  duration: "90 min"
                },
                { 
                  patient: "Mary Johnson", 
                  supervisee: "Casey Taylor", 
                  type: "Assessment", 
                  date: "2024-01-13",
                  due: "This Week", 
                  priority: "low",
                  service: "Initial Assessment",
                  duration: "60 min"
                },
                { 
                  patient: "Robert Brown", 
                  supervisee: "Alex Johnson", 
                  type: "Discharge Summary", 
                  date: "2024-01-12",
                  due: "Friday", 
                  priority: "medium",
                  service: "Group Therapy",
                  duration: "75 min"
                }
              ].map((review, index) => (
                <div key={index} className={`group p-6 rounded-xl border-l-4 transition-all duration-300 hover:shadow-lg hover:scale-102 ${
                  review.priority === 'high' ? 'bg-gradient-to-r from-red-50 to-pink-50 border-red-400' :
                  review.priority === 'medium' ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-400' :
                  'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-400'
                }`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-bold text-lg text-gray-800">{review.type}</h3>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${
                            review.priority === 'high' ? 'bg-red-100 text-red-800' :
                            review.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {review.priority}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-sm">
                          <UserCheck className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-600">Patient: <span className="font-semibold text-gray-800">{review.patient}</span></span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                          <Users className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-600">Supervisee: <span className="font-semibold text-gray-800">{review.supervisee}</span></span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{review.date}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>{review.duration}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Target className="h-4 w-4" />
                            <span>{review.service}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                          <Timer className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-600">Due: <span className={`font-semibold ${
                            review.due === 'Today' ? 'text-red-600' : 'text-gray-800'
                          }`}>{review.due}</span></span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Button size="sm" variant="outline" className="hover:bg-gray-50">
                        <BookOpen className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" className="hover:bg-gray-50">
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                      <Button size="sm" className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white">
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Review Stats */}
      <div className="space-y-6">
        <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 rounded-t-lg">
            <CardTitle className="flex items-center space-x-2 text-orange-800">
              <BarChart3 className="h-5 w-5" />
              <span>Review Metrics</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="text-center p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-lg">
                <div className="text-3xl font-bold text-red-600">5</div>
                <div className="text-sm text-red-700 font-medium">Pending Reviews</div>
              </div>

              <div className="text-center p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg">
                <div className="text-3xl font-bold text-yellow-600">2.3</div>
                <div className="text-sm text-yellow-700 font-medium">Avg. Days to Review</div>
              </div>

              <div className="text-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                <div className="text-3xl font-bold text-green-600">94%</div>
                <div className="text-sm text-green-700 font-medium">On-Time Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-t-lg">
            <CardTitle className="flex items-center space-x-2 text-purple-800">
              <Sparkles className="h-5 w-5" />
              <span>Quick Review</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-3">
              <Button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white justify-start">
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve All Compliant
              </Button>
              <Button variant="outline" className="w-full justify-start hover:bg-purple-50">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Flag for Changes
              </Button>
              <Button variant="outline" className="w-full justify-start hover:bg-purple-50">
                <FileCheck className="h-4 w-4 mr-2" />
                Bulk Review
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SupervisionReviews;
