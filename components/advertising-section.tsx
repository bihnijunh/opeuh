import React from 'react';
import { Button } from "@/components/ui/button";

const AdvertisingSection: React.FC = () => {
  return (
    <div className="bg-blue-50 dark:bg-blue-950 p-6 rounded-lg shadow-md mt-8 transition-colors duration-200">
      <h2 className="text-2xl font-bold mb-4 text-blue-800 dark:text-blue-100">Special Offers</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl">
          <h3 className="text-lg font-semibold mb-3 text-blue-600 dark:text-blue-300">Premium Account Upgrade</h3>
          <p className="text-gray-700 dark:text-gray-200 mb-4">Unlock exclusive features and higher transaction limits!</p>
          <Button variant="default" className="w-full bg-blue-500 hover:bg-blue-600 text-white">
            Upgrade Now
          </Button>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl">
          <h3 className="text-lg font-semibold mb-3 text-blue-600 dark:text-blue-300">Refer a Friend</h3>
          <p className="text-gray-700 dark:text-gray-200 mb-4">Get $10 credit for each friend you refer to our platform!</p>
          <Button variant="default" className="w-full bg-green-500 hover:bg-green-600 text-white">
            Start Referring
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdvertisingSection;