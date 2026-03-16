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
import { ArrowUpRight } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const HeightComparisonChart = ({ data, onNavigate }) => {
  if (!data) return null;

  const options = {
    indexAxis: 'y', // Makes it horizontal
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // Cleaner for small widgets
      },
      title: {
        display: false,
      },
    },
    scales: {
      x: {
        min: 160, // Zoom in for better comparison
        max: 190,
        grid: { 
          display: true,
          color: 'rgba(0, 0, 0, 0.05)', // Subtle grid lines
          drawBorder: false
        },
        title: {
          display: true,
          text: 'Height (in cm)',
          font: { size: 10, weight: 'medium' },
          color: '#6b7280' // gray-500
        }
      },
      y: {
        grid: { display: false }
      }
    }
  };

  return (
    <div className="w-full h-full bg-white p-6 rounded-3xl shadow-xl border border-gray-100 flex flex-col">
      {/* Navigation Header */}
      <div 
        className="flex items-center justify-between mb-4 cursor-pointer group"
        onClick={onNavigate}
      >
        <h2 className="text-sm font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
            Avg Athlete Heights (cm)
        </h2>
        <div className="p-2 bg-gray-50 rounded-xl group-hover:bg-blue-50 transition-colors">
            <ArrowUpRight 
                size={16} 
                className="text-gray-400 group-hover:text-blue-600 transition-all transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" 
            />
        </div>
      </div>

      <div className="flex-1">
        <Bar options={options} data={data} />
      </div>
    </div>
  );
};

export default HeightComparisonChart;
