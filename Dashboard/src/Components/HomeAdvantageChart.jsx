import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const HomeAdvantageChart = ({ data }) => {
  if (!data) return null;

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        align: 'start',
        labels: {
          boxWidth: 15,
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle',
          font: { size: 12 },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#1f2937',
        bodyColor: '#4b5563',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: (ctx) => ` ${ctx.dataset.label}: ${ctx.parsed.y.toFixed(1)} medals`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        title: {
          display: true,
          text: 'Countries',
          font: { size: 12 },
          color: '#6b7280',
        },
        ticks: {
          font: { size: 13, weight: 'bold' },
          color: '#374151',
          autoSkip: false,
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Average Medals Won',
          font: { size: 12, weight: 'medium' },
          color: '#6b7280',
        },
        grid: { color: 'rgba(0,0,0,0.05)' },
        ticks: { font: { size: 11 } },
      },
    },
    animation: {
      duration: 600,
      easing: 'easeOutQuart',
    },
  };

  return (
    <div className="w-full bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
      <div style={{ height: '60vh' }}>
        <Bar options={options} data={data} />
      </div>
    </div>
  );
};

export default HomeAdvantageChart;
