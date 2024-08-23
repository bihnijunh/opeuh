import React from 'react';

const AdvertisingSection: React.FC = () => {
  return (
    <div className="bg-blue-100 dark:bg-blue-900 p-6 rounded-lg shadow-md mt-8">
      <h2 className="text-2xl font-bold mb-4 text-blue-800 dark:text-blue-200">Special Offers</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-md shadow">
          <h3 className="text-lg font-semibold mb-2 text-blue-600 dark:text-blue-300">Premium Account Upgrade</h3>
          <p className="text-gray-600 dark:text-gray-300">Unlock exclusive features and higher transaction limits!</p>
          <button className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
            Upgrade Now
          </button>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-md shadow">
          <h3 className="text-lg font-semibold mb-2 text-blue-600 dark:text-blue-300">Refer a Friend</h3>
          <p className="text-gray-600 dark:text-gray-300">Get $10 credit for each friend you refer to our platform!</p>
          <button className="mt-4 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
            Start Referring
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdvertisingSection;