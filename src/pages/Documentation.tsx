
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, FileText, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import NotesList from '@/components/documentation/NotesList';
import CreateNoteModal from '@/components/documentation/CreateNoteModal';
import PendingApprovals from '@/components/documentation/PendingApprovals';
import ComplianceTracker from '@/components/documentation/ComplianceTracker';

const Documentation = () => {
  const [activeTab, setActiveTab] = useState('all-notes');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedNoteType, setSelectedNoteType] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const noteTypes = [
    {
      type: 'intake',
      title: 'Intake Assessment',
      description: 'Comprehensive initial evaluation and assessment',
      icon: FileText,
      color: 'bg-blue-500'
    },
    {
      type: 'progress_note',
      title: 'Progress Note',
      description: 'Session documentation in SOAP or DAP format',
      icon: FileText,
      color: 'bg-green-500'
    },
    {
      type: 'treatment_plan',
      title: 'Treatment Plan',
      description: 'Goals, objectives, and intervention strategies',
      icon: FileText,
      color: 'bg-purple-500'
    },
    {
      type: 'cancellation_note',
      title: 'Cancellation Note',
      description: 'Missed appointments and cancellation documentation',
      icon: Clock,
      color: 'bg-orange-500'
    },
    {
      type: 'contact_note',
      title: 'Contact Note',
      description: 'Phone calls, emails, and other communications',
      icon: FileText,
      color: 'bg-cyan-500'
    },
    {
      type: 'consultation_note',
      title: 'Consultation Note',
      description: 'Professional consultations and case discussions',
      icon: FileText,
      color: 'bg-indigo-500'
    },
    {
      type: 'miscellaneous_note',
      title: 'Miscellaneous Note',
      description: 'Other clinical documentation needs',
      icon: FileText,
      color: 'bg-gray-500'
    }
  ];

  const createIntakeAssessmentMutation = useMutation({
    mutationFn: async () => {
      // Get the user's ID from the users table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('auth_user_id', user?.id)
        .single();

      if (userError) {
        console.error('Error fetching user:', userError);
        throw new Error('Could not find user profile');
      }

      const { data, error } = await supabase
        .from('clinical_notes')
        .insert([{
          title: 'New Intake Assessment',
          note_type: 'intake',
          provider_id: userData.id,
          content: {},
          status: 'draft',
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      navigate(`/documentation/note/${data.id}/edit`);
    },
    onError: (error) => {
      toast({
        title: 'Error creating intake assessment',
        description: 'There was an error creating the intake assessment. Please try again.',
        variant: 'destructive',
      });
      console.error('Error creating intake assessment:', error);
    },
  });

  const handleCreateNote = (noteType: string) => {
    if (noteType === 'intake') {
      createIntakeAssessmentMutation.mutate();
    } else {
      setSelectedNoteType(noteType);
      setShowCreateModal(true);
    }
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Clinical Documentation</h1>
          <p className="text-gray-600">Create and manage clinical notes, assessments, and documentation</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all-notes">All Notes</TabsTrigger>
          <TabsTrigger value="create">Create New</TabsTrigger>
          <TabsTrigger value="approvals">Pending Approvals</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
        </TabsList>

        <TabsContent value="all-notes" className="space-y-6">
          <NotesList />
        </TabsContent>

        <TabsContent value="create" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {noteTypes.map((noteType) => {
              const IconComponent = noteType.icon;
              return (
                <Card key={noteType.type} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader className="pb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${noteType.color} text-white`}>
                        <IconComponent className="h-5 w-5" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{noteType.title}</CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="mb-4">{noteType.description}</CardDescription>
                    <Button 
                      onClick={() => handleCreateNote(noteType.type)}
                      className="w-full"
                      disabled={noteType.type === 'intake' && createIntakeAssessmentMutation.isPending}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      {noteType.type === 'intake' && createIntakeAssessmentMutation.isPending 
                        ? 'Creating...' 
                        : `Create ${noteType.title}`
                      }
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="approvals" className="space-y-6">
          <PendingApprovals />
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6">
          <ComplianceTracker />
        </TabsContent>
      </Tabs>

      <CreateNoteModal 
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          setSelectedNoteType(null);
        }}
        noteType={selectedNoteType}
      />
    </div>
  );
};

export default Documentation;
