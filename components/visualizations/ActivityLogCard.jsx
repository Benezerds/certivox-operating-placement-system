import React from "react";
import { formatDistanceToNow } from "date-fns";

const ActivityLogCard = ({ activity }) => {
  if (!activity) return null; // Prevent rendering if activity is undefined

  const { activity_title, activity_description, byUser, timestamp } = activity;

  return (
    <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-gray-800">{activity_title}</h3>
      <p className="text-sm text-gray-600">{activity_description}</p>
      <div className="mt-2 text-xs text-gray-500">
        <span className="font-medium">{byUser}</span> •{" "}
        {timestamp ? formatDistanceToNow(new Date(timestamp), { addSuffix: true }) : "Unknown time"}
      </div>
    </div>
  );
};

export default ActivityLogCard;
