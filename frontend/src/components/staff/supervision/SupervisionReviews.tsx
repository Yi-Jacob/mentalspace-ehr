
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileCheck, Filter, Search, UserCheck, Users, Calendar, Clock, Target, Timer, BookOpen, MessageSquare, CheckCircle, AlertTriangle, BarChart3, Sparkles, TrendingUp, Award } from 'lucide-react';

const SupervisionReviews: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Review Queue */}
      <div className="lg:col-span-2">
        <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in">
          <CardHeader className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-t-lg border-b border-yellow-100">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2 text-yellow-800">
                <div className="p-2 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg shadow-lg">
                  <FileCheck className="h-5 w-5 text-white" />
                </div>
                <span className="bg-gradient-to-r from-yellow-700 to-orange-700 bg-clip-text text-transparent font-bold">
                  Co-signing Queue
                </span>
              </CardTitle>
              <div className="flex items-center space-x-2">
                <Button size="sm" variant="outline" className="hover:bg-yellow-50 border-yellow-200 group">
                  <Filter className="h-4 w-4 group-hover:rotate-12 transition-transform duration-300" />
                </Button>
                <Button size="sm" variant="outline" className="hover:bg-yellow-50 border-yellow-200 group">
                  <Search className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
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
                  duration: "50 min",
                  avatar: "AJ"
                },
                { 
                  patient: "John Doe", 
                  supervisee: "Blake Wilson", 
                  type: "Treatment Plan", 
                  date: "2024-01-14",
                  due: "Tomorrow", 
                  priority: "medium",
                  service: "Family Therapy",
                  duration: "90 min",
                  avatar: "BW"
                },
                { 
                  patient: "Mary Johnson", 
                  supervisee: "Casey Taylor", 
                  type: "Assessment", 
                  date: "2024-01-13",
                  due: "This Week", 
                  priority: "low",
                  service: "Initial Assessment",
                  duration: "60 min",
                  avatar: "CT"
                },
                { 
                  patient: "Robert Brown", 
                  supervisee: "Alex Johnson", 
                  type: "Discharge Summary", 
                  date: "2024-01-12",
                  due: "Friday", 
                  priority: "medium",
                  service: "Group Therapy",
                  duration: "75 min",
                  avatar: "AJ"
                }
              ].map((review, index) => (
                <div key={index} className={`group p-6 rounded-xl border-l-4 transition-all duration-300 hover:shadow-lg hover:scale-102 animate-fade-in ${
                  review.priority === 'high' ? 'bg-gradient-to-r from-red-50 to-pink-50 border-red-400' :
                  review.priority === 'medium' ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-400' :
                  'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-400'
                }`} style={{ animationDelay: `${index * 100}ms` }}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className={`w-10 h-10 bg-gradient-to-br ${
                          review.priority === 'high' ? 'from-red-500 to-pink-600' :
                          review.priority === 'medium' ? 'from-yellow-500 to-orange-600' :
                          'from-blue-500 to-indigo-600'
                        } rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg group-hover:rotate-6 transition-transform duration-300`}>
                          {review.avatar}
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-gray-800">{review.type}</h3>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${
                              review.priority === 'high' ? 'bg-red-100 text-red-800 border-red-300' :
                              review.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 border-yellow-300' :
                              'bg-blue-100 text-blue-800 border-blue-300'
                            }`}
                          >
                            {review.priority} priority
                          </Badge>
                        </div>
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
                    
                    <div className="flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
                      <Button size="sm" variant="outline" className="hover:bg-gray-50 border-gray-200">
                        <BookOpen className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" className="hover:bg-gray-50 border-gray-200">
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                      <Button size="sm" className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg">
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
        <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in">
          <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 rounded-t-lg border-b border-orange-100">
            <CardTitle className="flex items-center space-x-2 text-orange-800">
              <div className="p-2 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg shadow-lg">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              <span className="bg-gradient-to-r from-orange-700 to-red-700 bg-clip-text text-transparent font-bold">
                Review Metrics
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="text-center p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-lg hover:shadow-md transition-all duration-300 group">
                <div className="text-3xl font-bold text-red-600 group-hover:scale-110 transition-transform duration-300">5</div>
                <div className="text-sm text-red-700 font-medium">Pending Reviews</div>
                <div className="w-full bg-red-200 rounded-full h-1 mt-2">
                  <div className="bg-red-500 h-1 rounded-full w-3/4 animate-pulse"></div>
                </div>
              </div>

              <div className="text-center p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg hover:shadow-md transition-all duration-300 group">
                <div className="text-3xl font-bold text-yellow-600 group-hover:scale-110 transition-transform duration-300">2.3</div>
                <div className="text-sm text-yellow-700 font-medium">Avg. Days to Review</div>
                <div className="w-full bg-yellow-200 rounded-full h-1 mt-2">
                  <div className="bg-yellow-500 h-1 rounded-full w-1/2"></div>
                </div>
              </div>

              <div className="text-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg hover:shadow-md transition-all duration-300 group">
                <div className="text-3xl font-bold text-green-600 group-hover:scale-110 transition-transform duration-300">94%</div>
                <div className="text-sm text-green-700 font-medium">On-Time Rate</div>
                <div className="w-full bg-green-200 rounded-full h-1 mt-2">
                  <div className="bg-green-500 h-1 rounded-full w-11/12"></div>
                </div>
              </div>

              <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg hover:shadow-md transition-all duration-300 group">
                <div className="text-3xl font-bold text-purple-600 group-hover:scale-110 transition-transform duration-300">4.8</div>
                <div className="text-sm text-purple-700 font-medium">Quality Score</div>
                <div className="w-full bg-purple-200 rounded-full h-1 mt-2">
                  <div className="bg-purple-500 h-1 rounded-full w-5/6"></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-t-lg border-b border-purple-100">
            <CardTitle className="flex items-center space-x-2 text-purple-800">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg shadow-lg">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="bg-gradient-to-r from-purple-700 to-indigo-700 bg-clip-text text-transparent font-bold">
                Quick Review
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-3">
              <Button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white justify-start shadow-lg hover:shadow-xl transition-all duration-300 group">
                <CheckCircle className="h-4 w-4 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                Approve All Compliant
              </Button>
              <Button variant="outline" className="w-full justify-start hover:bg-purple-50 border-purple-200 group">
                <AlertTriangle className="h-4 w-4 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                Flag for Changes
              </Button>
              <Button variant="outline" className="w-full justify-start hover:bg-purple-50 border-purple-200 group">
                <FileCheck className="h-4 w-4 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                Bulk Review
              </Button>
              <Button variant="outline" className="w-full justify-start hover:bg-purple-50 border-purple-200 group">
                <TrendingUp className="h-4 w-4 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                View Analytics
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SupervisionReviews;
