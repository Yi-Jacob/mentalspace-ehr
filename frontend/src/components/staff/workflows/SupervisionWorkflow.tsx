
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, FileText, Users, CheckCircle, AlertTriangle } from 'lucide-react';

const SupervisionWorkflow: React.FC = () => {
  const [selectedSupervisee, setSelectedSupervisee] = useState('');
  const [supervisionType, setSupervisionType] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Supervision Management</h2>
          <p className="text-gray-600">Manage supervision relationships and sessions</p>
        </div>
      </div>

      <Tabs defaultValue="sessions" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
          <TabsTrigger value="relationships">Relationships</TabsTrigger>
          <TabsTrigger value="notes">Supervision Notes</TabsTrigger>
          <TabsTrigger value="progress">Progress Tracking</TabsTrigger>
        </TabsList>

        <TabsContent value="sessions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Schedule Supervision Session</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="supervisee">Supervisee</Label>
                  <Select value={selectedSupervisee} onValueChange={setSelectedSupervisee}>
                    <SelectTrigger>
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
                  <Label htmlFor="supervision_type">Session Type</Label>
                  <Select value={supervisionType} onValueChange={setSupervisionType}>
                    <SelectTrigger>
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="session_date">Date</Label>
                  <Input type="date" id="session_date" />
                </div>
                <div>
                  <Label htmlFor="session_time">Time</Label>
                  <Input type="time" id="session_time" />
                </div>
              </div>
              <div>
                <Label htmlFor="agenda">Session Agenda</Label>
                <Textarea 
                  id="agenda" 
                  placeholder="Outline topics to discuss..."
                  rows={3}
                />
              </div>
              <Button className="w-full">Schedule Session</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Upcoming Sessions</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Individual Supervision - Alex Johnson</p>
                    <p className="text-sm text-gray-600">Tomorrow at 3:00 PM • 1 hour</p>
                    <p className="text-xs text-gray-500">Agenda: Case review, professional development</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">Reschedule</Button>
                    <Button size="sm">Start</Button>
                  </div>
                </div>
                <div className="flex justify-between items-center p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Group Supervision - Multiple Supervisees</p>
                    <p className="text-sm text-gray-600">Friday at 2:00 PM • 1.5 hours</p>
                    <p className="text-xs text-gray-500">Agenda: Ethics discussion, case presentations</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">Edit</Button>
                    <Button size="sm">Join</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="relationships" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Active Supervision Relationships</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Alex Johnson</p>
                    <p className="text-sm text-gray-600">Intern • Started: January 2024</p>
                    <p className="text-xs text-gray-500">Supervision Type: Clinical</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-green-700">Active</Badge>
                    <Button size="sm" variant="outline">View Details</Button>
                  </div>
                </div>
                <div className="flex justify-between items-center p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Blake Wilson</p>
                    <p className="text-sm text-gray-600">Associate • Started: March 2024</p>
                    <p className="text-xs text-gray-500">Supervision Type: Clinical</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-green-700">Active</Badge>
                    <Button size="sm" variant="outline">View Details</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Co-signing Queue</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-4 bg-red-50 border-l-4 border-red-400 rounded">
                  <div>
                    <p className="font-medium">Progress Note - Patient: Jane Smith</p>
                    <p className="text-sm text-gray-600">Supervisee: Alex Johnson • Due: Today</p>
                    <p className="text-xs text-gray-500">Session Date: Yesterday • Service: Individual Therapy</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">Review</Button>
                    <Button size="sm">Co-sign</Button>
                  </div>
                </div>
                <div className="flex justify-between items-center p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                  <div>
                    <p className="font-medium">Treatment Plan - Patient: John Doe</p>
                    <p className="text-sm text-gray-600">Supervisee: Blake Wilson • Due: Tomorrow</p>
                    <p className="text-xs text-gray-500">Plan Date: This week • Service: Family Therapy</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">Review</Button>
                    <Button size="sm">Co-sign</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="progress" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5" />
                <span>Supervisee Progress Tracking</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-medium">Alex Johnson (Intern)</h4>
                      <p className="text-sm text-gray-600">Clinical Track • 6 months completed</p>
                    </div>
                    <Badge variant="outline" className="text-green-700">On Track</Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Required Hours: 300</span>
                      <span>Completed: 180</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: '60%' }}></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                    <div>
                      <p className="text-gray-600">Direct Hours: 120/200</p>
                      <p className="text-gray-600">Group Hours: 40/60</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Individual Hours: 80/120</p>
                      <p className="text-gray-600">Supervision Hours: 20/40</p>
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-medium">Blake Wilson (Associate)</h4>
                      <p className="text-sm text-gray-600">Clinical Track • 3 months completed</p>
                    </div>
                    <Badge variant="outline" className="text-yellow-700">Needs Review</Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Required Hours: 200</span>
                      <span>Completed: 50</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '25%' }}></div>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="flex items-center space-x-2 text-sm text-yellow-700">
                      <AlertTriangle className="h-4 w-4" />
                      <span>Behind on supervision hours</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SupervisionWorkflow;
