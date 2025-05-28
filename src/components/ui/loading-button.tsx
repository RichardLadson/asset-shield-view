import * as React from "react";
import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface LoadingButtonProps extends ButtonProps {
  loading?: boolean;
  loadingText?: string;
}

const LoadingButton = React.forwardRef<HTMLButtonElement, LoadingButtonProps>(
  ({ className, children, loading, loadingText, disabled, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        className={cn(className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        )}
        {loading && loadingText ? loadingText : children}
      </Button>
    );
  }
);

LoadingButton.displayName = "LoadingButton";

export { LoadingButton };