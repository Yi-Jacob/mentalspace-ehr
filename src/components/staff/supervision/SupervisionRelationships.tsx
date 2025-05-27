
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Eye, MessageSquare, ChevronRight, Star, Clock, Plus, Calendar, FileText, BarChart3, Zap, Award } from 'lucide-react';

const SupervisionRelationships: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Active Relationships */}
      <div className="lg:col-span-2">
        <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-lg">
            <CardTitle className="flex items-center space-x-2 text-green-800">
              <Users className="h-5 w-5" />
              <span>Active Supervision Relationships</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {[
                { 
                  name: "Alex Johnson", 
                  role: "Clinical Intern", 
                  startDate: "January 2024", 
                  type: "Clinical Supervision",
                  hours: "45/200",
                  nextSession: "Today 2:00 PM",
                  status: "active",
                  avatar: "AJ",
                  progress: 22.5
                },
                { 
                  name: "Blake Wilson", 
                  role: "Associate Therapist", 
                  startDate: "March 2024", 
                  type: "Administrative Supervision",
                  hours: "20/100",
                  nextSession: "Tomorrow 10:00 AM",
                  status: "active",
                  avatar: "BW",
                  progress: 20
                },
                { 
                  name: "Casey Taylor", 
                  role: "Assistant Counselor", 
                  startDate: "February 2024", 
                  type: "Clinical Supervision",
                  hours: "85/150",
                  nextSession: "Friday 3:30 PM",
                  status: "active",
                  avatar: "CT",
                  progress: 56.7
                }
              ].map((person, index) => (
                <div key={index} className="group p-6 bg-gradient-to-r from-gray-50 to-green-50 rounded-xl border border-green-100 hover:shadow-lg hover:scale-102 transition-all duration-300">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="relative">
                        <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                          {person.avatar}
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                          <Star className="h-3 w-3 text-white" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-bold text-lg text-gray-800">{person.name}</h3>
                          <Badge variant="outline" className="bg-green-100 text-green-800 text-xs">
                            {person.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 font-medium">{person.role}</p>
                        <p className="text-xs text-gray-500 mt-1">Started: {person.startDate}</p>
                        
                        <div className="mt-4 space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Supervision Hours</span>
                            <span className="font-semibold text-gray-800">{person.hours}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full transition-all duration-500" 
                              style={{ width: `${person.progress}%` }}
                            />
                          </div>
                          <div className="flex items-center space-x-2 text-xs text-gray-500">
                            <Clock className="h-3 w-3" />
                            <span>Next: {person.nextSession}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Button size="sm" variant="outline" className="hover:bg-green-50">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" className="hover:bg-green-50">
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                      <Button size="sm" className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white">
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Relationship Stats */}
      <div className="space-y-6">
        <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-t-lg">
            <CardTitle className="flex items-center space-x-2 text-indigo-800">
              <BarChart3 className="h-5 w-5" />
              <span>Supervision Stats</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <Users className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm font-medium">Total Supervisees</span>
                </div>
                <span className="text-xl font-bold text-blue-800">3</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                    <Clock className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm font-medium">Hours This Month</span>
                </div>
                <span className="text-xl font-bold text-green-800">24</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-yellow-600 rounded-full flex items-center justify-center">
                    <Award className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm font-medium">Completion Rate</span>
                </div>
                <span className="text-xl font-bold text-yellow-800">94%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="bg-gradient-to-r from-pink-50 to-red-50 rounded-t-lg">
            <CardTitle className="flex items-center space-x-2 text-pink-800">
              <Zap className="h-5 w-5" />
              <span>Quick Actions</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-3">
              <Button className="w-full bg-gradient-to-r from-pink-600 to-red-600 hover:from-pink-700 hover:to-red-700 text-white justify-start">
                <Plus className="h-4 w-4 mr-2" />
                Add New Supervisee
              </Button>
              <Button variant="outline" className="w-full justify-start hover:bg-pink-50">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Group Session
              </Button>
              <Button variant="outline" className="w-full justify-start hover:bg-pink-50">
                <FileText className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SupervisionRelationships;
