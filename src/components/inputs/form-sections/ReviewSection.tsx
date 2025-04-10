
import React from "react";
import { Card, CardContent } from "../../ui/card";
import { Button } from "../../ui/button";
import { Check, AlertCircle } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../../ui/collapsible";

interface ReviewSectionProps {
  // No specific props needed for this component
}

const ReviewSection: React.FC<ReviewSectionProps> = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Form Summary</h3>
            <p className="text-gray-600">
              Please review all the information you've provided before submitting.
              All fields marked with an asterisk (*) are required.
            </p>
          </div>
          
          <div className="flex items-center">
            <div className="mr-2 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 text-green-600">
              <Check className="h-4 w-4" />
            </div>
            <p>All required personal information is complete.</p>
          </div>

          <Collapsible
            open={isOpen}
            onOpenChange={setIsOpen}
            className="border rounded-md p-4 bg-slate-50"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-shield-navy" />
                <h4 className="text-sm font-medium">Important Submission Information</h4>
              </div>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm">
                  {isOpen ? "Hide Details" : "Show Details"}
                </Button>
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent className="mt-4 space-y-3 text-sm">
              <p>By submitting this form, you acknowledge that:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>All information provided is accurate to the best of your knowledge</li>
                <li>This form will be reviewed by our Medicaid planning specialists</li>
                <li>A consultation may be scheduled to discuss your eligibility and options</li>
                <li>You'll receive a detailed analysis of potential strategies to protect your assets</li>
              </ul>
            </CollapsibleContent>
          </Collapsible>
          
          <div className="border-t pt-4">
            <Button type="submit" className="w-full sm:w-auto bg-shield-navy hover:bg-shield-navy/90">
              Submit Medicaid Planning Intake Form
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReviewSection;
