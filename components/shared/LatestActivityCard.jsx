import React from 'react';

const LatestActivityCard = () => {
  const data = [
    {
      activity_description: "Modified Category 1 name from Toy to `Toys`",
      byUser: "Ben",
      timestamp: "January 15, 2025 14:00:00",
    },
    {
      activity_description: "Deleted Category 1",
      byUser: "Jefri",
      timestamp: "January 13, 2025 10:00:00",
    },
  ];

  return (
    <div className="max-w-xl p-6 mx-auto space-y-4 bg-white rounded-lg shadow-lg">
      <h1 className="pb-3 text-2xl font-bold text-gray-800 border-b">Latest Activities</h1>
      {data.length > 0 ? (
        data.map((activity, index) => (
          <div
            key={index}
            className="flex flex-col items-start justify-between pb-4 mb-4 border-b sm:flex-row sm:items-center last:border-b-0 last:pb-0 last:mb-0"
          >
            <div>
              <p className="font-medium text-gray-700">{activity.activity_description}</p>
              <p className="mt-1 text-sm text-gray-500">By {activity.byUser}</p>
            </div>
            <span className="mt-2 text-sm text-gray-400 sm:mt-0">{activity.timestamp}</span>
          </div>
        ))
      ) : (
        <p className="text-gray-500">No activities yet.</p>
      )}
    </div>
  );
};

export default LatestActivityCard;
