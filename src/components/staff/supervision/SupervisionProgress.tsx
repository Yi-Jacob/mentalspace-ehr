
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Award, TrendingUp, Target, Users, Calendar, CheckCircle, AlertTriangle, Clock, BarChart3, Zap, Star, Heart, BookOpen, ArrowUp, ArrowDown, Activity } from 'lucide-react';

const SupervisionProgress: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Progress Overview */}
      <div className="lg:col-span-2">
        <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-t-lg border-b border-purple-100">
            <CardTitle className="flex items-center space-x-2 text-purple-800">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg shadow-lg">
                <Award className="h-5 w-5 text-white" />
              </div>
              <span className="bg-gradient-to-r from-purple-700 to-indigo-700 bg-clip-text text-transparent font-bold">
                Supervisee Progress Overview
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              {[
                {
                  name: "Alex Johnson",
                  role: "Clinical Intern",
                  avatar: "AJ",
                  totalHours: 300,
                  completedHours: 180,
                  status: "on_track",
                  color: "blue",
                  competencies: [
                    { name: "Clinical Assessment", progress: 85, trend: "up" },
                    { name: "Treatment Planning", progress: 78, trend: "up" },
                    { name: "Documentation", progress: 92, trend: "stable" },
                    { name: "Ethics & Legal", progress: 88, trend: "up" }
                  ],
                  nextMilestone: "Mid-term Evaluation",
                  daysToMilestone: 14
                },
                {
                  name: "Blake Wilson",
                  role: "Associate Therapist",
                  avatar: "BW",
                  totalHours: 200,
                  completedHours: 120,
                  status: "at_risk",
                  color: "orange",
                  competencies: [
                    { name: "Group Facilitation", progress: 65, trend: "down" },
                    { name: "Crisis Intervention", progress: 72, trend: "up" },
                    { name: "Family Therapy", progress: 58, trend: "down" },
                    { name: "Professional Development", progress: 80, trend: "stable" }
                  ],
                  nextMilestone: "Competency Review",
                  daysToMilestone: 7
                },
                {
                  name: "Casey Taylor",
                  role: "Assistant Counselor",
                  avatar: "CT",
                  totalHours: 150,
                  completedHours: 125,
                  status: "excellent",
                  color: "green",
                  competencies: [
                    { name: "Individual Counseling", progress: 95, trend: "up" },
                    { name: "Case Management", progress: 90, trend: "stable" },
                    { name: "Report Writing", progress: 88, trend: "up" },
                    { name: "Client Engagement", progress: 93, trend: "up" }
                  ],
                  nextMilestone: "Final Assessment",
                  daysToMilestone: 21
                }
              ].map((supervisee, index) => (
                <div key={index} className="group p-6 bg-gradient-to-r from-gray-50 to-purple-50 rounded-xl border border-purple-100 hover:shadow-lg hover:scale-102 transition-all duration-300 animate-fade-in" style={{ animationDelay: `${index * 150}ms` }}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <div className={`w-16 h-16 bg-gradient-to-br ${
                          supervisee.color === 'blue' ? 'from-blue-500 to-indigo-600' :
                          supervisee.color === 'orange' ? 'from-orange-500 to-red-600' :
                          'from-green-500 to-emerald-600'
                        } rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg transform group-hover:rotate-6 transition-transform duration-300`}>
                          {supervisee.avatar}
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-bounce">
                          <Star className="h-3 w-3 text-white" />
                        </div>
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-gray-800">{supervisee.name}</h3>
                        <p className="text-sm text-gray-600 font-medium">{supervisee.role}</p>
                        <Badge 
                          variant="outline" 
                          className={`text-xs mt-1 ${
                            supervisee.status === 'excellent' ? 'bg-green-100 text-green-800 border-green-300' :
                            supervisee.status === 'on_track' ? 'bg-blue-100 text-blue-800 border-blue-300' :
                            'bg-orange-100 text-orange-800 border-orange-300'
                          }`}
                        >
                          {supervisee.status === 'excellent' ? 'Excellent Progress' :
                           supervisee.status === 'on_track' ? 'On Track' : 'Needs Attention'}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-800">{Math.round((supervisee.completedHours / supervisee.totalHours) * 100)}%</div>
                      <div className="text-sm text-gray-600">Complete</div>
                      <div className="text-xs text-gray-500 mt-1">{supervisee.completedHours}/{supervisee.totalHours} hours</div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600 flex items-center space-x-1">
                          <Heart className="h-3 w-3" />
                          <span>Overall Progress</span>
                        </span>
                        <span className="font-semibold text-gray-800">{supervisee.completedHours}/{supervisee.totalHours} hours</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className={`bg-gradient-to-r ${
                            supervisee.color === 'blue' ? 'from-blue-500 to-indigo-600' :
                            supervisee.color === 'orange' ? 'from-orange-500 to-red-600' :
                            'from-green-500 to-emerald-600'
                          } h-3 rounded-full transition-all duration-500 hover:shadow-lg`} 
                          style={{ width: `${(supervisee.completedHours / supervisee.totalHours) * 100}%` }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {supervisee.competencies.map((competency, compIndex) => (
                        <div key={compIndex} className="space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-600 font-medium">{competency.name}</span>
                            <div className="flex items-center space-x-1">
                              <span className="font-semibold">{competency.progress}%</span>
                              {competency.trend === 'up' && <ArrowUp className="h-3 w-3 text-green-500" />}
                              {competency.trend === 'down' && <ArrowDown className="h-3 w-3 text-red-500" />}
                              {competency.trend === 'stable' && <Activity className="h-3 w-3 text-gray-500" />}
                            </div>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div 
                              className={`bg-gradient-to-r ${
                                competency.progress >= 80 ? 'from-green-500 to-emerald-600' :
                                competency.progress >= 60 ? 'from-yellow-500 to-orange-600' :
                                'from-red-500 to-pink-600'
                              } h-1.5 rounded-full transition-all duration-500`} 
                              style={{ width: `${competency.progress}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg">
                      <div className="flex items-center space-x-2 text-sm">
                        <Calendar className="h-4 w-4 text-indigo-600" />
                        <span className="text-gray-700">Next Milestone: <span className="font-semibold">{supervisee.nextMilestone}</span></span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <Clock className="h-4 w-4 text-indigo-600" />
                        <span className="text-gray-700">In <span className="font-semibold">{supervisee.daysToMilestone} days</span></span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Analytics */}
      <div className="space-y-6">
        <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in">
          <CardHeader className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-t-lg border-b border-teal-100">
            <CardTitle className="flex items-center space-x-2 text-teal-800">
              <div className="p-2 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-lg shadow-lg">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              <span className="bg-gradient-to-r from-teal-700 to-cyan-700 bg-clip-text text-transparent font-bold">
                Progress Analytics
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="text-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg hover:shadow-md transition-all duration-300 group">
                <div className="text-3xl font-bold text-green-600 group-hover:scale-110 transition-transform duration-300">83%</div>
                <div className="text-sm text-green-700 font-medium">Avg. Completion Rate</div>
                <div className="w-full bg-green-200 rounded-full h-1 mt-2">
                  <div className="bg-green-500 h-1 rounded-full w-5/6"></div>
                </div>
              </div>

              <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg hover:shadow-md transition-all duration-300 group">
                <div className="text-3xl font-bold text-blue-600 group-hover:scale-110 transition-transform duration-300">87%</div>
                <div className="text-sm text-blue-700 font-medium">Competency Score</div>
                <div className="w-full bg-blue-200 rounded-full h-1 mt-2">
                  <div className="bg-blue-500 h-1 rounded-full w-11/12"></div>
                </div>
              </div>

              <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg hover:shadow-md transition-all duration-300 group">
                <div className="text-3xl font-bold text-purple-600 group-hover:scale-110 transition-transform duration-300">2.1</div>
                <div className="text-sm text-purple-700 font-medium">Weeks Ahead of Schedule</div>
                <div className="w-full bg-purple-200 rounded-full h-1 mt-2">
                  <div className="bg-purple-500 h-1 rounded-full w-3/4"></div>
                </div>
              </div>

              <div className="text-center p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg hover:shadow-md transition-all duration-300 group">
                <div className="text-3xl font-bold text-orange-600 group-hover:scale-110 transition-transform duration-300">4.6</div>
                <div className="text-sm text-orange-700 font-medium">Supervisor Rating</div>
                <div className="w-full bg-orange-200 rounded-full h-1 mt-2">
                  <div className="bg-orange-500 h-1 rounded-full w-11/12"></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in">
          <CardHeader className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-t-lg border-b border-emerald-100">
            <CardTitle className="flex items-center space-x-2 text-emerald-800">
              <div className="p-2 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg shadow-lg">
                <Target className="h-5 w-5 text-white" />
              </div>
              <span className="bg-gradient-to-r from-emerald-700 to-green-700 bg-clip-text text-transparent font-bold">
                Progress Goals
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg hover:shadow-md transition-all duration-300 group">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-gray-700">Monthly Reviews</span>
                </div>
                <span className="text-lg font-bold text-green-600">3/3</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg hover:shadow-md transition-all duration-300 group">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">Active Supervisees</span>
                </div>
                <span className="text-lg font-bold text-blue-600">3/5</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg hover:shadow-md transition-all duration-300 group">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm font-medium text-gray-700">At-Risk Cases</span>
                </div>
                <span className="text-lg font-bold text-yellow-600">1/3</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in">
          <CardHeader className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-t-lg border-b border-pink-100">
            <CardTitle className="flex items-center space-x-2 text-pink-800">
              <div className="p-2 bg-gradient-to-br from-pink-500 to-rose-600 rounded-lg shadow-lg">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <span className="bg-gradient-to-r from-pink-700 to-rose-700 bg-clip-text text-transparent font-bold">
                Quick Actions
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-3">
              <Button className="w-full bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white justify-start shadow-lg hover:shadow-xl transition-all duration-300 group">
                <TrendingUp className="h-4 w-4 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                Generate Progress Report
              </Button>
              <Button variant="outline" className="w-full justify-start hover:bg-pink-50 border-pink-200 group">
                <BookOpen className="h-4 w-4 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                Schedule Evaluations
              </Button>
              <Button variant="outline" className="w-full justify-start hover:bg-pink-50 border-pink-200 group">
                <Award className="h-4 w-4 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                Set New Goals
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SupervisionProgress;
