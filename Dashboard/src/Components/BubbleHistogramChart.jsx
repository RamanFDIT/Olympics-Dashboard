import { Chart, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  LineController,
  BubbleController,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  LineController,
  BubbleController,
  Title,
  Tooltip,
  Legend
);

const BubbleHistogramChart = ({ data, countryFilter }) => {
  if (!data) return null;

  const { bubbleDatasets: allBubble, histogramData: allHist, avgHeight } = data;

  // Apply country filter if set
  const bubbleDatasets = countryFilter
    ? allBubble.filter(ds => countryFilter.includes(ds.label))
    : allBubble;
  const histogramData = countryFilter
    ? { ...allHist, datasets: allHist.datasets.filter(ds => countryFilter.includes(ds.label)) }
    : allHist;

  // --- Avg height line plugin for linear x-scale (bubble chart) ---
  const avgLineBubblePlugin = {
    id: 'avgLineBubble',
    afterDraw(chart) {
      const xScale = chart.scales.x;
      const yScale = chart.scales.y;
      const ctx = chart.ctx;
      const xPixel = xScale.getPixelForValue(avgHeight);
      if (xPixel == null) return;

      ctx.save();
      ctx.beginPath();
      ctx.setLineDash([6, 4]);
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2;
      ctx.moveTo(xPixel, yScale.top);
      ctx.lineTo(xPixel, yScale.bottom);
      ctx.stroke();

      ctx.setLineDash([]);
      ctx.fillStyle = '#ef4444';
      ctx.font = 'bold 10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`Avg: ${avgHeight.toFixed(1)} cm`, xPixel, yScale.top - 6);
      ctx.restore();
    },
  };

  // --- Avg height line plugin for linear x-scale (histogram) ---
  const avgLineHistPlugin = {
    id: 'avgLineHist',
    afterDraw(chart) {
      const xScale = chart.scales.x;
      const yScale = chart.scales.y;
      const ctx = chart.ctx;
      const xPixel = xScale.getPixelForValue(avgHeight);
      if (xPixel == null) return;

      ctx.save();
      ctx.beginPath();
      ctx.setLineDash([6, 4]);
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2;
      ctx.moveTo(xPixel, yScale.top);
      ctx.lineTo(xPixel, yScale.bottom);
      ctx.stroke();
      ctx.restore();
    },
  };

  // --- Build trend line datasets from bubble data ---
  const trendDatasets = bubbleDatasets.map(ds => ({
    type: 'line',
    label: `${ds.label} trend`,
    data: [...ds.data].sort((a, b) => a.x - b.x).map(p => ({ x: p.x, y: p.y })),
    borderColor: ds.borderColor.replace('rgb', 'rgba').replace(')', ', 0.3)'),
    borderWidth: 2,
    tension: 0.3,
    pointRadius: 0,
    fill: false,
    // Hide from legend
    legend: false,
  }));

  // --- Bubble Chart (mixed: bubble + line) ---
  const bubbleOptions = {
    responsive: true,
    maintainAspectRatio: false,
    layout: { padding: { left: 0, right: 10 } },
    plugins: {
      legend: {
        position: 'top',
        align: 'end',
        labels: {
          boxWidth: 10,
          usePointStyle: true,
          font: { size: 11 },
          filter: (item) => !item.text.includes('trend'),
        },
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#1f2937',
        bodyColor: '#4b5563',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        padding: 10,
        filter: (item) => item.dataset.type !== 'line',
        callbacks: {
          title: (items) => items.length ? `Height: ${items[0].raw.x} cm` : '',
          label: (ctx) => {
            const d = ctx.raw;
            return ` ${ctx.dataset.label}: ${d.y} athletes, ${d._medals} medals`;
          },
        },
      },
    },
    scales: {
      x: {
        type: 'linear',
        min: 135,
        max: 220.7,
        title: { display: false },
        ticks: { display: false },
        grid: { color: 'rgba(0,0,0,0.04)' },
      },
      y: {
        title: { display: true, text: 'Number of Athletes', font: { size: 11 } },
        grid: { color: 'rgba(0,0,0,0.04)' },
        ticks: { font: { size: 10 } },
        afterFit(scale) { scale.width = 60; },
      },
    },
  };

  const bubbleChartData = {
    datasets: [...bubbleDatasets, ...trendDatasets],
  };

  // --- Histogram ---
  const histogramOptions = {
    responsive: true,
    maintainAspectRatio: false,
    layout: { padding: { left: 0, right: 10 } },
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#1f2937',
        bodyColor: '#4b5563',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        padding: 10,
        callbacks: {
          title: (items) => items.length ? `Height: ${items[0].parsed.x} cm` : '',
          label: (ctx) => ` ${ctx.dataset.label}: ${ctx.parsed.y} athletes`,
        },
      },
    },
    scales: {
      x: {
        type: 'linear',
        min: 135,
        max: 222,
        offset: false,
        stacked: true,
        title: { display: true, text: 'Height (cm)', font: { size: 11 } },
        ticks: {
          font: { size: 9 },
          maxRotation: 0,
          stepSize: 6,
        },
        grid: { display: false },
      },
      y: {
        stacked: true,
        title: { display: true, text: 'Number of Athletes', font: { size: 11 } },
        grid: { color: 'rgba(0,0,0,0.04)' },
        ticks: { font: { size: 10 } },
        afterFit(scale) { scale.width = 60; },
      },
    },
  };

  return (
    <div className="w-full bg-white p-6 rounded-3xl shadow-xl border border-gray-100 flex flex-col">
      <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-1">
        Height vs Athletes vs Medals
      </h2>
      <p className="text-xs text-gray-400 mb-4">
        Bubble size reflects medal count per height bin per country
      </p>

      {/* Bubble + Trend Lines Chart */}
      <div style={{ height: '55vh', width: '100%' }}>
        <Chart type="bubble" options={bubbleOptions} data={bubbleChartData} plugins={[avgLineBubblePlugin]} />
      </div>

      {/* Histogram */}
      <div style={{ height: '22vh', width: '100%' }}>
        <Bar options={histogramOptions} data={histogramData} plugins={[avgLineHistPlugin]} />
      </div>
    </div>
  );
};

export default BubbleHistogramChart;
