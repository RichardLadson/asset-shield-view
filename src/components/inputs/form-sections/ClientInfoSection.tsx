import React, { useState } from "react";
import { format, parse, isValid } from "date-fns";
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

// Custom date input component that allows both calendar and manual entry
const BirthDateInput = ({ 
  label, 
  value, 
  onChange, 
  id,
  name
}: { 
  label: string; 
  value?: Date; 
  onChange: (name: string, date?: Date) => void;
  id: string;
  name: string;
}) => {
  const [inputDate, setInputDate] = useState<string>(
    value ? format(value, 'MM/dd/yyyy') : ''
  );
  const [showCalendar, setShowCalendar] = useState<boolean>(true);
  
  const handleManualInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputDate(val);
    
    // Try to parse the date
    if (val.length === 10) { // MM/DD/YYYY format
      try {
        const parsedDate = parse(val, 'MM/dd/yyyy', new Date());
        if (isValid(parsedDate)) {
          onChange(name, parsedDate);
        }
      } catch (error) {
        // Invalid date format - do nothing
      }
    }
  };
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <Label htmlFor={id}>{label}</Label>
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          onClick={() => setShowCalendar(!showCalendar)}
          className="h-7 px-2 text-xs"
        >
          {showCalendar ? "Enter Manually" : "Use Calendar"}
        </Button>
      </div>
      
      {showCalendar ? (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id={id}
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !value && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {value ? (
                format(value, "PPP")
              ) : (
                <span>Select date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 pointer-events-auto">
            <Calendar
              mode="single"
              selected={value}
              onSelect={(date) => onChange(name, date)}
              initialFocus
              className="p-3"
            />
          </PopoverContent>
        </Popover>
      ) : (
        <Input
          id={id}
          placeholder="MM/DD/YYYY"
          value={inputDate}
          onChange={handleManualInput}
        />
      )}
    </div>
  );
};

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
                  <span>Today</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 pointer-events-auto">
              <Calendar
                mode="single"
                selected={formData.clientDate || new Date()}
                onSelect={(date) => handleDateChange("clientDate", date)}
                initialFocus
                className="p-3"
              />
            </PopoverContent>
          </Popover>
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

        {/* Names - replaced single field with separate first and last name fields */}
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name (Applicant) *</Label>
          <Input 
            id="firstName" 
            name="firstName" 
            value={formData.firstName} 
            onChange={handleInputChange} 
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name (Applicant) *</Label>
          <Input 
            id="lastName" 
            name="lastName" 
            value={formData.lastName} 
            onChange={handleInputChange} 
            required
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
          <Label htmlFor="state">State *</Label>
          <Select 
            onValueChange={(value) => handleSelectChange("state", value)}
            value={formData.state}
          >
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
              <SelectItem value="CT">Connecticut</SelectItem>
              <SelectItem value="DE">Delaware</SelectItem>
              <SelectItem value="FL">Florida</SelectItem>
              <SelectItem value="GA">Georgia</SelectItem>
              <SelectItem value="HI">Hawaii</SelectItem>
              <SelectItem value="ID">Idaho</SelectItem>
              <SelectItem value="IL">Illinois</SelectItem>
              <SelectItem value="IN">Indiana</SelectItem>
              <SelectItem value="IA">Iowa</SelectItem>
              <SelectItem value="KS">Kansas</SelectItem>
              <SelectItem value="KY">Kentucky</SelectItem>
              <SelectItem value="LA">Louisiana</SelectItem>
              <SelectItem value="ME">Maine</SelectItem>
              <SelectItem value="MD">Maryland</SelectItem>
              <SelectItem value="MA">Massachusetts</SelectItem>
              <SelectItem value="MI">Michigan</SelectItem>
              <SelectItem value="MN">Minnesota</SelectItem>
              <SelectItem value="MS">Mississippi</SelectItem>
              <SelectItem value="MO">Missouri</SelectItem>
              <SelectItem value="MT">Montana</SelectItem>
              <SelectItem value="NE">Nebraska</SelectItem>
              <SelectItem value="NV">Nevada</SelectItem>
              <SelectItem value="NH">New Hampshire</SelectItem>
              <SelectItem value="NJ">New Jersey</SelectItem>
              <SelectItem value="NM">New Mexico</SelectItem>
              <SelectItem value="NY">New York</SelectItem>
              <SelectItem value="NC">North Carolina</SelectItem>
              <SelectItem value="ND">North Dakota</SelectItem>
              <SelectItem value="OH">Ohio</SelectItem>
              <SelectItem value="OK">Oklahoma</SelectItem>
              <SelectItem value="OR">Oregon</SelectItem>
              <SelectItem value="PA">Pennsylvania</SelectItem>
              <SelectItem value="RI">Rhode Island</SelectItem>
              <SelectItem value="SC">South Carolina</SelectItem>
              <SelectItem value="SD">South Dakota</SelectItem>
              <SelectItem value="TN">Tennessee</SelectItem>
              <SelectItem value="TX">Texas</SelectItem>
              <SelectItem value="UT">Utah</SelectItem>
              <SelectItem value="VT">Vermont</SelectItem>
              <SelectItem value="VA">Virginia</SelectItem>
              <SelectItem value="WA">Washington</SelectItem>
              <SelectItem value="WV">West Virginia</SelectItem>
              <SelectItem value="WI">Wisconsin</SelectItem>
              <SelectItem value="WY">Wyoming</SelectItem>
              <SelectItem value="DC">District of Columbia</SelectItem>
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
        <BirthDateInput
          label="Birth Date (Applicant) *"
          value={formData.applicantBirthDate}
          onChange={handleDateChange}
          id="applicantBirthDate"
          name="applicantBirthDate"
        />

        <BirthDateInput
          label="Birth Date (Spouse)"
          value={formData.spouseBirthDate}
          onChange={handleDateChange}
          id="spouseBirthDate"
          name="spouseBirthDate"
        />

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
          <Label htmlFor="maritalStatus">Marital Status *</Label>
          <Select 
            onValueChange={(value) => handleSelectChange("maritalStatus", value)}
            value={formData.maritalStatus}
          >
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
      <div className="px-6 pb-4 text-sm text-gray-500">
        Fields marked with * are required.
      </div>
    </Card>
  );
};

export default ClientInfoSection;
