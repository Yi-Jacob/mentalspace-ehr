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
  BookOpen
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
              className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white rounded-xl transition-all duration-300"
            >
              <Calendar className="h-4 w-4" />
              <span>Sessions</span>
            </TabsTrigger>
            <TabsTrigger 
              value="relationships" 
              className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white rounded-xl transition-all duration-300"
            >
              <Users className="h-4 w-4" />
              <span>Team</span>
            </TabsTrigger>
            <TabsTrigger 
              value="notes" 
              className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white rounded-xl transition-all duration-300"
            >
              <FileText className="h-4 w-4" />
              <span>Reviews</span>
            </TabsTrigger>
            <TabsTrigger 
              value="progress" 
              className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white rounded-xl transition-all duration-300"
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
          <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 rounded-t-lg">
              <CardTitle className="flex items-center space-x-2 text-orange-800">
                <Calendar className="h-5 w-5" />
                <span>Schedule New Session</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Supervisee</Label>
                    <Select value={selectedSupervisee} onValueChange={setSelectedSupervisee}>
                      <SelectTrigger className="bg-white border-gray-200 hover:border-orange-300 focus:border-orange-500">
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
                    <Label className="text-sm font-medium text-gray-700">Session Type</Label>
                    <Select value={supervisionType} onValueChange={setSupervisionType}>
                      <SelectTrigger className="bg-white border-gray-200 hover:border-orange-300 focus:border-orange-500">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="individual">Individual Supervision</SelectItem>
                        <SelectItem value="group">Group Supervision</SelectItem>
                        <SelectItem value="case_review">Case Review</SelectItem>
                        <SelectItem value="administrative">Administrative</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Date & Time</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <Input type="date" className="bg-white border-gray-200 hover:border-orange-300 focus:border-orange-500" />
                      <Input type="time" className="bg-white border-gray-200 hover:border-orange-300 focus:border-orange-500" />
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Session Agenda</Label>
                    <Textarea 
                      placeholder="Outline topics to discuss..."
                      rows={3}
                      className="bg-white border-gray-200 hover:border-orange-300 focus:border-orange-500"
                    />
                  </div>
                </div>
              </div>
              <Button className="w-full mt-6 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                <Plus className="h-5 w-5 mr-2" />
                Schedule Session
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Other tabs content would go here... */}
        <TabsContent value="relationships" className="space-y-6">
          <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Supervision Relationships</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center py-12">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-red-100 rounded-full flex items-center justify-center mx-auto">
                    <Users className="h-8 w-8 text-orange-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">Team Relationships</h3>
                  <p className="text-gray-600 max-w-md">
                    Detailed supervision relationships and team structure will be implemented here.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes" className="space-y-6">
          <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Review Queue</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center py-12">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-red-100 rounded-full flex items-center justify-center mx-auto">
                    <FileText className="h-8 w-8 text-orange-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">Review Management</h3>
                  <p className="text-gray-600 max-w-md">
                    Advanced review queue and note management functionality will be implemented here.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="progress" className="space-y-6">
          <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Award className="h-5 w-5" />
                <span>Progress Tracking</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center py-12">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-red-100 rounded-full flex items-center justify-center mx-auto">
                    <Award className="h-8 w-8 text-orange-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">Progress Analytics</h3>
                  <p className="text-gray-600 max-w-md">
                    Comprehensive progress tracking and analytics dashboard will be implemented here.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StaffSupervisionView;
