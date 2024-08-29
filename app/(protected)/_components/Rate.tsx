import React from 'react';

export default function RateChange() {
  return (
    <div className="p-4">
      <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center border-b border-gray-300 pb-4 mb-4">
          <div className="font-bold text-2xl text-blue-800">Card Rate</div>
          <div className="flex space-x-8">
            <div className="font-semibold text-lg text-green-700">Sub</div>
            <div className="font-semibold text-lg text-indigo-700">Naira Rate</div>
            <div className="font-semibold text-lg text-red-600">Trend</div>
          </div>
        </div>
        <div className="space-y-6">
          {[
            { name: 'iTunes', subname: 'iTunes', sub: '[1~2000]', nairaRate: '₦1198', trend: 'hot' },
            { name: 'Steam', subname: 'Steam-GBP', sub: 'GBP', nairaRate: '₦1371', trend: 'hot' },
            { name: 'Steam', subname: 'Steam-CHF', sub: 'CHF', nairaRate: '₦1371', trend: 'hot' },
            { name: 'Steam', subname: 'Steam-USD', sub: 'USD', nairaRate: '₦1371', trend: 'hot' },
          ].map((item, index) => (
            <React.Fragment key={index}>
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-bold text-xl text-gray-800">{item.name}</div>
                  <div className="text-gray-600">{item.subname}</div>
                </div>
                <div className="flex space-x-8 items-center">
                  <div className="text-green-700 font-semibold">{item.sub}</div>
                  <div className="text-indigo-700 font-semibold">{item.nairaRate}</div>
                  <div className="text-red-600 font-semibold flex items-center">
                    <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                    </svg>
                    {item.trend}
                  </div>
                </div>
              </div>
              {index < 3 && <div className="border-t border-gray-300"></div>}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}