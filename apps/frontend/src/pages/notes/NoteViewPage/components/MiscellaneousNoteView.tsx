import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/basic/card';
import { InfoDisplay, InfoSection } from '@/components/basic/InfoDisplay';
import { FileText, AlertTriangle, Clock, CheckCircle, Calendar, Users } from 'lucide-react';
import { format } from 'date-fns';
import { NOTE_CATEGORIES, URGENCY_LEVELS } from '@/types/enums/notesEnum';

interface MiscellaneousNoteViewProps {
  noteData: any;
}

const MiscellaneousNoteView: React.FC<MiscellaneousNoteViewProps> = ({ noteData }) => {
  const getNoteCategoryLabel = (value: string) => {
    const category = NOTE_CATEGORIES.find(c => c.value === value);
    return category ? category.label : value;
  };

  const getUrgencyLevelLabel = (value: string) => {
    const urgency = URGENCY_LEVELS.find(u => u.value === value);
    return urgency ? urgency.label : value;
  };

  return (
    <>
      {/* Note Information Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            Note Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <InfoSection title="Basic Details">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoDisplay 
                label="Event/Activity Date" 
                value={noteData.content.eventDate ? format(new Date(noteData.content.eventDate), 'PPP') : null} 
              />
              <InfoDisplay 
                label="Note Date" 
                value={noteData.content.noteDate ? format(new Date(noteData.content.noteDate), 'PPP') : null} 
              />
              <InfoDisplay 
                label="Note Category" 
                value={getNoteCategoryLabel(noteData.content.noteCategory)} 
              />
              <InfoDisplay 
                label="Note Subtype" 
                value={noteData.content.noteSubtype} 
              />
              <InfoDisplay 
                label="Urgency Level" 
                value={getUrgencyLevelLabel(noteData.content.urgencyLevel)} 
              />
              <InfoDisplay 
                label="Note Title" 
                value={noteData.content.noteTitle} 
              />
            </div>
          </InfoSection>
        </CardContent>
      </Card>

      {/* Note Content Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-indigo-600" />
            Note Content
          </CardTitle>
        </CardHeader>
        <CardContent>
          <InfoSection title="Content Details">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoDisplay 
                label="Brief Description" 
                value={noteData.content.noteDescription} 
              />
              <InfoDisplay 
                label="Detailed Notes" 
                value={noteData.content.detailedNotes} 
              />
            </div>
          </InfoSection>
        </CardContent>
      </Card>

      {/* Related Persons Section */}
      {noteData.content.relatedPersons && noteData.content.relatedPersons.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-green-600" />
              Related Persons
            </CardTitle>
          </CardHeader>
          <CardContent>
            <InfoSection title="Person Information">
              <div className="space-y-4">
                {noteData.content.relatedPersons.map((person, index) => (
                  <div key={index} className="border rounded-lg p-4 bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <InfoDisplay 
                        label="Name" 
                        value={person.name} 
                      />
                      <InfoDisplay 
                        label="Relationship" 
                        value={person.relationship} 
                      />
                      <InfoDisplay 
                        label="Role" 
                        value={person.role} 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </InfoSection>
          </CardContent>
        </Card>
      )}

      {/* Legal & Compliance Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            Legal & Compliance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <InfoSection title="Compliance Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoDisplay 
                label="Mandatory Reporting" 
                value={noteData.content.mandatoryReporting ? 'Yes' : 'No'} 
              />
              {noteData.content.mandatoryReporting && (
                <InfoDisplay 
                  label="Reporting Details" 
                  value={noteData.content.reportingDetails} 
                />
              )}
              <InfoDisplay 
                label="Legal Implications" 
                value={noteData.content.legalImplications} 
              />
            </div>
          </InfoSection>
        </CardContent>
      </Card>

      {/* Outcomes Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Outcomes & Resolution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <InfoSection title="Outcome Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoDisplay 
                label="Follow-up Required" 
                value={noteData.content.followUpRequired ? 'Yes' : 'No'} 
              />
              {noteData.content.followUpRequired && (
                <InfoDisplay 
                  label="Follow-up Details" 
                  value={noteData.content.followUpDetails} 
                />
              )}
              <InfoDisplay 
                label="Resolution" 
                value={noteData.content.resolution} 
              />
              <InfoDisplay 
                label="Outcome Summary" 
                value={noteData.content.outcomeSummary} 
              />
            </div>
          </InfoSection>
        </CardContent>
      </Card>
    </>
  );
};

export default MiscellaneousNoteView;
