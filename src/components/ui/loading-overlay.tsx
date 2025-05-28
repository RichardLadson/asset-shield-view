import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface LoadingOverlayProps {
  isLoading: boolean;
  message?: string;
  progress?: number | null;
  className?: string;
}

export function LoadingOverlay({ 
  isLoading, 
  message = "Loading...", 
  progress,
  className 
}: LoadingOverlayProps) {
  if (!isLoading) return null;

  return (
    <div className={cn(
      "fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm",
      className
    )}>
      <div className="flex flex-col items-center space-y-4 p-6 bg-card rounded-lg shadow-lg">
        <div className="relative">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-muted border-t-primary" />
        </div>
        
        <p className="text-sm font-medium text-muted-foreground">
          {message}
        </p>
        
        {progress !== null && progress !== undefined && (
          <div className="w-48">
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-muted-foreground mt-1 text-center">
              {Math.round(progress)}%
            </p>
          </div>
        )}
      </div>
    </div>
  );
}