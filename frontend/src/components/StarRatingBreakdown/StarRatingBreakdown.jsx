import React from "react";
import "./Stars.css";

const StarRatingBreakdown = ({ starCounts }) => {
  const totalReviews = starCounts.reduce((acc, count) => acc + count, 0);

  return (
    <div className="star-rating-breakdown">
      <h3 className="text-lg font-medium mb-4">Stars Breakdown</h3>
      <ul className="list-none">
        {starCounts.map((count, index) => {
          const percentage = totalReviews ? (count / totalReviews) * 100 : 0;
          return (
            <li key={index} className="flex items-center mb-4">
              <div className="flex items-center mr-1 w-[40px]">
                <span className="mr-1">{index + 1}</span>
                <span className="star">&#9733;</span>
              </div>
              <div className="progress-bar-container flex-grow bg-gray-200 rounded h-6 overflow-hidden relative">
                <div
                  className="bg-yellow-400 h-full transition-width duration-1000 ease-in-out absolute top-0 left-0"
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
              <div className="ml-4 text-sm">{count}</div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default StarRatingBreakdown;
