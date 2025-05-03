import React from "react";
import { Card, CardContent } from "../../ui/card";
import { Separator } from "../../ui/separator";

interface ReviewSectionProps {
  formData: any;
}

// Helper for formatting currency
const formatCurrency = (value: string | number | undefined): string => {
  if (!value) return "$0.00";
  const numericValue = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(numericValue)) return "$0.00";
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numericValue);
};

// Helper for formatting dates
const formatDate = (date: Date | undefined): string => {
  if (!date) return "Not provided";
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
};

// Component for section header
const SectionHeader = ({ title }: { title: string }) => (
  <h3 className="text-xl font-medium text-shield-navy mb-4 border-b pb-2">{title}</h3>
);

// Component for info item
const InfoItem = ({ label, value }: { label: string; value: string | boolean | React.ReactNode }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 py-2">
    <div className="font-medium text-gray-700">{label}:</div>
    <div className="md:col-span-2">{
      typeof value === 'boolean' 
        ? (value ? 'Yes' : 'No') 
        : value || 'Not provided'
    }</div>
  </div>
);

const ReviewSection: React.FC<ReviewSectionProps> = ({ formData }) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="text-2xl font-semibold mb-6 text-center">Review Your Information</h3>
        <p className="text-gray-600 mb-6 text-center">
          Please review the information you've provided before submitting the form.
        </p>
        
        {/* Client Information */}
        <div className="mb-8">
          <SectionHeader title="Client Information" />
          <InfoItem label="Client Name" value={formData.applicantName} />
          <InfoItem label="Spouse Name" value={formData.spouseName} />
          <InfoItem label="Birth Date" value={formatDate(formData.applicantBirthDate)} />
          <InfoItem label="Spouse Birth Date" value={formatDate(formData.spouseBirthDate)} />
          <InfoItem label="Address" 
            value={`${formData.address || ''}, ${formData.city || ''}, ${formData.state || ''} ${formData.zipCode || ''}`} 
          />
          <InfoItem label="Phone" value={formData.cellPhone || formData.homePhone} />
          <InfoItem label="Email" value={formData.email} />
          <InfoItem label="Marital Status" value={formData.maritalStatus} />
          <InfoItem label="Veteran Status" value={formData.veteranStatus} />
        </div>
        
        {/* Medical Data */}
        <div className="mb-8">
          <SectionHeader title="Medical Information" />
          <InfoItem label="Primary Diagnosis" value={formData.primaryDiagnosis} />
          <InfoItem label="Facility Name" value={formData.facilityName} />
          <InfoItem label="Facility Entry Date" value={formatDate(formData.facilityEntryDate)} />
          <InfoItem label="Medical Status" value={formData.medicalStatus} />
          <InfoItem label="Recent Hospital Stay" value={formData.recentHospitalStay} />
          {formData.recentHospitalStay && (
            <InfoItem label="Hospital Stay Duration" value={formData.hospitalStayDuration} />
          )}
          <InfoItem label="Long-Term Care Insurance" value={formData.longTermCareInsurance} />
          {formData.longTermCareInsurance && (
            <InfoItem label="Insurance Details" value={formData.insuranceDetails} />
          )}
        </div>
        
        {/* Financial Summary */}
        <div className="mb-8 bg-slate-50 p-4 rounded-md">
          <h3 className="text-xl font-medium text-shield-navy mb-4">Financial Summary</h3>
          
          {/* Income Summary */}
          <div className="mb-4">
            <h4 className="font-medium mb-2">Monthly Income:</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Applicant Income:</p>
                <p className="font-medium">{formatCurrency(formData.applicantIncomeTotal)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Spouse Income:</p>
                <p className="font-medium">{formatCurrency(formData.spouseIncomeTotal)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Other Income:</p>
                <p className="font-medium">{formatCurrency(formData.otherIncomeTotal)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 font-semibold">Total Monthly Income:</p>
                <p className="font-bold text-shield-navy">{formatCurrency(formData.totalMonthlyIncome)}</p>
              </div>
            </div>
          </div>
          
          <Separator className="my-4" />
          
          {/* Expenses Summary */}
          <div className="mb-4">
            <h4 className="font-medium mb-2">Monthly Expenses:</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Housing Expenses:</p>
                <p className="font-medium">{formatCurrency(formData.housingExpenseTotal)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Personal Expenses:</p>
                <p className="font-medium">{formatCurrency(formData.personalExpenseTotal)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Medical Expenses:</p>
                <p className="font-medium">{formatCurrency(formData.medicalExpenseTotal)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 font-semibold">Total Monthly Expenses:</p>
                <p className="font-bold text-shield-navy">{formatCurrency(formData.totalMonthlyExpenses)}</p>
              </div>
            </div>
          </div>
          
          <Separator className="my-4" />
          
          {/* Assets Summary */}
          <div>
            <h4 className="font-medium mb-2">Assets:</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Bank Accounts:</p>
                <p className="font-medium">{formatCurrency(formData.totalBankAssets)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Investments:</p>
                <p className="font-medium">{formatCurrency(formData.totalInvestmentAssets)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Property:</p>
                <p className="font-medium">{formatCurrency(formData.totalPropertyAssets)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Personal Property:</p>
                <p className="font-medium">{formatCurrency(formData.totalPersonalAssets)}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-600 font-semibold">Total Asset Value:</p>
                <p className="font-bold text-xl text-shield-navy">{formatCurrency(formData.totalAssetValue)}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Additional Information */}
        <div className="mb-6">
          <SectionHeader title="Additional Information" />
          <InfoItem label="Trust Information" value={formData.trustInfo} />
          <InfoItem label="Gifts/Transfers" value={formData.giftsTransfers} />
          {formData.giftsTransfers && (
            <InfoItem label="Gift Details" value={formData.giftsDetails} />
          )}
          <InfoItem label="Power of Attorney" value={formData.powerOfAttorney} />
          <InfoItem label="Healthcare Proxy" value={formData.healthcareProxy} />
          <InfoItem label="Living Will" value={formData.livingWill} />
          <InfoItem label="Last Will & Testament" value={formData.lastWill} />
          <InfoItem label="Additional Notes" value={formData.additionalNotes} />
        </div>
        
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md">
          <p className="text-sm text-yellow-800">
            <span className="font-bold">Important:</span> By submitting this form, you confirm that the information 
            provided is accurate to the best of your knowledge. This information will be used to 
            assess Medicaid eligibility and develop asset protection strategies. You acknowledge 
            that Medicaid planning is subject to state-specific regulations and the 5-year look-back period.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReviewSection;