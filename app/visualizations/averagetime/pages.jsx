import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import axios from "axios";

const Page = () => {
  const [chartData, setChartData] = useState(null);

  // Track Time on the Page
  useEffect(() => {
    const startTime = Date.now();

    // Send the time spent to the backend when the user leaves the page
    return () => {
      const endTime = Date.now();
      const timeSpent = Math.round((endTime - startTime) / 1000); // Convert ms to seconds

      axios.post("http://localhost:5000/track-time", {
        page: "AverageTimePage",
        timeSpent,
      });
    };
  }, []);

  // Fetch Analytics Data
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await axios.get("http://localhost:5000/analytics");
        const analytics = response.data;

        // Prepare data for the chart
        const labels = analytics.map((entry) => entry.date);
        const data = analytics.map((entry) => entry.totalTime);

        setChartData({
          labels,
          datasets: [
            {
              label: "Average Time on Page (seconds)",
              data,
              fill: false,
              borderColor: "rgb(75, 192, 192)",
              backgroundColor: "rgba(75, 192, 192, 0.5)",
              tension: 0.3,
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching analytics data:", error);
      }
    };

    fetchAnalytics();
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h3 style={styles.title}>Average Time on Page</h3>
        {chartData ? (
          <Line data={chartData} options={chartOptions} />
        ) : (
          <p>Loading chart...</p>
        )}
      </div>
    </div>
  );
};

// Chart.js Configuration
const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: true,
      position: "top",
    },
    tooltip: {
      enabled: true,
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
      title: {
        display: true,
        text: "Date",
      },
    },
    y: {
      grid: {
        display: true,
        color: "rgba(200, 200, 200, 0.2)",
      },
      title: {
        display: true,
        text: "Time (seconds)",
      },
    },
  },
};

// Inline Styling
const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#f9f9f9",
    padding: "20px",
  },
  card: {
    background: "#fff",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    padding: "16px",
    maxWidth: "600px",
    width: "100%",
    textAlign: "center",
  },
  title: {
    fontSize: "20px",
    marginBottom: "16px",
  },
};

// Router and Fallback for 404
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/visualizations/averagetime" element={<Page />} />
        <Route path="*" element={<h1>404 - Page Not Found</h1>} />
      </Routes>
    </Router>
  );
};

export default App;
