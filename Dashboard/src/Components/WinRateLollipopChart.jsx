import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement
} from 'chart.js';
import { ArrowUpRight } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const WinRateLollipopChart = ({ data, onNavigate }) => {
  if (!data) return null;

  // Transform radar data to grouped lollipop data
  // We'll use the datasets from our hook but tweak them for a bar chart
  const lollipopData = {
    labels: data.labels,
    datasets: data.datasets.map(ds => ({
      ...ds,
      type: 'bar',
      barPercentage: 0.1, // Makes the 'stick' thin
      categoryPercentage: 0.8,
      borderRadius: 20,
      borderWidth: 0,
      pointStyle: 'circle',
    }))
  };

  const options = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 8,
          usePointStyle: true,
          font: { size: 9 }
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.dataset.label}: ${context.raw.toFixed(1)}%`
        }
      }
    },
    scales: {
      x: {
        suggestedMax: 50,
        grid: { color: 'rgba(0,0,0,0.05)' },
        title: {
          display: true,
          text: 'Win Rate (%)',
          font: { size: 9 }
        },
        ticks: { font: { size: 9 } }
      },
      y: {
        grid: { display: false },
        ticks: { font: { size: 10, weight: 'bold' } }
      }
    }
  };

  return (
    <div className="w-full h-full bg-white p-5 rounded-3xl shadow-xl border border-gray-100 flex flex-col">
      {/* Header with Navigation */}
      <div 
        className="w-full flex items-center justify-between mb-4 cursor-pointer group"
        onClick={onNavigate}
      >
        <div>
            <h2 className="text-xs font-bold text-gray-800 group-hover:text-blue-600 transition-colors uppercase tracking-wider">
                Efficiency Gaps
            </h2>
            <p className="text-[10px] text-gray-400">Athlete-to-Medal Conversion Rate</p>
        </div>
        <div className="p-2 bg-gray-50 rounded-xl group-hover:bg-blue-50 transition-colors">
            <ArrowUpRight 
                size={14} 
                className="text-gray-400 group-hover:text-blue-600 transition-all transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" 
            />
        </div>
      </div>

      <div className="flex-1 w-full">
        <Bar options={options} data={lollipopData} />
      </div>
    </div>
  );
};

export default WinRateLollipopChart;
