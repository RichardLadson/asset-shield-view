
import React from "react";
import { Card, CardContent } from "../../ui/card";
import { Button } from "../../ui/button";
import { Check } from "lucide-react";

interface ReviewSectionProps {
  // No specific props needed for this component
}

const ReviewSection: React.FC<ReviewSectionProps> = () => {
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
          
          <div className="border-t pt-4">
            <Button type="submit" className="w-full sm:w-auto">
              Submit Medicaid Planning Intake Form
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReviewSection;
