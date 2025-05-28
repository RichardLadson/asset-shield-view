import React from 'react';
import { Alert, AlertDescription } from './alert';
import { Button } from './button';
import { Clock, X, FileText } from 'lucide-react';

interface DraftRecoveryBannerProps {
  draftAge: number; // in hours
  onRestore: () => void;
  onDismiss: () => void;
  onClear: () => void;
}

export const DraftRecoveryBanner: React.FC<DraftRecoveryBannerProps> = ({
  draftAge,
  onRestore,
  onDismiss,
  onClear
}) => {
  const formatAge = (hours: number): string => {
    if (hours < 1) return 'Less than an hour ago';
    if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days === 1 ? '' : 's'} ago`;
  };

  return (
    <Alert className="mb-6 border-blue-200 bg-blue-50">
      <FileText className="h-4 w-4 text-blue-600" />
      <AlertDescription className="flex items-center justify-between w-full">
        <div className="flex items-center space-x-2">
          <Clock className="h-4 w-4 text-blue-600" />
          <span className="text-blue-800">
            <strong>Draft Found:</strong> We found a saved form from {formatAge(draftAge)}.
          </span>
        </div>
        <div className="flex items-center space-x-2 ml-4">
          <Button
            variant="outline"
            size="sm"
            onClick={onRestore}
            className="bg-blue-600 text-white hover:bg-blue-700 border-blue-600"
          >
            Restore Draft
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onClear}
            className="text-gray-600 hover:text-gray-800"
          >
            Start Fresh
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDismiss}
            className="text-gray-400 hover:text-gray-600 p-1"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
};