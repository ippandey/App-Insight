// import React from "react";
// import * as XLSX from "xlsx";
// import { saveAs } from "file-saver";

// const ReviewTable = ({ currentReviews, indexOfFirstReview }) => {
//   const handleDownload = (format) => {
//     if (format === "csv") {
//       downloadCSV();
//     } else if (format === "xlsx") {
//       downloadExcel();
//     }
//   };

//   const downloadCSV = () => {
//     const csvContent =
//       "data:text/csv;charset=utf-8," +
//       ["Review No.,User,Rating,Date,Review,Aspect Keywords"]
//         .concat(
//           currentReviews.map((review, index) =>
//             [
//               indexOfFirstReview + index + 1,
//               review.userName,
//               review.score,
//               review.at,
//               review.content,
//               review.aspect_keywords.join(", "),
//             ].join(",")
//           )
//         )
//         .join("\n");

//     const encodedUri = encodeURI(csvContent);
//     const link = document.createElement("a");
//     link.setAttribute("href", encodedUri);
//     link.setAttribute("download", "reviews.csv");
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   const downloadExcel = () => {
//     const worksheet = XLSX.utils.json_to_sheet(
//       currentReviews.map((review, index) => ({
//         "Review No.": indexOfFirstReview + index + 1,
//         User: review.userName,
//         Rating: review.score,
//         Date: review.at,
//         Review: review.content,
//         "Aspect Keywords": review.aspect_keywords.join(", "),
//       }))
//     );
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Reviews");
//     const excelBuffer = XLSX.write(workbook, {
//       bookType: "xlsx",
//       type: "array",
//     });
//     const data = new Blob([excelBuffer], { type: "application/octet-stream" });
//     saveAs(data, "reviews.xlsx");
//   };

//   return (
//     <div className="overflow-x-auto">
//       <div className="mb-4">
//         <button
//           onClick={() => handleDownload("csv")}
//           className="mr-2 bg-blue-500 text-white px-4 py-2 rounded"
//         >
//           Download CSV
//         </button>
//         <button
//           onClick={() => handleDownload("xlsx")}
//           className="bg-green-500 text-white px-4 py-2 rounded"
//         >
//           Download Excel
//         </button>
//       </div>
//       <table className="min-w-full table-auto border-collapse">
//         <thead>
//           <tr className="bg-gray-200">
//             <th className="border border-gray-400 px-4 py-2">Review No.</th>
//             <th className="border border-gray-400 px-4 py-2">User</th>
//             <th className="border border-gray-400 px-4 py-2">Rating</th>
//             <th className="border border-gray-400 px-4 py-2">Date</th>
//             <th className="border border-gray-400 px-4 py-2">Review</th>
//             <th className="border border-gray-400 px-4 py-2">
//               Aspect Keywords
//             </th>
//           </tr>
//         </thead>
//         <tbody>
//           {currentReviews.map((review, index) => (
//             <tr key={index}>
//               <td className="border border-gray-400 px-4 py-2">
//                 {indexOfFirstReview + index + 1}
//               </td>
//               <td className="border border-gray-400 px-4 py-2">
//                 {review.userName}
//               </td>
//               <td className="border border-gray-400 px-4 py-2">
//                 {review.score}
//               </td>
//               <td className="border border-gray-400 px-4 py-2">{review.at}</td>
//               <td className="border border-gray-400 px-4 py-2">
//                 <div className="max-w-[200px] break-words">
//                   {review.content}
//                 </div>
//               </td>
//               <td className="border border-gray-400 px-4 py-2">
//                 <div className="max-w-[200px] break-words">
//                   {review.aspect_keywords.join(", ")}
//                 </div>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default ReviewTable;

import React from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const ReviewTable = ({
  currentReviews,
  indexOfFirstReview,
  handleNewAnalysis,
}) => {
  const handleDownload = (format) => {
    if (format === "csv") {
      downloadCSV();
    } else if (format === "xlsx") {
      downloadExcel();
    }
  };

  const downloadCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["Review No.,User,Rating,Date,Review,Aspect Keywords"]
        .concat(
          currentReviews.map((review, index) =>
            [
              indexOfFirstReview + index + 1,
              review.userName,
              review.score,
              review.at,
              review.content,
              review.aspect_keywords.join(", "),
            ].join(",")
          )
        )
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "reviews.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      currentReviews.map((review, index) => ({
        "Review No.": indexOfFirstReview + index + 1,
        User: review.userName,
        Rating: review.score,
        Date: review.at,
        Review: review.content,
        "Aspect Keywords": review.aspect_keywords.join(", "),
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Reviews");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "reviews.xlsx");
  };

  return (
    <div className="overflow-x-auto">
      <div className="mb-4 flex">
        <button
          onClick={() => handleDownload("csv")}
          className="mr-2 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Download CSV
        </button>
        <button
          onClick={() => handleDownload("xlsx")}
          className="mr-2 bg-green-500 text-white px-4 py-2 rounded"
        >
          Download Excel
        </button>
        <button
          onClick={handleNewAnalysis}
          className="bg-teal-500 text-white px-4 py-2 rounded flex"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
          >
            <path fill="none" d="M0 0h24v24H0z"></path>
            <path
              fill="currentColor"
              d="M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2z"
            ></path>
          </svg>
          New Analysis
        </button>
      </div>
      <table className="min-w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-400 px-4 py-2">Review No.</th>
            <th className="border border-gray-400 px-4 py-2">User</th>
            <th className="border border-gray-400 px-4 py-2">Rating</th>
            <th className="border border-gray-400 px-4 py-2">Date</th>
            <th className="border border-gray-400 px-4 py-2">Review</th>
            <th className="border border-gray-400 px-4 py-2">
              Aspect Keywords
            </th>
          </tr>
        </thead>
        <tbody>
          {currentReviews.map((review, index) => (
            <tr key={index}>
              <td className="border border-gray-400 px-4 py-2">
                {indexOfFirstReview + index + 1}
              </td>
              <td className="border border-gray-400 px-4 py-2">
                {review.userName}
              </td>
              <td className="border border-gray-400 px-4 py-2">
                {review.score}
              </td>
              <td className="border border-gray-400 px-4 py-2">{review.at}</td>
              <td className="border border-gray-400 px-4 py-2">
                <div className="max-w-[200px] break-words">
                  {review.content}
                </div>
              </td>
              <td className="border border-gray-400 px-4 py-2">
                <div className="max-w-[200px] break-words">
                  {review.aspect_keywords.join(", ")}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReviewTable;

// import React from "react";
// import * as XLSX from "xlsx";
// import { saveAs } from "file-saver";

// const ReviewTable = ({
//   currentReviews,
//   indexOfFirstReview,
//   handleNewAnalysis,
// }) => {
//   const handleDownload = (format) => {
//     if (format === "csv") {
//       downloadCSV();
//     } else if (format === "xlsx") {
//       downloadExcel();
//     }
//   };

//   const downloadCSV = () => {
//     const csvContent =
//       "data:text/csv;charset=utf-8," +
//       ["Review No.,User,Rating,Date,Review,Aspect Keywords"]
//         .concat(
//           currentReviews.map((review, index) =>
//             [
//               indexOfFirstReview + index + 1,
//               review.userName,
//               review.score,
//               review.at,
//               review.content,
//               review.aspect_keywords.join(", "),
//             ].join(",")
//           )
//         )
//         .join("\n");

//     const encodedUri = encodeURI(csvContent);
//     const link = document.createElement("a");
//     link.setAttribute("href", encodedUri);
//     link.setAttribute("download", "reviews.csv");
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   const downloadExcel = () => {
//     const worksheet = XLSX.utils.json_to_sheet(
//       currentReviews.map((review, index) => ({
//         "Review No.": indexOfFirstReview + index + 1,
//         User: review.userName,
//         Rating: review.score,
//         Date: review.at,
//         Review: review.content,
//         "Aspect Keywords": review.aspect_keywords.join(", "),
//       }))
//     );
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Reviews");
//     const excelBuffer = XLSX.write(workbook, {
//       bookType: "xlsx",
//       type: "array",
//     });
//     const data = new Blob([excelBuffer], { type: "application/octet-stream" });
//     saveAs(data, "reviews.xlsx");
//   };

//   return (
//     <div className="overflow-x-auto">
//       <div className="mb-4 flex flex-wrap">
//         <button
//           onClick={() => handleDownload("csv")}
//           className="mr-2 mb-2 bg-blue-500 text-white px-4 py-2 rounded"
//         >
//           Download CSV
//         </button>
//         <button
//           onClick={() => handleDownload("xlsx")}
//           className="mr-2 mb-2 bg-green-500 text-white px-4 py-2 rounded"
//         >
//           Download Excel
//         </button>
//         <button
//           onClick={handleNewAnalysis}
//           className="bg-teal-500 text-white px-4 py-2 rounded flex items-center mb-2"
//         >
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             viewBox="0 0 24 24"
//             width="24"
//             height="24"
//             className="mr-2"
//           >
//             <path fill="none" d="M0 0h24v24H0z"></path>
//             <path
//               fill="currentColor"
//               d="M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2z"
//             ></path>
//           </svg>
//           New Analysis
//         </button>
//       </div>
//       <table className="min-w-full table-auto border-collapse">
//         <thead>
//           <tr className="bg-gray-200">
//             <th className="border border-gray-400 px-4 py-2">Review No.</th>
//             <th className="border border-gray-400 px-4 py-2">User</th>
//             <th className="border border-gray-400 px-4 py-2">Rating</th>
//             <th className="border border-gray-400 px-4 py-2">Date</th>
//             <th className="border border-gray-400 px-4 py-2">Review</th>
//             <th className="border border-gray-400 px-4 py-2">
//               Aspect Keywords
//             </th>
//           </tr>
//         </thead>
//         <tbody>
//           {currentReviews.map((review, index) => (
//             <tr key={index} className="break-words">
//               <td className="border border-gray-400 px-4 py-2">
//                 {indexOfFirstReview + index + 1}
//               </td>
//               <td className="border border-gray-400 px-4 py-2">
//                 {review.userName}
//               </td>
//               <td className="border border-gray-400 px-4 py-2">
//                 {review.score}
//               </td>
//               <td className="border border-gray-400 px-4 py-2">{review.at}</td>
//               <td className="border border-gray-400 px-4 py-2">
//                 <div className="max-w-[200px] md:max-w-none">
//                   {review.content}
//                 </div>
//               </td>
//               <td className="border border-gray-400 px-4 py-2">
//                 <div className="max-w-[200px] md:max-w-none">
//                   {review.aspect_keywords.join(", ")}
//                 </div>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default ReviewTable;
