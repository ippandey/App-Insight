import React, { useState, useEffect } from "react";
import "./App.css";
import Loading from "./components/Loading/Loading";
import Header from "./components/Header/Header";
import InputForm from "./components/Form/InputForm";
import PieChart from "./components/PieChart/PieChart";
import BarGraph from "./components/BarGraph/BarGraph";
import ReviewTable from "./components/ReviewTable/ReviewTable";
import SideBar from "./components/SideBar/SideBar";
import StarRatingBreakdown from "./components/StarRatingBreakdown/StarRatingBreakdown";
import Footer from "./components/Footer/Footer";

const App = () => {
  const [appIdInput, setAppIdInput] = useState(
    localStorage.getItem("appIdInput") || ""
  );
  const [reviewCount, setReviewCount] = useState(
    localStorage.getItem("reviewCount") || ""
  );
  const [reviews, setReviews] = useState(
    JSON.parse(localStorage.getItem("reviews")) || []
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showChart, setShowChart] = useState(
    localStorage.getItem("showChart") === "true" ? true : false
  );
  const [aspectKeywordsData, setAspectKeywordsData] = useState(
    JSON.parse(localStorage.getItem("aspectKeywordsData")) || null
  );
  const [sortBy, setSortBy] = useState(
    localStorage.getItem("sortBy") || "newest"
  );
  const [activeTab, setActiveTab] = useState(
    localStorage.getItem("activeTab") || "Reviews"
  );
  const [reviewsFetched, setReviewsFetched] = useState(
    localStorage.getItem("reviewsFetched") === "true" ? true : false
  );
  const [averageRating, setAverageRating] = useState(
    localStorage.getItem("averageRating") || 0
  );
  const [totalRatings, setTotalRatings] = useState(
    localStorage.getItem("totalRatings") || 0
  );
  const [duration, setDuration] = useState(
    localStorage.getItem("duration") || "alltime"
  );
  const [starCounts, setStarCounts] = useState(
    JSON.parse(localStorage.getItem("starCounts")) || [0, 0, 0, 0, 0]
  );
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    // Save critical state to localStorage
    localStorage.setItem("appIdInput", appIdInput);
    localStorage.setItem("reviewCount", reviewCount);
    localStorage.setItem("reviews", JSON.stringify(reviews));
    localStorage.setItem("showChart", showChart);
    localStorage.setItem(
      "aspectKeywordsData",
      JSON.stringify(aspectKeywordsData)
    );
    localStorage.setItem("sortBy", sortBy);
    localStorage.setItem("activeTab", activeTab);
    localStorage.setItem("reviewsFetched", reviewsFetched);
    localStorage.setItem("averageRating", averageRating);
    localStorage.setItem("totalRatings", totalRatings);
    localStorage.setItem("duration", duration);
    localStorage.setItem("starCounts", JSON.stringify(starCounts));
  }, [
    appIdInput,
    reviewCount,
    reviews,
    showChart,
    aspectKeywordsData,
    sortBy,
    activeTab,
    reviewsFetched,
    averageRating,
    totalRatings,
    duration,
    starCounts,
  ]);

  const fetchReviews = async () => {
    if (appIdInput.trim() === "") {
      setError("Please enter an app ID or URL.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `${apiUrl}/reviews/${encodeURIComponent(
          appIdInput.trim()
        )}?count=${reviewCount}&duration=${duration}&sort=${sortBy}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch reviews");
      }
      const data = await response.json();
      setReviews(data);
      setLoading(false);
      setShowChart(true);
      setReviewsFetched(true);
      generateAspectKeywordsData(data);
      calculateRatingAnalysis(data);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const calculateRatingAnalysis = (reviewsData) => {
    const totalRatingsCount = reviewsData.length;
    const totalRatingsSum = reviewsData.reduce(
      (acc, review) => acc + review.score,
      0
    );
    const average = (totalRatingsSum / totalRatingsCount).toFixed(2);
    setTotalRatings(totalRatingsCount);
    setAverageRating(average);

    // Calculate star ratings
    const starCounts = [0, 0, 0, 0, 0]; // For 1, 2, 3, 4, and 5 stars

    reviewsData.forEach((review) => {
      if (review.score >= 1 && review.score <= 5) {
        starCounts[review.score - 1] += 1;
      }
    });

    setStarCounts(starCounts);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    setShowChart(false);
    setReviewsFetched(false);
    fetchReviews();
  };

  const handleReviewCountChange = (e) => {
    setReviewCount(Number(e.target.value));
  };

  const handleDurationChange = (e) => setDuration(e.target.value);

  const handleSortByChange = (e) => {
    setSortBy(e.target.value);
  };

  const handleNewAnalysis = () => {
    setAppIdInput("");
    setReviewCount("");
    setReviews([]);
    setShowChart(false);
    setAspectKeywordsData(null);
    setSortBy("newest");
    setActiveTab("Reviews");
    setReviewsFetched(false);
    setAverageRating(0);
    setTotalRatings(0);
    setDuration("alltime");
    setStarCounts([0, 0, 0, 0, 0]);

    // Clear localStorage
    localStorage.removeItem("appIdInput");
    localStorage.removeItem("reviewCount");
    localStorage.removeItem("reviews");
    localStorage.removeItem("showChart");
    localStorage.removeItem("aspectKeywordsData");
    localStorage.removeItem("sortBy");
    localStorage.removeItem("activeTab");
    localStorage.removeItem("reviewsFetched");
    localStorage.removeItem("averageRating");
    localStorage.removeItem("totalRatings");
    localStorage.removeItem("duration");
    localStorage.removeItem("starCounts");
  };

  const reviewsPerPage = 100;
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);

  const totalPages = Math.ceil(reviews.length / reviewsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const positiveReviews = reviews.filter((review) => review.score >= 3).length;
  const negativeReviews = reviews.length - positiveReviews;

  const positivePercentage =
    reviews.length > 0
      ? ((positiveReviews / reviews.length) * 100).toFixed(2)
      : 0;
  const negativePercentage =
    reviews.length > 0
      ? ((negativeReviews / reviews.length) * 100).toFixed(2)
      : 0;

  const chartData = {
    labels: [
      `Positive Reviews (${positivePercentage}%)`,
      `Negative Reviews (${negativePercentage}%)`,
    ],
    datasets: [
      {
        data: [positiveReviews, negativeReviews],
        backgroundColor: ["#36A2EB", "#FF6384"],
      },
    ],
  };

  const generateAspectKeywordsData = (reviewsData) => {
    const allAspectKeywords = reviewsData.flatMap(
      (review) => review.aspect_keywords
    );
    const aspectKeywordsCount = {};
    allAspectKeywords.forEach((keyword) => {
      aspectKeywordsCount[keyword] = (aspectKeywordsCount[keyword] || 0) + 1;
    });
    const sortedKeywords = Object.keys(aspectKeywordsCount).sort(
      (a, b) => aspectKeywordsCount[b] - aspectKeywordsCount[a]
    );
    const labels = sortedKeywords.slice(0, 10);
    const data = labels.map((keyword) => aspectKeywordsCount[keyword]);
    setAspectKeywordsData({
      labels,
      datasets: [
        {
          label: "Frequency of Aspect Keywords",
          data,
          backgroundColor: "rgba(54, 162, 235, 0.6)",
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 1,
        },
      ],
    });
  };

  return (
    <div className="App p-8">
      <Header />
      <InputForm
        appIdInput={appIdInput}
        setAppIdInput={setAppIdInput}
        reviewCount={reviewCount}
        handleReviewCountChange={handleReviewCountChange}
        duration={duration}
        handleDurationChange={handleDurationChange}
        sortBy={sortBy}
        handleSortByChange={handleSortByChange}
        handleSubmit={handleSubmit}
      />
      {loading ? (
        <Loading />
      ) : reviewsFetched ? (
        <div className="flex">
          <SideBar activeTab={activeTab} setActiveTab={setActiveTab} />
          <div className="flex-grow p-4">
            {activeTab === "Reviews" && (
              <>
                <ReviewTable
                  currentReviews={currentReviews}
                  indexOfFirstReview={indexOfFirstReview}
                  handleNewAnalysis={handleNewAnalysis}
                />
                <div className="pagination mt-8">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => paginate(i + 1)}
                      className={`px-4 py-2 rounded-md ml-2 ${
                        currentPage === i + 1
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              </>
            )}
            {activeTab === "Sentiments" && (
              <div className="flex flex-col items-center">
                <div
                  className="container mx-auto mt-4"
                  style={{ maxWidth: "400px" }}
                >
                  <PieChart chartData={chartData} />
                </div>
                <div
                  className="container mx-auto mt-8"
                  style={{ maxWidth: "600px" }}
                >
                  <h2 className="text-lg font-medium mb-4">
                    Aspect Keywords Frequency
                  </h2>
                  <BarGraph aspectKeywordsData={aspectKeywordsData} />
                </div>
              </div>
            )}
            {activeTab === "Ratings" && (
              <div className="flex flex-col items-center">
                <div className="mb-8 flex gap-8">
                  <div className="w-80 p-6 bg-blue-200 rounded-lg shadow-md hover:shadow-xl hover:bg-blue-300 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105">
                    <h3 className="text-lg font-semibold mb-2">
                      Total Ratings
                    </h3>
                    <p className="text-3xl font-bold text-center">
                      {totalRatings}
                    </p>
                  </div>
                  <div className="w-80 p-6 bg-green-200 rounded-lg shadow-md hover:shadow-xl hover:bg-green-300 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105">
                    <h3 className="text-lg font-semibold mb-2">
                      Average Rating
                    </h3>
                    <div className="flex items-center justify-center mb-2">
                      <p className="text-3xl font-bold">{averageRating}</p>
                    </div>
                  </div>
                </div>
                <div className="mt-8">
                  <StarRatingBreakdown starCounts={starCounts} />
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <p className="text-center text-lg mt-4">
          Discover what users are saying! Enter the app name to instantly fetch
          and analyze comprehensive reviews.
        </p>
      )}
      <Footer />
    </div>
  );
};

export default App;
