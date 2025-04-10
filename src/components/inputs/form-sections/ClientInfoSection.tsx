
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

interface ClientInfoSectionProps {
  formData: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDateChange: (name: string, date: Date | undefined) => void;
  handleSelectChange: (name: string, value: string) => void;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

const ClientInfoSection: React.FC<ClientInfoSectionProps> = ({
  formData,
  handleInputChange,
  handleDateChange,
  handleSelectChange,
  setFormData,
}) => {
  return (
    <Card>
      <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Date */}
        <div className="space-y-2">
          <Label htmlFor="clientDate">Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !formData.clientDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.clientDate ? (
                  format(formData.clientDate, "PPP")
                ) : (
                  <span>Select date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 pointer-events-auto">
              <Calendar
                mode="single"
                selected={formData.clientDate}
                onSelect={(date) => handleDateChange("clientDate", date)}
                initialFocus
                className="p-3"
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* File No. */}
        <div className="space-y-2">
          <Label htmlFor="fileNo">File No.</Label>
          <Input 
            id="fileNo" 
            name="fileNo" 
            value={formData.fileNo} 
            onChange={handleInputChange} 
          />
        </div>

        {/* Phone Numbers */}
        <div className="space-y-2">
          <Label htmlFor="homePhone">Home Phone No.</Label>
          <Input 
            id="homePhone" 
            name="homePhone" 
            value={formData.homePhone} 
            onChange={handleInputChange} 
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="cellPhone">Cell Phone No.</Label>
          <Input 
            id="cellPhone" 
            name="cellPhone" 
            value={formData.cellPhone} 
            onChange={handleInputChange} 
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="businessPhone">Business Phone No.</Label>
          <Input 
            id="businessPhone" 
            name="businessPhone" 
            value={formData.businessPhone} 
            onChange={handleInputChange} 
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="faxNo">Fax No.</Label>
          <Input 
            id="faxNo" 
            name="faxNo" 
            value={formData.faxNo} 
            onChange={handleInputChange} 
          />
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input 
            id="email" 
            name="email" 
            type="email" 
            value={formData.email} 
            onChange={handleInputChange} 
          />
        </div>

        {/* Names */}
        <div className="space-y-2">
          <Label htmlFor="applicantName">Full Name (Applicant)</Label>
          <Input 
            id="applicantName" 
            name="applicantName" 
            value={formData.applicantName} 
            onChange={handleInputChange} 
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="spouseName">Full Name (Spouse)</Label>
          <Input 
            id="spouseName" 
            name="spouseName" 
            value={formData.spouseName} 
            onChange={handleInputChange} 
          />
        </div>

        {/* Address */}
        <div className="space-y-2">
          <Label htmlFor="address">Street Address</Label>
          <Input 
            id="address" 
            name="address" 
            value={formData.address} 
            onChange={handleInputChange} 
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input 
            id="city" 
            name="city" 
            value={formData.city} 
            onChange={handleInputChange} 
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="state">State</Label>
          <Select onValueChange={(value) => handleSelectChange("state", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select state" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="AL">Alabama</SelectItem>
              <SelectItem value="AK">Alaska</SelectItem>
              <SelectItem value="AZ">Arizona</SelectItem>
              <SelectItem value="AR">Arkansas</SelectItem>
              <SelectItem value="CA">California</SelectItem>
              <SelectItem value="CO">Colorado</SelectItem>
              {/* More states would be added here */}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="zipCode">Zip Code</Label>
          <Input 
            id="zipCode" 
            name="zipCode" 
            value={formData.zipCode} 
            onChange={handleInputChange} 
          />
        </div>

        {/* Birth Dates */}
        <div className="space-y-2">
          <Label htmlFor="applicantBirthDate">Birth Date (Applicant)</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !formData.applicantBirthDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.applicantBirthDate ? (
                  format(formData.applicantBirthDate, "PPP")
                ) : (
                  <span>Select date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 pointer-events-auto">
              <Calendar
                mode="single"
                selected={formData.applicantBirthDate}
                onSelect={(date) => handleDateChange("applicantBirthDate", date)}
                initialFocus
                className="p-3"
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label htmlFor="spouseBirthDate">Birth Date (Spouse)</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !formData.spouseBirthDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.spouseBirthDate ? (
                  format(formData.spouseBirthDate, "PPP")
                ) : (
                  <span>Select date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 pointer-events-auto">
              <Calendar
                mode="single"
                selected={formData.spouseBirthDate}
                onSelect={(date) => handleDateChange("spouseBirthDate", date)}
                initialFocus
                className="p-3"
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* SSN */}
        <div className="space-y-2">
          <Label htmlFor="applicantSSN">Social Security Number (Applicant)</Label>
          <Input 
            id="applicantSSN" 
            name="applicantSSN" 
            value={formData.applicantSSN} 
            onChange={handleInputChange} 
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="spouseSSN">Social Security Number (Spouse)</Label>
          <Input 
            id="spouseSSN" 
            name="spouseSSN" 
            value={formData.spouseSSN} 
            onChange={handleInputChange} 
          />
        </div>

        {/* Citizenship */}
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="applicantCitizen" 
            name="applicantCitizen" 
            checked={formData.applicantCitizen}
            onCheckedChange={(checked) => 
              setFormData({...formData, applicantCitizen: checked as boolean})
            } 
          />
          <Label htmlFor="applicantCitizen">U.S. Citizen (Applicant)</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox 
            id="spouseCitizen" 
            name="spouseCitizen" 
            checked={formData.spouseCitizen}
            onCheckedChange={(checked) => 
              setFormData({...formData, spouseCitizen: checked as boolean})
            } 
          />
          <Label htmlFor="spouseCitizen">U.S. Citizen (Spouse)</Label>
        </div>

        {/* Veteran Status */}
        <div className="space-y-2">
          <Label htmlFor="veteranStatus">Veteran Status</Label>
          <Select onValueChange={(value) => handleSelectChange("veteranStatus", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="applicant">Applicant</SelectItem>
              <SelectItem value="spouse">Spouse</SelectItem>
              <SelectItem value="both">Both</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Marital Status */}
        <div className="space-y-2">
          <Label htmlFor="maritalStatus">Marital Status</Label>
          <Select onValueChange={(value) => handleSelectChange("maritalStatus", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="married">Married</SelectItem>
              <SelectItem value="single">Single</SelectItem>
              <SelectItem value="divorced">Divorced</SelectItem>
              <SelectItem value="widowed">Widowed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Emergency Contact */}
        <div className="space-y-2">
          <Label htmlFor="emergencyContactName">Emergency Contact Name</Label>
          <Input 
            id="emergencyContactName" 
            name="emergencyContactName" 
            value={formData.emergencyContactName} 
            onChange={handleInputChange} 
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="emergencyContactPhone">Emergency Contact Phone Number</Label>
          <Input 
            id="emergencyContactPhone" 
            name="emergencyContactPhone" 
            value={formData.emergencyContactPhone} 
            onChange={handleInputChange} 
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ClientInfoSection;
