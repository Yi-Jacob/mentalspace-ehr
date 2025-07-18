
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Calendar, Clock, Users, Target, Settings, MapPin, MessageSquare, Video, Edit, PlayCircle, Sparkles } from 'lucide-react';

const SupervisionSessions: React.FC = () => {
  const [selectedSupervisee, setSelectedSupervisee] = useState('');
  const [supervisionType, setSupervisionType] = useState('');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Schedule New Session */}
      <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg border-b border-blue-100">
          <CardTitle className="flex items-center space-x-2 text-blue-800">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow-lg">
              <Plus className="h-5 w-5 text-white" />
            </div>
            <span className="bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent font-bold">
              Schedule New Session
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 gap-4">
            <div className="group">
              <Label className="text-sm font-medium text-gray-700 flex items-center space-x-2 mb-2">
                <div className="p-1 bg-gradient-to-br from-purple-500 to-pink-600 rounded">
                  <Users className="h-3 w-3 text-white" />
                </div>
                <span>Supervisee</span>
              </Label>
              <Select value={selectedSupervisee} onValueChange={setSelectedSupervisee}>
                <SelectTrigger className="bg-white border-gray-200 hover:border-blue-300 focus:border-blue-500 transition-all duration-300 group-hover:shadow-md">
                  <SelectValue placeholder="Select supervisee" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-xl">
                  <SelectItem value="alex_johnson" className="hover:bg-blue-50">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">AJ</div>
                      <span>Alex Johnson (Intern)</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="blake_wilson" className="hover:bg-green-50">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white text-xs font-bold">BW</div>
                      <span>Blake Wilson (Associate)</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="casey_taylor" className="hover:bg-purple-50">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white text-xs font-bold">CT</div>
                      <span>Casey Taylor (Assistant)</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="group">
              <Label className="text-sm font-medium text-gray-700 flex items-center space-x-2 mb-2">
                <div className="p-1 bg-gradient-to-br from-orange-500 to-red-600 rounded">
                  <Target className="h-3 w-3 text-white" />
                </div>
                <span>Session Type</span>
              </Label>
              <Select value={supervisionType} onValueChange={setSupervisionType}>
                <SelectTrigger className="bg-white border-gray-200 hover:border-orange-300 focus:border-orange-500 transition-all duration-300 group-hover:shadow-md">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-xl">
                  <SelectItem value="individual" className="hover:bg-blue-50">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-blue-600" />
                      <span>Individual Supervision</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="group" className="hover:bg-green-50">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-green-600" />
                      <span>Group Supervision</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="case_review" className="hover:bg-purple-50">
                    <div className="flex items-center space-x-2">
                      <Settings className="h-4 w-4 text-purple-600" />
                      <span>Case Review</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="administrative" className="hover:bg-orange-50">
                    <div className="flex items-center space-x-2">
                      <Settings className="h-4 w-4 text-orange-600" />
                      <span>Administrative</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="group">
                <Label className="text-sm font-medium text-gray-700 flex items-center space-x-2 mb-2">
                  <div className="p-1 bg-gradient-to-br from-green-500 to-emerald-600 rounded">
                    <Calendar className="h-3 w-3 text-white" />
                  </div>
                  <span>Date</span>
                </Label>
                <Input type="date" className="bg-white border-gray-200 hover:border-green-300 focus:border-green-500 transition-all duration-300 group-hover:shadow-md" />
              </div>
              <div className="group">
                <Label className="text-sm font-medium text-gray-700 flex items-center space-x-2 mb-2">
                  <div className="p-1 bg-gradient-to-br from-yellow-500 to-orange-600 rounded">
                    <Clock className="h-3 w-3 text-white" />
                  </div>
                  <span>Time</span>
                </Label>
                <Input type="time" className="bg-white border-gray-200 hover:border-yellow-300 focus:border-yellow-500 transition-all duration-300 group-hover:shadow-md" />
              </div>
            </div>

            <div className="group">
              <Label className="text-sm font-medium text-gray-700 flex items-center space-x-2 mb-2">
                <div className="p-1 bg-gradient-to-br from-pink-500 to-red-600 rounded">
                  <MapPin className="h-3 w-3 text-white" />
                </div>
                <span>Location</span>
              </Label>
              <Select>
                <SelectTrigger className="bg-white border-gray-200 hover:border-pink-300 focus:border-pink-500 transition-all duration-300 group-hover:shadow-md">
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-xl">
                  <SelectItem value="office" className="hover:bg-blue-50">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-blue-600" />
                      <span>Office Room A</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="conference" className="hover:bg-green-50">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-green-600" />
                      <span>Conference Room</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="virtual" className="hover:bg-purple-50">
                    <div className="flex items-center space-x-2">
                      <Video className="h-4 w-4 text-purple-600" />
                      <span>Virtual Meeting</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="group">
              <Label className="text-sm font-medium text-gray-700 flex items-center space-x-2 mb-2">
                <div className="p-1 bg-gradient-to-br from-indigo-500 to-purple-600 rounded">
                  <MessageSquare className="h-3 w-3 text-white" />
                </div>
                <span>Session Agenda</span>
              </Label>
              <Textarea 
                placeholder="Outline topics to discuss..."
                rows={3}
                className="bg-white border-gray-200 hover:border-indigo-300 focus:border-indigo-500 transition-all duration-300 group-hover:shadow-md resize-none"
              />
            </div>
          </div>
          
          <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group">
            <Plus className="h-5 w-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
            Schedule Session
            <Sparkles className="h-4 w-4 ml-2 opacity-70" />
          </Button>
        </CardContent>
      </Card>

      {/* Session Calendar */}
      <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-lg border-b border-purple-100">
          <CardTitle className="flex items-center space-x-2 text-purple-800">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg shadow-lg">
              <Calendar className="h-5 w-5 text-white" />
            </div>
            <span className="bg-gradient-to-r from-purple-700 to-pink-700 bg-clip-text text-transparent font-bold">
              Upcoming Sessions
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {[
              { name: "Alex Johnson", time: "Today 2:00 PM", type: "Individual", duration: "60 min", status: "confirmed", avatar: "AJ", color: "blue" },
              { name: "Blake Wilson", time: "Tomorrow 10:00 AM", type: "Group", duration: "90 min", status: "pending", avatar: "BW", color: "green" },
              { name: "Casey Taylor", time: "Friday 3:30 PM", type: "Case Review", duration: "45 min", status: "confirmed", avatar: "CT", color: "purple" },
              { name: "Dana Martinez", time: "Monday 1:00 PM", type: "Administrative", duration: "30 min", status: "rescheduled", avatar: "DM", color: "orange" }
            ].map((session, index) => (
              <div key={index} className="group p-4 bg-gradient-to-r from-gray-50 to-purple-50 rounded-xl border border-purple-100 hover:shadow-lg hover:scale-102 transition-all duration-300 animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 bg-gradient-to-br ${
                      session.color === 'blue' ? 'from-blue-500 to-indigo-600' :
                      session.color === 'green' ? 'from-green-500 to-emerald-600' :
                      session.color === 'purple' ? 'from-purple-500 to-pink-600' :
                      'from-orange-500 to-red-600'
                    } rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg transform group-hover:rotate-6 transition-transform duration-300`}>
                      {session.avatar}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{session.name}</p>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Clock className="h-3 w-3" />
                        <span>{session.time}</span>
                        <span>•</span>
                        <span>{session.duration}</span>
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline" className="text-xs bg-white">
                          {session.type}
                        </Badge>
                        <Badge 
                          variant={session.status === 'confirmed' ? 'default' : session.status === 'pending' ? 'secondary' : 'destructive'}
                          className={`text-xs ${
                            session.status === 'confirmed' ? 'bg-green-100 text-green-800 border-green-300' : 
                            session.status === 'pending' ? 'bg-yellow-100 text-yellow-800 border-yellow-300' :
                            'bg-red-100 text-red-800 border-red-300'
                          }`}
                        >
                          {session.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button size="sm" variant="outline" className="hover:bg-purple-50 border-purple-200">
                      <Video className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="hover:bg-purple-50 border-purple-200">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                      <PlayCircle className="h-4 w-4" />
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

export default SupervisionSessions;
