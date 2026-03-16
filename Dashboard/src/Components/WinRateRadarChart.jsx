import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { ArrowUpRight } from 'lucide-react';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const WinRateRadarChart = ({ data, onNavigate }) => {
  if (!data) return null;

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'right',
        align: 'center',
        labels: {
          boxWidth: 10,
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 10,
          font: { size: 9 }
        }
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: (context) => `${context.dataset.label}: ${context.raw.toFixed(1)}%`
        }
      }
    },
    scales: {
      r: {
        angleLines: { display: true },
        suggestedMin: 0,
        suggestedMax: 50,
        ticks: { display: false, stepSize: 25 },
        pointLabels: {
          font: { size: 9, weight: 'bold' },
          color: '#374151'
        }
      }
    }
  };

  return (
    <div className="w-full h-full bg-white p-4 rounded-3xl shadow-xl border border-gray-100 flex flex-col">
      {/* Header with Navigation */}
      <div 
        className="w-full flex items-center justify-between mb-1 cursor-pointer group"
        onClick={onNavigate}
      >
        <h2 className="text-[11px] font-bold text-gray-800 group-hover:text-blue-600 transition-colors uppercase tracking-wider">
            Sport Win Rate Analysis
        </h2>
        <ArrowUpRight 
            size={14} 
            className="text-gray-400 group-hover:text-blue-600 transition-all transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" 
        />
      </div>

      <div className="flex-1 w-full">
        <Radar options={options} data={data} />
      </div>
    </div>
  );
};

export default WinRateRadarChart;
