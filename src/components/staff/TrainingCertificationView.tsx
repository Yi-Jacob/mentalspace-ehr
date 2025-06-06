
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GraduationCap, Award, AlertTriangle, Plus, Calendar } from 'lucide-react';
import { useTrainingRecords } from '@/hooks/useTrainingRecords';
import { useCertifications } from '@/hooks/useCertifications';
import { supabase } from '@/integrations/supabase/client';
import { format, differenceInDays } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const TrainingCertificationView: React.FC = () => {
  const { trainingRecords, isLoading: trainingLoading, addTrainingRecord } = useTrainingRecords();
  const { certifications, expiringCertifications, isLoading: certLoading, addCertification } = useCertifications();
  
  const [showTrainingDialog, setShowTrainingDialog] = useState(false);
  const [showCertDialog, setShowCertDialog] = useState(false);
  
  const [newTraining, setNewTraining] = useState({
    training_title: '',
    training_type: 'continuing_education',
    provider_organization: '',
    completion_date: '',
    expiry_date: '',
    hours_completed: '',
    certificate_number: '',
    status: 'completed',
    notes: '',
  });

  const [newCertification, setNewCertification] = useState({
    certification_name: '',
    certification_number: '',
    issuing_organization: '',
    issue_date: '',
    expiry_date: '',
    renewal_period_months: '24',
    status: 'active',
    notes: '',
  });

  const handleAddTraining = async () => {
    const { data: userInfo } = await supabase.rpc('get_current_user_info');
    if (!userInfo?.[0]) return;

    await addTrainingRecord.mutateAsync({
      user_id: userInfo[0].user_id,
      training_title: newTraining.training_title,
      training_type: newTraining.training_type,
      provider_organization: newTraining.provider_organization || undefined,
      completion_date: newTraining.completion_date || undefined,
      expiry_date: newTraining.expiry_date || undefined,
      hours_completed: newTraining.hours_completed ? parseFloat(newTraining.hours_completed) : undefined,
      certificate_number: newTraining.certificate_number || undefined,
      status: newTraining.status as any,
      notes: newTraining.notes || undefined,
    });
    setShowTrainingDialog(false);
    setNewTraining({
      training_title: '',
      training_type: 'continuing_education',
      provider_organization: '',
      completion_date: '',
      expiry_date: '',
      hours_completed: '',
      certificate_number: '',
      status: 'completed',
      notes: '',
    });
  };

  const handleAddCertification = async () => {
    const { data: userInfo } = await supabase.rpc('get_current_user_info');
    if (!userInfo?.[0]) return;

    await addCertification.mutateAsync({
      user_id: userInfo[0].user_id,
      certification_name: newCertification.certification_name,
      certification_number: newCertification.certification_number || undefined,
      issuing_organization: newCertification.issuing_organization,
      issue_date: newCertification.issue_date || undefined,
      expiry_date: newCertification.expiry_date,
      renewal_period_months: parseInt(newCertification.renewal_period_months),
      status: newCertification.status as any,
      notes: newCertification.notes || undefined,
    });
    setShowCertDialog(false);
    setNewCertification({
      certification_name: '',
      certification_number: '',
      issuing_organization: '',
      issue_date: '',
      expiry_date: '',
      renewal_period_months: '24',
      status: 'active',
      notes: '',
    });
  };

  const getExpiryStatus = (expiryDate: string) => {
    const daysUntilExpiry = differenceInDays(new Date(expiryDate), new Date());
    if (daysUntilExpiry < 0) return { status: 'expired', color: 'bg-red-500' };
    if (daysUntilExpiry <= 30) return { status: 'critical', color: 'bg-red-500' };
    if (daysUntilExpiry <= 90) return { status: 'warning', color: 'bg-yellow-500' };
    return { status: 'active', color: 'bg-green-500' };
  };

  const isLoading = trainingLoading || certLoading;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Expiring Certifications Alert */}
      {expiringCertifications && expiringCertifications.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-orange-800">
              <AlertTriangle className="h-5 w-5" />
              <span>Certifications Requiring Attention</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {expiringCertifications.slice(0, 3).map((cert) => (
                <div key={cert.id} className="flex items-center justify-between">
                  <span className="font-medium">{cert.certification_name}</span>
                  <Badge className="bg-orange-500">
                    Expires {format(new Date(cert.expiry_date), 'MMM dd, yyyy')}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="training" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="training" className="flex items-center space-x-2">
            <GraduationCap className="h-4 w-4" />
            <span>Training Records</span>
          </TabsTrigger>
          <TabsTrigger value="certifications" className="flex items-center space-x-2">
            <Award className="h-4 w-4" />
            <span>Certifications</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="training" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Training Records</h3>
            <Dialog open={showTrainingDialog} onOpenChange={setShowTrainingDialog}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Training
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Add Training Record</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Training Title</Label>
                    <Input
                      value={newTraining.training_title}
                      onChange={(e) => setNewTraining(prev => ({ ...prev, training_title: e.target.value }))}
                      placeholder="Training name..."
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Type</Label>
                      <Select 
                        value={newTraining.training_type}
                        onValueChange={(value) => setNewTraining(prev => ({ ...prev, training_type: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="continuing_education">Continuing Education</SelectItem>
                          <SelectItem value="workshop">Workshop</SelectItem>
                          <SelectItem value="conference">Conference</SelectItem>
                          <SelectItem value="certification">Certification</SelectItem>
                          <SelectItem value="internal_training">Internal Training</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Hours</Label>
                      <Input
                        type="number"
                        value={newTraining.hours_completed}
                        onChange={(e) => setNewTraining(prev => ({ ...prev, hours_completed: e.target.value }))}
                        placeholder="0"
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Provider Organization</Label>
                    <Input
                      value={newTraining.provider_organization}
                      onChange={(e) => setNewTraining(prev => ({ ...prev, provider_organization: e.target.value }))}
                      placeholder="Organization name..."
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Completion Date</Label>
                      <Input
                        type="date"
                        value={newTraining.completion_date}
                        onChange={(e) => setNewTraining(prev => ({ ...prev, completion_date: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label>Expiry Date</Label>
                      <Input
                        type="date"
                        value={newTraining.expiry_date}
                        onChange={(e) => setNewTraining(prev => ({ ...prev, expiry_date: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Certificate Number</Label>
                    <Input
                      value={newTraining.certificate_number}
                      onChange={(e) => setNewTraining(prev => ({ ...prev, certificate_number: e.target.value }))}
                      placeholder="Certificate ID..."
                    />
                  </div>
                  <div>
                    <Label>Notes</Label>
                    <Textarea
                      value={newTraining.notes}
                      onChange={(e) => setNewTraining(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Additional notes..."
                    />
                  </div>
                  <Button onClick={handleAddTraining} className="w-full">
                    Add Training Record
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {trainingRecords?.map((training) => (
              <Card key={training.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <GraduationCap className="h-5 w-5 text-blue-600" />
                        <div>
                          <h3 className="font-medium">{training.training_title}</h3>
                          <p className="text-sm text-gray-600">{training.provider_organization}</p>
                          {training.completion_date && (
                            <p className="text-xs text-gray-500">
                              Completed: {format(new Date(training.completion_date), 'MMM dd, yyyy')}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <Badge className={training.status === 'completed' ? 'bg-green-500' : 'bg-yellow-500'}>
                        {training.status}
                      </Badge>
                      {training.hours_completed && (
                        <p className="text-sm text-gray-600">{training.hours_completed}h</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="certifications" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Certifications</h3>
            <Dialog open={showCertDialog} onOpenChange={setShowCertDialog}>
              <DialogTrigger asChild>
                <Button className="bg-green-600 hover:bg-green-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Certification
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Add Certification</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Certification Name</Label>
                    <Input
                      value={newCertification.certification_name}
                      onChange={(e) => setNewCertification(prev => ({ ...prev, certification_name: e.target.value }))}
                      placeholder="Certification name..."
                    />
                  </div>
                  <div>
                    <Label>Issuing Organization</Label>
                    <Input
                      value={newCertification.issuing_organization}
                      onChange={(e) => setNewCertification(prev => ({ ...prev, issuing_organization: e.target.value }))}
                      placeholder="Organization name..."
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Issue Date</Label>
                      <Input
                        type="date"
                        value={newCertification.issue_date}
                        onChange={(e) => setNewCertification(prev => ({ ...prev, issue_date: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label>Expiry Date</Label>
                      <Input
                        type="date"
                        value={newCertification.expiry_date}
                        onChange={(e) => setNewCertification(prev => ({ ...prev, expiry_date: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Certificate Number</Label>
                    <Input
                      value={newCertification.certification_number}
                      onChange={(e) => setNewCertification(prev => ({ ...prev, certification_number: e.target.value }))}
                      placeholder="Certificate ID..."
                    />
                  </div>
                  <div>
                    <Label>Renewal Period (months)</Label>
                    <Select 
                      value={newCertification.renewal_period_months}
                      onValueChange={(value) => setNewCertification(prev => ({ ...prev, renewal_period_months: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="12">12 months</SelectItem>
                        <SelectItem value="24">24 months</SelectItem>
                        <SelectItem value="36">36 months</SelectItem>
                        <SelectItem value="60">60 months</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={handleAddCertification} className="w-full">
                    Add Certification
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {certifications?.map((cert) => {
              const expiryStatus = getExpiryStatus(cert.expiry_date);
              return (
                <Card key={cert.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <Award className="h-5 w-5 text-green-600" />
                          <div>
                            <h3 className="font-medium">{cert.certification_name}</h3>
                            <p className="text-sm text-gray-600">{cert.issuing_organization}</p>
                            <p className="text-xs text-gray-500">
                              Expires: {format(new Date(cert.expiry_date), 'MMM dd, yyyy')}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="text-right space-y-1">
                        <Badge className={expiryStatus.color}>
                          {cert.status}
                        </Badge>
                        {cert.certification_number && (
                          <p className="text-xs text-gray-500">#{cert.certification_number}</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TrainingCertificationView;
