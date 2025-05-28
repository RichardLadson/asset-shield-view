import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle } from "lucide-react";
import { ProgressStep } from "@/hooks/useProgressTracking";

interface ProgressModalProps {
  open: boolean;
  steps: ProgressStep[];
  progress: number;
  message: string;
  onComplete?: () => void;
}

export function ProgressModal({ open, progress, message, onComplete }: ProgressModalProps) {
  const isComplete = progress >= 100;
  
  // Debug logging
  if (import.meta.env.DEV) {
    console.log("🎯 ProgressModal render:", { open, progress, isComplete, message });
  }
  
  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Processing Your Application</DialogTitle>
          <DialogDescription className="sr-only">Processing your Medicaid application</DialogDescription>
        </DialogHeader>
        <div className="space-y-6 mt-4">
          {/* Animated icon - spinner while processing, checkmark when complete */}
          <div className="flex justify-center">
            {isComplete ? (
              <CheckCircle className="h-12 w-12 text-green-600" />
            ) : (
              <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
            )}
          </div>
          
          {/* Current step message */}
          <p className="text-center text-gray-700 font-medium">
            {isComplete ? "Application processed successfully!" : message}
          </p>
          
          {/* Progress bar */}
          <div className="space-y-2">
            <Progress value={progress} className="w-full h-3" />
            <p className="text-xs text-muted-foreground text-center">{Math.round(progress)}% Complete</p>
          </div>

          {/* Show button when complete, otherwise show waiting message */}
          {isComplete ? (
            <Button 
              onClick={onComplete} 
              className="w-full bg-shield-navy hover:bg-shield-navy/90"
            >
              View Results
            </Button>
          ) : (
            <p className="text-xs text-muted-foreground text-center">
              This may take a few moments. Please don't close this window.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}