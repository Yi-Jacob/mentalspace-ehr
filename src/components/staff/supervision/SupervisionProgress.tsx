
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Award, TrendingUp, CheckCircle, AlertTriangle, Clock, Heart, Users, Brain, Shield, Target, Star, Zap, BarChart3 } from 'lucide-react';

const SupervisionProgress: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Progress Overview */}
      <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-lg border-b border-purple-100">
          <CardTitle className="flex items-center space-x-2 text-purple-800">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg shadow-lg">
              <Award className="h-5 w-5 text-white" />
            </div>
            <span className="bg-gradient-to-r from-purple-700 to-pink-700 bg-clip-text text-transparent font-bold">
              Supervisee Progress Tracking
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            {[
              {
                name: "Alex Johnson",
                role: "Clinical Intern",
                duration: "6 months",
                status: "On Track",
                totalHours: 300,
                completedHours: 180,
                directHours: { completed: 120, required: 200 },
                groupHours: { completed: 40, required: 60 },
                individualHours: { completed: 80, required: 120 },
                supervisionHours: { completed: 20, required: 40 },
                avatar: "AJ",
                statusColor: "green",
                color: "blue"
              },
              {
                name: "Blake Wilson",
                role: "Associate Therapist",
                duration: "3 months",
                status: "Needs Review",
                totalHours: 200,
                completedHours: 50,
                directHours: { completed: 30, required: 120 },
                groupHours: { completed: 10, required: 40 },
                individualHours: { completed: 20, required: 80 },
                supervisionHours: { completed: 5, required: 30 },
                avatar: "BW",
                statusColor: "yellow",
                color: "orange"
              }
            ].map((person, index) => (
              <div key={index} className="group p-6 bg-gradient-to-r from-gray-50 to-purple-50 rounded-xl border border-purple-100 hover:shadow-lg transition-all duration-300 animate-fade-in" style={{ animationDelay: `${index * 200}ms` }}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <div className={`w-16 h-16 bg-gradient-to-br ${
                        person.color === 'blue' ? 'from-blue-500 to-indigo-600' : 'from-orange-500 to-red-600'
                      } rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg transform group-hover:rotate-6 transition-transform duration-300`}>
                        {person.avatar}
                      </div>
                      <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center ${
                        person.statusColor === 'green' ? 'bg-green-500' : 'bg-yellow-500'
                      } animate-bounce`}>
                        {person.statusColor === 'green' ? 
                          <CheckCircle className="h-3 w-3 text-white" /> : 
                          <AlertTriangle className="h-3 w-3 text-white" />
                        }
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-800">{person.name}</h3>
                      <p className="text-sm text-gray-600 font-medium">{person.role}</p>
                      <p className="text-xs text-gray-500">{person.duration} completed</p>
                    </div>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`${
                      person.statusColor === 'green' ? 'bg-green-100 text-green-800 border-green-300' : 'bg-yellow-100 text-yellow-800 border-yellow-300'
                    } animate-pulse`}
                  >
                    {person.status}
                  </Badge>
                </div>

                {/* Overall Progress */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium text-gray-700 flex items-center space-x-1">
                      <Star className="h-3 w-3" />
                      <span>Overall Progress</span>
                    </span>
                    <span className="font-bold text-gray-800">{person.completedHours}/{person.totalHours} hours</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner">
                    <div 
                      className={`h-3 rounded-full transition-all duration-1000 ${
                        person.statusColor === 'green' ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gradient-to-r from-yellow-500 to-orange-600'
                      } shadow-lg hover:shadow-xl`}
                      style={{ width: `${(person.completedHours / person.totalHours) * 100}%` }}
                    />
                  </div>
                  <div className="text-right text-xs text-gray-500 mt-1">
                    {Math.round((person.completedHours / person.totalHours) * 100)}% complete
                  </div>
                </div>

                {/* Detailed Breakdown */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm p-2 bg-red-50 rounded-lg hover:bg-red-100 transition-colors duration-300">
                      <div className="flex items-center space-x-2">
                        <Heart className="h-4 w-4 text-red-500" />
                        <span className="text-gray-600 font-medium">Direct Hours</span>
                      </div>
                      <span className="font-semibold text-gray-800">{person.directHours.completed}/{person.directHours.required}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm p-2 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-300">
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-blue-500" />
                        <span className="text-gray-600 font-medium">Group Hours</span>
                      </div>
                      <span className="font-semibold text-gray-800">{person.groupHours.completed}/{person.groupHours.required}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm p-2 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors duration-300">
                      <div className="flex items-center space-x-2">
                        <Brain className="h-4 w-4 text-purple-500" />
                        <span className="text-gray-600 font-medium">Individual</span>
                      </div>
                      <span className="font-semibold text-gray-800">{person.individualHours.completed}/{person.individualHours.required}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm p-2 bg-green-50 rounded-lg hover:bg-green-100 transition-colors duration-300">
                      <div className="flex items-center space-x-2">
                        <Shield className="h-4 w-4 text-green-500" />
                        <span className="text-gray-600 font-medium">Supervision</span>
                      </div>
                      <span className="font-semibold text-gray-800">{person.supervisionHours.completed}/{person.supervisionHours.required}</span>
                    </div>
                  </div>
                </div>

                {person.statusColor === 'yellow' && (
                  <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200 animate-pulse">
                    <div className="flex items-center space-x-2 text-sm text-yellow-700">
                      <AlertTriangle className="h-4 w-4" />
                      <span className="font-medium">Behind on supervision hours - recommend additional sessions</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Progress Analytics */}
      <div className="space-y-6">
        <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in">
          <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-t-lg border-b border-indigo-100">
            <CardTitle className="flex items-center space-x-2 text-indigo-800">
              <div className="p-2 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-lg shadow-lg">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <span className="bg-gradient-to-r from-indigo-700 to-blue-700 bg-clip-text text-transparent font-bold">
                Progress Analytics
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg hover:shadow-md transition-all duration-300 group">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-700">Average Completion Rate</p>
                    <p className="text-2xl font-bold text-blue-800 group-hover:scale-110 transition-transform duration-300">76%</p>
                  </div>
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full group-hover:rotate-12 transition-transform duration-300">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-1 mt-2">
                  <div className="bg-blue-600 h-1 rounded-full w-3/4"></div>
                </div>
              </div>

              <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg hover:shadow-md transition-all duration-300 group">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-700">On Track Supervisees</p>
                    <p className="text-2xl font-bold text-green-800 group-hover:scale-110 transition-transform duration-300">1 of 2</p>
                  </div>
                  <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full group-hover:rotate-12 transition-transform duration-300">
                    <CheckCircle className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="w-full bg-green-200 rounded-full h-1 mt-2">
                  <div className="bg-green-600 h-1 rounded-full w-1/2"></div>
                </div>
              </div>

              <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg hover:shadow-md transition-all duration-300 group">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-700">Total Hours Supervised</p>
                    <p className="text-2xl font-bold text-purple-800 group-hover:scale-110 transition-transform duration-300">230</p>
                  </div>
                  <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full group-hover:rotate-12 transition-transform duration-300">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="w-full bg-purple-200 rounded-full h-1 mt-2">
                  <div className="bg-purple-600 h-1 rounded-full w-5/6"></div>
                </div>
              </div>

              <div className="p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg hover:shadow-md transition-all duration-300 group">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-orange-700">Quality Rating</p>
                    <p className="text-2xl font-bold text-orange-800 group-hover:scale-110 transition-transform duration-300">9.2</p>
                  </div>
                  <div className="p-3 bg-gradient-to-br from-orange-500 to-red-600 rounded-full group-hover:rotate-12 transition-transform duration-300">
                    <Star className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="w-full bg-orange-200 rounded-full h-1 mt-2">
                  <div className="bg-orange-600 h-1 rounded-full w-11/12"></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in">
          <CardHeader className="bg-gradient-to-r from-pink-50 to-red-50 rounded-t-lg border-b border-pink-100">
            <CardTitle className="flex items-center space-x-2 text-pink-800">
              <div className="p-2 bg-gradient-to-br from-pink-500 to-red-600 rounded-lg shadow-lg">
                <Target className="h-5 w-5 text-white" />
              </div>
              <span className="bg-gradient-to-r from-pink-700 to-red-700 bg-clip-text text-transparent font-bold">
                Goals & Milestones
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-3">
              {[
                { title: "Complete Initial Assessments", status: "completed", color: "green", icon: CheckCircle },
                { title: "Document 50 Therapy Sessions", status: "in-progress", color: "yellow", icon: BarChart3 },
                { title: "Pass Mid-term Evaluation", status: "upcoming", color: "gray", icon: Clock },
                { title: "Complete Ethics Training", status: "completed", color: "green", icon: CheckCircle }
              ].map((goal, index) => (
                <div key={index} className={`flex items-center space-x-3 p-3 rounded-lg hover:shadow-md transition-all duration-300 group animate-fade-in ${
                  goal.color === 'green' ? 'bg-green-50 hover:bg-green-100' :
                  goal.color === 'yellow' ? 'bg-yellow-50 hover:bg-yellow-100' : 'bg-gray-50 hover:bg-gray-100'
                }`} style={{ animationDelay: `${index * 100}ms` }}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center group-hover:rotate-12 transition-transform duration-300 ${
                    goal.color === 'green' ? 'bg-green-500' :
                    goal.color === 'yellow' ? 'bg-yellow-500' : 'bg-gray-400'
                  }`}>
                    <goal.icon className="h-4 w-4 text-white" />
                  </div>
                  <span className={`text-sm font-medium flex-1 ${
                    goal.color === 'green' ? 'text-green-800' :
                    goal.color === 'yellow' ? 'text-yellow-800' : 'text-gray-600'
                  }`}>
                    {goal.title}
                  </span>
                  {goal.status === 'completed' && (
                    <div className="flex items-center space-x-1">
                      <CheckCircle className="h-4 w-4 text-green-500 animate-bounce" />
                      <Zap className="h-3 w-3 text-yellow-500" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SupervisionProgress;
