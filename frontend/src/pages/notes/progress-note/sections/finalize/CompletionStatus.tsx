
import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

interface SectionStatus {
  name: string;
  isComplete: boolean;
  fields: string[];
}

interface CompletionStatusProps {
  sectionCompletionStatus: SectionStatus[];
}

const CompletionStatus: React.FC<CompletionStatusProps> = ({
  sectionCompletionStatus,
}) => {
  const allSectionsComplete = sectionCompletionStatus.every(section => section.isComplete);
  const incompleteSections = sectionCompletionStatus.filter(section => !section.isComplete);

  return (
    <div className={`border rounded-lg p-4 ${allSectionsComplete ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
      <div className="flex items-center space-x-2 mb-3">
        {allSectionsComplete ? (
          <>
            <CheckCircle className="h-5 w-5 text-green-600" />
            <h3 className="font-medium text-green-900">All Required Sections Complete</h3>
          </>
        ) : (
          <>
            <XCircle className="h-5 w-5 text-red-600" />
            <h3 className="font-medium text-red-900">Incomplete Required Sections</h3>
          </>
        )}
      </div>
      
      {!allSectionsComplete && (
        <div className="space-y-2">
          <p className="text-sm text-red-800 mb-2">Please complete the following sections before finalizing:</p>
          <ul className="space-y-1">
            {incompleteSections.map((section, index) => (
              <li key={index} className="text-sm text-red-800">
                <strong>{section.name}:</strong> {section.fields.join(', ')}
              </li>
            ))}
          </ul>
        </div>
      )}

      {allSectionsComplete && (
        <p className="text-sm text-green-800">Ready for finalization and signature.</p>
      )}
    </div>
  );
};

export default CompletionStatus;
