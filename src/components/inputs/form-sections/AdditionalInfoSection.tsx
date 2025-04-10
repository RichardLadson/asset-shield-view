
import React from "react";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Card, CardContent } from "../../ui/card";
import { Checkbox } from "../../ui/checkbox";
import { Textarea } from "../../ui/textarea";

interface AdditionalInfoSectionProps {
  formData: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleTextareaChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

const AdditionalInfoSection: React.FC<AdditionalInfoSectionProps> = ({
  formData,
  handleInputChange,
  handleTextareaChange,
  setFormData,
}) => {
  return (
    <Card>
      <CardContent className="pt-6">
        {/* Trusts */}
        <h3 className="text-lg font-medium mb-4">Trusts and Transfers</h3>
        <div className="grid grid-cols-1 gap-6 mb-6">
          <div className="space-y-2">
            <Label htmlFor="trustInfo">Trust Information</Label>
            <Input 
              id="trustInfo" 
              name="trustInfo" 
              value={formData.trustInfo} 
              onChange={handleInputChange} 
              placeholder="Details about any trust arrangements"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="giftsTransfers" 
                name="giftsTransfers" 
                checked={formData.giftsTransfers}
                onCheckedChange={(checked) => 
                  setFormData({...formData, giftsTransfers: checked as boolean})
                } 
              />
              <Label htmlFor="giftsTransfers">Gifts/Transfers in Past 60 Months</Label>
            </div>
            {formData.giftsTransfers && (
              <div className="mt-2">
                <Label htmlFor="giftsDetails">Gift/Transfer Details</Label>
                <Input 
                  id="giftsDetails" 
                  name="giftsDetails" 
                  value={formData.giftsDetails} 
                  onChange={handleInputChange} 
                  placeholder="Recipient, date, amount, reason"
                />
              </div>
            )}
          </div>
        </div>

        {/* Legal Documents */}
        <h3 className="text-lg font-medium mb-4">Legal Documents</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="powerOfAttorney" 
              name="powerOfAttorney" 
              checked={formData.powerOfAttorney}
              onCheckedChange={(checked) => 
                setFormData({...formData, powerOfAttorney: checked as boolean})
              } 
            />
            <Label htmlFor="powerOfAttorney">Power of Attorney</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox 
              id="healthcareProxy" 
              name="healthcareProxy" 
              checked={formData.healthcareProxy}
              onCheckedChange={(checked) => 
                setFormData({...formData, healthcareProxy: checked as boolean})
              } 
            />
            <Label htmlFor="healthcareProxy">Healthcare Proxy</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox 
              id="livingWill" 
              name="livingWill" 
              checked={formData.livingWill}
              onCheckedChange={(checked) => 
                setFormData({...formData, livingWill: checked as boolean})
              } 
            />
            <Label htmlFor="livingWill">Living Will</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox 
              id="lastWill" 
              name="lastWill" 
              checked={formData.lastWill}
              onCheckedChange={(checked) => 
                setFormData({...formData, lastWill: checked as boolean})
              } 
            />
            <Label htmlFor="lastWill">Last Will and Testament</Label>
          </div>
        </div>

        {/* Additional Notes */}
        <h3 className="text-lg font-medium mb-4">Additional Notes</h3>
        <div className="space-y-2">
          <Label htmlFor="additionalNotes">Other Relevant Information</Label>
          <Textarea
            id="additionalNotes"
            name="additionalNotes"
            value={formData.additionalNotes}
            onChange={handleTextareaChange}
            className="w-full min-h-[100px]"
            placeholder="Any other information that may be relevant..."
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default AdditionalInfoSection;
