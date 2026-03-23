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

  // Transform data for grouped lollipop effect
  const lollipopData = {
    labels: data.labels,
    datasets: data.datasets.map(ds => ({
      ...ds,
      type: 'bar',
      barPercentage: 0.4,
      categoryPercentage: 0.8,
      borderRadius: 4,
      borderWidth: 0,
    }))
  };

  // External tooltip handler: fully custom HTML tooltip
  const getOrCreateTooltip = (chart) => {
    let tooltipEl = chart.canvas.parentNode.querySelector('.custom-tooltip');
    if (!tooltipEl) {
      tooltipEl = document.createElement('div');
      tooltipEl.className = 'custom-tooltip';
      tooltipEl.style.cssText = `
        position: absolute; pointer-events: none;
        transition: all 0.5s ease;
        background: rgba(255,255,255,0.95); border: 1px solid #e5e7eb;
        border-radius: 8px; padding: 10px 14px; font-family: sans-serif;
        box-shadow: 0 4px 12px rgba(0,0,0,0.08); z-index: 10;
      `;
      chart.canvas.parentNode.style.position = 'relative';
      chart.canvas.parentNode.appendChild(tooltipEl);
    }
    return tooltipEl;
  };

  const externalTooltipHandler = (context) => {
    const { chart, tooltip } = context;
    const tooltipEl = getOrCreateTooltip(chart);

    if (tooltip.opacity === 0) {
      tooltipEl.style.opacity = '0';
      return;
    }

    // Determine which category the cursor is over
    const yScale = chart.scales.y;
    const cursorY = tooltip.caretY;
    const labels = chart.data.labels;
    let targetIndex = -1;
    for (let i = 0; i < labels.length; i++) {
      const yPos = yScale.getPixelForValue(i);
      const bandHeight = yScale.height / labels.length;
      if (Math.abs(cursorY - yPos) <= bandHeight / 2) {
        targetIndex = i;
        break;
      }
    }

    if (targetIndex === -1) {
      tooltipEl.style.opacity = '0';
      return;
    }

    // Build tooltip HTML with all datasets for the target sport
    const sport = labels[targetIndex];
    let html = `<div style="font-size:12px;font-weight:bold;color:#1f2937;margin-bottom:6px">${sport}</div>`;
    chart.data.datasets.forEach((ds, dsIndex) => {
      const meta = chart.getDatasetMeta(dsIndex);
      if (meta.hidden) return;
      const value = ds.data[targetIndex];
      const color = ds.backgroundColor;
      html += `<div style="display:flex;align-items:center;gap:6px;font-size:11px;color:#4b5563;margin-bottom:2px">
        <span style="width:10px;height:10px;border-radius:2px;background:${color};display:inline-block;flex-shrink:0"></span>
        ${ds.label}: ${value.toFixed(1)}%
      </div>`;
    });
    tooltipEl.innerHTML = html;

    // Position tooltip
    const canvasRect = chart.canvas.getBoundingClientRect();
    const tooltipWidth = tooltipEl.offsetWidth;
    let left = tooltip.caretX + 12;
    if (left + tooltipWidth > chart.width) {
      left = tooltip.caretX - tooltipWidth - 12;
    }
    tooltipEl.style.opacity = '1';
    tooltipEl.style.left = left + 'px';
    tooltipEl.style.top = tooltip.caretY - tooltipEl.offsetHeight / 2 + 'px';
  };

  const options = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'nearest',
      intersect: false,
      axis: 'y',
    },
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
        enabled: false,
        external: externalTooltipHandler,
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
