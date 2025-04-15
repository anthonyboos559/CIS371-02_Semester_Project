import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const DonutChart = ({ data, total, filter, title }) => {
  const labels = Object.keys(data);
  const values = Object.values(data);
  const colors = [
    '#1f77b4', '#ff7f0e', '#2ca02c', '#d62728',
    '#9467bd', '#8c564b', '#e377c2', '#7f7f7f',
    '#bcbd22', '#17becf'
  ];

  const percentage = ((Object.values(data).reduce((a, b) => a + b, 0) / total) * 100).toFixed(1);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Performances',
        data: values,
        backgroundColor: colors,
        borderColor: '#fff',
        borderWidth: 2,
      },
    ],
  };

  const options = {
    plugins: {
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            const year = tooltipItem.label;
            const count = tooltipItem.raw;
            return `${year}: ${count} performances`;
          },
        },
      },
      legend: {
        position: 'right',
      },
      title: {
        display: true,
        text: `${values.reduce((a, b) => a + b)} performances in ${filter} (${percentage}% of total)`,
        font: {
          size: 18,
        },
        padding: {
          top: 10,
          bottom: 20,
        },
      },
    },
    // cutout: '60%',
  };

  return (
    <div style={{ maxWidth: 600, height: 600, margin: '0 auto' }}>
        <label>{title}</label>
        <Doughnut data={chartData} options={options} />
    </div>
  )
};

export default DonutChart;