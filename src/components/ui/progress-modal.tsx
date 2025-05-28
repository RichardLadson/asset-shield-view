import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Circle, Loader2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProgressStep } from "@/hooks/useProgressTracking";

interface ProgressModalProps {
  open: boolean;
  steps: ProgressStep[];
  progress: number;
  message: string;
}

export function ProgressModal({ open, steps, progress, message }: ProgressModalProps) {
  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Processing Your Application</DialogTitle>
          <DialogDescription>{message}</DialogDescription>
        </DialogHeader>
        <div className="space-y-6 mt-4">

          <Progress value={progress} className="w-full h-2" />

          <div className="space-y-3">
            {steps.map((step) => (
              <div key={step.id} className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  {step.status === 'completed' && (
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  )}
                  {step.status === 'active' && (
                    <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
                  )}
                  {step.status === 'error' && (
                    <XCircle className="h-5 w-5 text-red-600" />
                  )}
                  {step.status === 'pending' && (
                    <Circle className="h-5 w-5 text-gray-400" />
                  )}
                </div>
                <div className={cn(
                  "text-sm",
                  step.status === 'completed' && "text-green-700",
                  step.status === 'active' && "text-blue-700 font-medium",
                  step.status === 'error' && "text-red-700",
                  step.status === 'pending' && "text-gray-500"
                )}>
                  {step.label}
                </div>
              </div>
            ))}
          </div>

          <p className="text-xs text-muted-foreground text-center">
            Please wait while we process your information...
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}