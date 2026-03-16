import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { ArrowUpRight } from 'lucide-react';

// Register the Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const DashboardMainGraph = ({ chartData, onNavigate }) => {
  if (!chartData) return null;

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
            pointStyle: 'circle'
        }
      },
      title: {
        display: false // We'll render a custom title for better alignment control
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Average Medals Won'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Host Countries'
        },
        ticks: {
          autoSkip: false
        }
      }
    }
  };

  return (
    <div className="w-full bg-white p-8 rounded-3xl shadow-xl">
      {/* Custom Header Section */}
      <div 
        className="flex items-center justify-between mb-8 cursor-pointer group"
        onClick={onNavigate}
      >
        <div className="flex flex-col">
            <h2 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                Home Field Advantage: France vs. Italy
            </h2>
            <p className="text-sm text-gray-500">Historical average medals won: Hosting vs. Non-hosting years</p>
        </div>

        {/* Navigation Arrow */}
        <div className="p-3 bg-gray-50 rounded-2xl group-hover:bg-blue-50 transition-colors">
            <ArrowUpRight 
                size={24} 
                className="text-gray-400 group-hover:text-blue-600 transition-all transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" 
            />
        </div>
      </div>

      {/* Chart Container */}
      <div className="h-100">
        <Bar options={options} data={chartData.homeAdvantage} />
      </div>
    </div>
  );
};

export default DashboardMainGraph;
