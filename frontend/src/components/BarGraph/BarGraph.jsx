// src/components/BarGraph/BarGraph.jsx
import React from "react";
import { Bar } from "react-chartjs-2";

const BarGraph = ({ aspectKeywordsData }) => {
  return (
    <Bar
      data={aspectKeywordsData}
      options={{
        indexAxis: "y",
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: (context) => `Frequency: ${context.raw.toLocaleString()}`,
            },
          },
        },
      }}
    />
  );
};

export default BarGraph;
