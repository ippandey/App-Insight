import React, { useState } from "react";
import AsyncSelect from "react-select/async";


const InputForm = ({
  appIdInput,
  setAppIdInput,
  reviewCount,
  handleReviewCountChange,
  duration,
  handleDurationChange,
  sortBy,
  handleSortByChange,
  handleSubmit,
}) => {
  const loadSuggestions = async (inputValue) => {
    if (!inputValue) return [];
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/search?query=${encodeURIComponent(inputValue)}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch app suggestions");
      }
      const data = await response.json();
      return data.map((app) => ({
        value: app.appId,
        label: (
          <div className="flex items-center">
            <img
              src={app.icon}
              alt={app.title}
              style={{ width: 20, height: 20, marginRight: 10 }}
            />
            {`${app.title} (${app.developer})`}
          </div>
        ),
        icon: app.icon,
      }));
    } catch (error) {
      console.error("Error fetching app suggestions:", error);
      return [];
    }
  };

  const handleAppSelect = (selectedOption) => {
    setAppIdInput(selectedOption ? selectedOption.value : "");
  };

  return (
    <section className="container mx-auto border-gray-300 border-[1px] p-4 rounded-[12px] w-2/3 mb-10">
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2"
      >
        <div className="space-y-4">
          <label className="block">
            Enter Google Play Store App Name
            <AsyncSelect
              loadOptions={loadSuggestions}
              onChange={handleAppSelect}
              defaultOptions
              placeholder="Search for an app"
              className="rounded-md mt-1 w-full focus:outline-none"
            />
          </label>

          <label className="block">
            Number of Reviews to Fetch
            <input
              type="number"
              value={reviewCount}
              onChange={handleReviewCountChange}
              className="border border-gray-500 rounded-md p-2 mt-1 w-full focus:outline-none"
              min="1"
              max="1000"
            />
          </label>
        </div>

        <div className="space-y-4">
          <label className="block">
            Duration
            <select
              value={duration}
              onChange={handleDurationChange}
              className="border border-gray-500 rounded-md p-2 mt-1 w-full focus:outline-none"
            >
              <option value="alltime">All Time</option>
              <option value="lastyear">Last Year</option>
              <option value="lastmonth">Last Month</option>
              <option value="lastweek">Last Week</option>
            </select>
          </label>

          <label className="block">
            Sort by
            <select
              value={sortBy}
              onChange={handleSortByChange}
              className="border border-gray-500 rounded-md p-2 mt-1 w-full focus:outline-none"
            >
              <option value="newest">Newest</option>
              <option value="mostrelevant">Most Relevant</option>
            </select>
          </label>
        </div>

        <div className="sm:col-span-2">
          <button
            type="submit"
            className="bg-blue-500 text-white rounded-md p-2 w-full focus:outline-none hover:bg-blue-600"
          >
            Submit
          </button>
        </div>
      </form>
    </section>
  );
};

export default InputForm;
