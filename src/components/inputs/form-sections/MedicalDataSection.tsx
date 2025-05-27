
import React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../../ui/button";
import { Calendar } from "../../ui/calendar";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import { Card, CardContent } from "../../ui/card";
import { Checkbox } from "../../ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";

interface MedicalDataSectionProps {
  formData: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDateChange: (name: string, date: Date | undefined) => void;
  handleSelectChange: (name: string, value: string) => void;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

const MedicalDataSection: React.FC<MedicalDataSectionProps> = ({
  formData,
  handleInputChange,
  handleDateChange,
  handleSelectChange,
  setFormData,
}) => {
  return (
    <Card>
      <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Primary Diagnosis */}
        <div className="space-y-2">
          <Label htmlFor="primaryDiagnosis">Primary Diagnosis</Label>
          <Input 
            id="primaryDiagnosis" 
            name="primaryDiagnosis" 
            value={formData.primaryDiagnosis} 
            onChange={handleInputChange} 
          />
        </div>

        {/* Nursing Home */}
        <div className="space-y-2">
          <Label htmlFor="facilityName">Name of Facility</Label>
          <Input 
            id="facilityName" 
            name="facilityName" 
            value={formData.facilityName} 
            onChange={handleInputChange} 
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="facilityEntryDate">Date Entered Nursing Home</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !formData.facilityEntryDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.facilityEntryDate ? (
                  format(formData.facilityEntryDate, "PPP")
                ) : (
                  <span>Select date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 pointer-events-auto">
              <Calendar
                mode="single"
                selected={formData.facilityEntryDate}
                onSelect={(date) => handleDateChange("facilityEntryDate", date)}
                initialFocus
                className="p-3"
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Medical Status */}
        <div className="space-y-2">
          <Label htmlFor="medicalStatus">Current Medical Status</Label>
          <Select 
            value={formData.medicalStatus} 
            onValueChange={(value) => handleSelectChange("medicalStatus", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="good">Good</SelectItem>
              <SelectItem value="fair">Fair</SelectItem>
              <SelectItem value="declining">Declining</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Recent Hospital Stay */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="recentHospitalStay" 
              name="recentHospitalStay" 
              checked={formData.recentHospitalStay}
              onCheckedChange={(checked) => 
                setFormData({...formData, recentHospitalStay: checked as boolean})
              } 
            />
            <Label htmlFor="recentHospitalStay">Recent Hospital Stay</Label>
          </div>
          {formData.recentHospitalStay && (
            <div className="mt-2">
              <Label htmlFor="hospitalStayDuration">Duration (days)</Label>
              <Input 
                id="hospitalStayDuration" 
                name="hospitalStayDuration" 
                type="number" 
                value={formData.hospitalStayDuration} 
                onChange={handleInputChange} 
              />
            </div>
          )}
        </div>

        {/* Long-Term Care Insurance */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="longTermCareInsurance" 
              name="longTermCareInsurance" 
              checked={formData.longTermCareInsurance}
              onCheckedChange={(checked) => 
                setFormData({...formData, longTermCareInsurance: checked as boolean})
              } 
            />
            <Label htmlFor="longTermCareInsurance">Long-Term Care Insurance</Label>
          </div>
          {formData.longTermCareInsurance && (
            <div className="mt-2">
              <Label htmlFor="insuranceDetails">Insurance Provider and Policy Details</Label>
              <Input 
                id="insuranceDetails" 
                name="insuranceDetails" 
                value={formData.insuranceDetails} 
                onChange={handleInputChange} 
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MedicalDataSection;
