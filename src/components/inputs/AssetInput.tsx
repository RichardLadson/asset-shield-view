import React from 'react';
import { Wallet } from 'lucide-react'; // Replacing Bank with Wallet, which is a more appropriate icon for financial assets

const AssetInput = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <Wallet className="mr-3 text-shield-navy" /> {/* Use Wallet icon instead of Bank */}
          Medicaid Planning Asset Input
        </h2>
      </div>
    </div>
  );
};

export default AssetInput;
