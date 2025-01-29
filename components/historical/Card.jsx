import React from "react";

const Card = ({ title, subtitle }) => {
  return (
    <div className="w-full max-w-sm p-6 bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-white text-2xl font-semibold">{title}</h2>
      <p className="text-gray-400 mt-2">{subtitle}</p>
    </div>
  );
};

export default Card;
