import React from "react";

const SideBar = ({ activeTab, setActiveTab }) => {
  return (
    <div className="bg-gray-100 w-64 p-4">
      <button
        onClick={() => setActiveTab("Reviews")}
        className={`w-full text-left px-4 py-2 rounded-md ${
          activeTab === "Reviews"
            ? "bg-blue-500 text-white"
            : "bg-gray-200 text-gray-700"
        }`}
      >
        Reviews
      </button>
      <button
        onClick={() => setActiveTab("Sentiments")}
        className={`w-full text-left px-4 py-2 rounded-md mt-2 ${
          activeTab === "Sentiments"
            ? "bg-blue-500 text-white"
            : "bg-gray-200 text-gray-700"
        }`}
      >
        Sentiments
      </button>
      <button
        onClick={() => setActiveTab("Ratings")}
        className={`w-full text-left px-4 py-2 rounded-md mt-2 ${
          activeTab === "Ratings"
            ? "bg-blue-500 text-white"
            : "bg-gray-200 text-gray-700"
        }`}
      >
        Ratings
      </button>
    </div>
  );
};

export default SideBar;
