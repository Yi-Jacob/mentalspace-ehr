
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Calendar, Clock, Users, Target, Settings, MapPin, MessageSquare, Video, Edit, PlayCircle } from 'lucide-react';

const SupervisionSessions: React.FC = () => {
  const [selectedSupervisee, setSelectedSupervisee] = useState('');
  const [supervisionType, setSupervisionType] = useState('');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Schedule New Session */}
      <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
          <CardTitle className="flex items-center space-x-2 text-blue-800">
            <Plus className="h-5 w-5" />
            <span>Schedule New Session</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span>Supervisee</span>
              </Label>
              <Select value={selectedSupervisee} onValueChange={setSelectedSupervisee}>
                <SelectTrigger className="bg-white border-gray-200 hover:border-blue-300 focus:border-blue-500 transition-all duration-300">
                  <SelectValue placeholder="Select supervisee" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="alex_johnson">Alex Johnson (Intern)</SelectItem>
                  <SelectItem value="blake_wilson">Blake Wilson (Associate)</SelectItem>
                  <SelectItem value="casey_taylor">Casey Taylor (Assistant)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                <Target className="h-4 w-4" />
                <span>Session Type</span>
              </Label>
              <Select value={supervisionType} onValueChange={setSupervisionType}>
                <SelectTrigger className="bg-white border-gray-200 hover:border-blue-300 focus:border-blue-500 transition-all duration-300">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="individual">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4" />
                      <span>Individual Supervision</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="group">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4" />
                      <span>Group Supervision</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="case_review">
                    <div className="flex items-center space-x-2">
                      <Settings className="h-4 w-4" />
                      <span>Case Review</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="administrative">
                    <div className="flex items-center space-x-2">
                      <Settings className="h-4 w-4" />
                      <span>Administrative</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>Date</span>
                </Label>
                <Input type="date" className="bg-white border-gray-200 hover:border-blue-300 focus:border-blue-500 transition-all duration-300" />
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <span>Time</span>
                </Label>
                <Input type="time" className="bg-white border-gray-200 hover:border-blue-300 focus:border-blue-500 transition-all duration-300" />
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>Location</span>
              </Label>
              <Select>
                <SelectTrigger className="bg-white border-gray-200 hover:border-blue-300 focus:border-blue-500 transition-all duration-300">
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="office">Office Room A</SelectItem>
                  <SelectItem value="conference">Conference Room</SelectItem>
                  <SelectItem value="virtual">Virtual Meeting</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                <MessageSquare className="h-4 w-4" />
                <span>Session Agenda</span>
              </Label>
              <Textarea 
                placeholder="Outline topics to discuss..."
                rows={3}
                className="bg-white border-gray-200 hover:border-blue-300 focus:border-blue-500 transition-all duration-300"
              />
            </div>
          </div>
          
          <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
            <Plus className="h-5 w-5 mr-2" />
            Schedule Session
          </Button>
        </CardContent>
      </Card>

      {/* Session Calendar */}
      <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-lg">
          <CardTitle className="flex items-center space-x-2 text-purple-800">
            <Calendar className="h-5 w-5" />
            <span>Upcoming Sessions</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {[
              { name: "Alex Johnson", time: "Today 2:00 PM", type: "Individual", duration: "60 min", status: "confirmed", avatar: "AJ" },
              { name: "Blake Wilson", time: "Tomorrow 10:00 AM", type: "Group", duration: "90 min", status: "pending", avatar: "BW" },
              { name: "Casey Taylor", time: "Friday 3:30 PM", type: "Case Review", duration: "45 min", status: "confirmed", avatar: "CT" },
              { name: "Dana Martinez", time: "Monday 1:00 PM", type: "Administrative", duration: "30 min", status: "rescheduled", avatar: "DM" }
            ].map((session, index) => (
              <div key={index} className="group p-4 bg-gradient-to-r from-gray-50 to-purple-50 rounded-xl border border-purple-100 hover:shadow-lg hover:scale-102 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
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
                        <Badge variant="outline" className="text-xs">
                          {session.type}
                        </Badge>
                        <Badge 
                          variant={session.status === 'confirmed' ? 'default' : session.status === 'pending' ? 'secondary' : 'destructive'}
                          className={`text-xs ${
                            session.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                            session.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}
                        >
                          {session.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button size="sm" variant="outline" className="hover:bg-purple-50">
                      <Video className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="hover:bg-purple-50">
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
