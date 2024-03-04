import React, { useEffect, useState } from "react";
import Chart from "chart.js/auto";

const App = () => {
  const [populationData, setPopulationData] = useState(null);

  useEffect(() => {

    const fetchPopulationData = async () => {
     
      const response = await fetch("/public/Population.json");
      const data = await response.json();
      setPopulationData(data);
    };

    fetchPopulationData();
  }, []);

  useEffect(() => {
    if (populationData) {
      const maleData = populationData.filter(
        (entry) => entry.gender === "male"
      );
      const femaleData = populationData.filter(
        (entry) => entry.gender === "female"
      );

      const labels = populationData.map((entry) => entry.ageGroup);

      const malePercentages = maleData.map(
        (entry) => (entry.population / entry.totalPopulation) * 100
      );
      const femalePercentages = femaleData.map(
        (entry) => (entry.population / entry.totalPopulation) * 100
      );

      const config = {
        type: "bar",
        data: {
          labels: labels,
          datasets: [
            {
              label: "Male",
              data: malePercentages,
              backgroundColor: "blue",
            },
            {
              label: "Female",
              data: femalePercentages.map((percentage) => -percentage), // Negative to make it appear left of the y-axis
              backgroundColor: "pink",
            },
          ],
        },
        options: {
          plugins: {
            legend: {
              position: "center",
            },
          },
          scales: {
            x: {
              stacked: true,
            },
            y: {
              stacked: true,
              ticks: {
                callback: function (value) {
                  return Math.abs(value) + "%";
                },
              },
            },
          },
        },
      };

      const ctx = document
        .getElementById("population-pyramid-chart")
        .getContext("2d");
      new Chart(ctx, config);
    }
  }, [populationData]);

  return (
    <div>
      <h2 className="text-center">Population Pyramid Chart</h2>
      <canvas id="population-pyramid-chart" width="600" height="200"></canvas>
      
    </div>
  );
};

export default App;


