
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  UserCog, 
  Plus, 
  Calendar, 
  Clock, 
  FileText, 
  Users, 
  CheckCircle, 
  AlertTriangle,
  Search,
  Filter,
  Eye,
  Edit,
  MessageSquare,
  TrendingUp,
  Award,
  Target,
  BookOpen,
  Star,
  PlayCircle,
  Video,
  Phone,
  MapPin,
  Hash,
  BarChart3,
  Zap,
  ChevronRight,
  Timer,
  UserCheck,
  FileCheck,
  Calendar as CalendarIcon,
  Sparkles,
  Heart,
  Brain,
  Shield
} from 'lucide-react';

const StaffSupervisionView: React.FC = () => {
  const [selectedSupervisee, setSelectedSupervisee] = useState('');
  const [supervisionType, setSupervisionType] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-8">
      {/* Modern Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="p-4 bg-gradient-to-br from-orange-500 via-red-500 to-pink-600 rounded-2xl shadow-lg shadow-orange-200/50 transform rotate-3 hover:rotate-6 transition-transform duration-300">
              <UserCog className="h-8 w-8 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-bounce" />
          </div>
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-600 via-red-600 to-pink-700 bg-clip-text text-transparent">
              Supervision Management
            </h2>
            <p className="text-gray-600 mt-1">Manage supervision relationships and track progress</p>
          </div>
        </div>
        <Button className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
          <Plus className="h-5 w-5 mr-2" />
          New Session
        </Button>
      </div>

      {/* Interactive Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">Active Supervisees</p>
                <p className="text-3xl font-bold text-blue-800">12</p>
              </div>
              <div className="p-3 bg-blue-600 rounded-full">
                <Users className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">Sessions This Week</p>
                <p className="text-3xl font-bold text-green-800">8</p>
              </div>
              <div className="p-3 bg-green-600 rounded-full">
                <Calendar className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-600 text-sm font-medium">Pending Reviews</p>
                <p className="text-3xl font-bold text-yellow-800">5</p>
              </div>
              <div className="p-3 bg-yellow-600 rounded-full">
                <FileText className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm font-medium">Completion Rate</p>
                <p className="text-3xl font-bold text-purple-800">94%</p>
              </div>
              <div className="p-3 bg-purple-600 rounded-full">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modern Tabs */}
      <Tabs defaultValue="dashboard" className="space-y-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-lg border border-white/20">
          <TabsList className="grid w-full grid-cols-5 bg-transparent gap-2">
            <TabsTrigger 
              value="dashboard" 
              className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white rounded-xl transition-all duration-300"
            >
              <TrendingUp className="h-4 w-4" />
              <span>Dashboard</span>
            </TabsTrigger>
            <TabsTrigger 
              value="sessions" 
              className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white rounded-xl transition-all duration-300"
            >
              <Calendar className="h-4 w-4" />
              <span>Sessions</span>
            </TabsTrigger>
            <TabsTrigger 
              value="relationships" 
              className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white rounded-xl transition-all duration-300"
            >
              <Users className="h-4 w-4" />
              <span>Team</span>
            </TabsTrigger>
            <TabsTrigger 
              value="notes" 
              className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-500 data-[state=active]:to-orange-500 data-[state=active]:text-white rounded-xl transition-all duration-300"
            >
              <FileText className="h-4 w-4" />
              <span>Reviews</span>
            </TabsTrigger>
            <TabsTrigger 
              value="progress" 
              className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white rounded-xl transition-all duration-300"
            >
              <Award className="h-4 w-4" />
              <span>Progress</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-6">
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
        </TabsContent>

        {/* Sessions Tab */}
        <TabsContent value="sessions" className="space-y-6">
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
                            <FileText className="h-4 w-4" />
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
                        <CalendarIcon className="h-4 w-4" />
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
        </TabsContent>

        {/* Relationships Tab */}
        <TabsContent value="relationships" className="space-y-6">
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
        </TabsContent>

        {/* Reviews Tab */}
        <TabsContent value="notes" className="space-y-6">
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
                      <FileText className="h-4 w-4 mr-2" />
                      Bulk Review
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Progress Tab */}
        <TabsContent value="progress" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Progress Overview */}
            <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-lg">
                <CardTitle className="flex items-center space-x-2 text-purple-800">
                  <Award className="h-5 w-5" />
                  <span>Supervisee Progress Tracking</span>
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
                      statusColor: "green"
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
                      statusColor: "yellow"
                    }
                  ].map((person, index) => (
                    <div key={index} className="group p-6 bg-gradient-to-r from-gray-50 to-purple-50 rounded-xl border border-purple-100 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <div className="relative">
                            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                              {person.avatar}
                            </div>
                            <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center ${
                              person.statusColor === 'green' ? 'bg-green-500' : 'bg-yellow-500'
                            }`}>
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
                            person.statusColor === 'green' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {person.status}
                        </Badge>
                      </div>

                      {/* Overall Progress */}
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="font-medium text-gray-700">Overall Progress</span>
                          <span className="font-bold text-gray-800">{person.completedHours}/{person.totalHours} hours</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div 
                            className={`h-3 rounded-full transition-all duration-500 ${
                              person.statusColor === 'green' ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gradient-to-r from-yellow-500 to-orange-600'
                            }`}
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
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center space-x-2">
                              <Heart className="h-4 w-4 text-red-500" />
                              <span className="text-gray-600">Direct Hours</span>
                            </div>
                            <span className="font-semibold text-gray-800">{person.directHours.completed}/{person.directHours.required}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center space-x-2">
                              <Users className="h-4 w-4 text-blue-500" />
                              <span className="text-gray-600">Group Hours</span>
                            </div>
                            <span className="font-semibold text-gray-800">{person.groupHours.completed}/{person.groupHours.required}</span>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center space-x-2">
                              <Brain className="h-4 w-4 text-purple-500" />
                              <span className="text-gray-600">Individual</span>
                            </div>
                            <span className="font-semibold text-gray-800">{person.individualHours.completed}/{person.individualHours.required}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center space-x-2">
                              <Shield className="h-4 w-4 text-green-500" />
                              <span className="text-gray-600">Supervision</span>
                            </div>
                            <span className="font-semibold text-gray-800">{person.supervisionHours.completed}/{person.supervisionHours.required}</span>
                          </div>
                        </div>
                      </div>

                      {person.statusColor === 'yellow' && (
                        <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
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
              <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-t-lg">
                  <CardTitle className="flex items-center space-x-2 text-indigo-800">
                    <TrendingUp className="h-5 w-5" />
                    <span>Progress Analytics</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-blue-700">Average Completion Rate</p>
                          <p className="text-2xl font-bold text-blue-800">76%</p>
                        </div>
                        <div className="p-3 bg-blue-600 rounded-full">
                          <BarChart3 className="h-6 w-6 text-white" />
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-green-700">On Track Supervisees</p>
                          <p className="text-2xl font-bold text-green-800">1 of 2</p>
                        </div>
                        <div className="p-3 bg-green-600 rounded-full">
                          <CheckCircle className="h-6 w-6 text-white" />
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-purple-700">Total Hours Supervised</p>
                          <p className="text-2xl font-bold text-purple-800">230</p>
                        </div>
                        <div className="p-3 bg-purple-600 rounded-full">
                          <Clock className="h-6 w-6 text-white" />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader className="bg-gradient-to-r from-pink-50 to-red-50 rounded-t-lg">
                  <CardTitle className="flex items-center space-x-2 text-pink-800">
                    <Target className="h-5 w-5" />
                    <span>Goals & Milestones</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    {[
                      { title: "Complete Initial Assessments", status: "completed", color: "green" },
                      { title: "Document 50 Therapy Sessions", status: "in-progress", color: "yellow" },
                      { title: "Pass Mid-term Evaluation", status: "upcoming", color: "gray" },
                      { title: "Complete Ethics Training", status: "completed", color: "green" }
                    ].map((goal, index) => (
                      <div key={index} className={`flex items-center space-x-3 p-3 rounded-lg ${
                        goal.color === 'green' ? 'bg-green-50' :
                        goal.color === 'yellow' ? 'bg-yellow-50' : 'bg-gray-50'
                      }`}>
                        <div className={`w-3 h-3 rounded-full ${
                          goal.color === 'green' ? 'bg-green-500' :
                          goal.color === 'yellow' ? 'bg-yellow-500' : 'bg-gray-400'
                        }`} />
                        <span className={`text-sm font-medium ${
                          goal.color === 'green' ? 'text-green-800' :
                          goal.color === 'yellow' ? 'text-yellow-800' : 'text-gray-600'
                        }`}>
                          {goal.title}
                        </span>
                        {goal.status === 'completed' && <CheckCircle className="h-4 w-4 text-green-500 ml-auto" />}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StaffSupervisionView;
