import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJs } from 'chart.js/auto';

function LineChart({ chartData }) {
  if (!chartData || !chartData.labels || !chartData.datasets) {
    return null;
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
    },
    elements: {
      line: {
        borderWidth: 2,
        borderColor: 'blue',
        backgroundColor: 'rgba(0, 0, 0, 0)',
        pointRadius: 0,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: 'blue',
        pointHoverBorderColor: 'white',
        pointHoverBorderWidth: 2,
      },
    },
  };

  const chartStyle = {
    width: '700px',
    height: '400px',
    backgroundImage: 'linear-gradient(white, #bfd7ff)',
    padding: '20px',
    borderRadius: '10px',
  };

  return (
    <div style={chartStyle}>
      <Line data={chartData} options={chartOptions} />
    </div>
  );
}

export default LineChart;
