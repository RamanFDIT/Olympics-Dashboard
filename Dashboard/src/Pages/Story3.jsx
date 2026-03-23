import { useState } from "react";
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
} from 'chart.js';
import useOlympicsData from "../hooks/useOlympicsData";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip);

const COUNTRIES = ['Brazil', 'Japan', 'Italy', 'France'];
const COLORS = [
  { line: 'rgb(230, 159, 0)', text: '#e69f00' },      // Brazil - Orange
  { line: 'rgb(86, 180, 233)', text: '#56b4e9' },      // Japan - Sky Blue
  { line: 'rgb(0, 158, 115)', text: '#009e73' },        // Italy - Green
  { line: 'rgb(204, 121, 167)', text: '#cc79a7' },      // France - Pink
];

const Story3 = () => {
    const [sport1, setSport1] = useState('Fencing');
    const [sport2, setSport2] = useState('Volleyball');
    const { chartData, loading } = useOlympicsData();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-xl font-semibold text-gray-600 animate-pulse">
                    Analyzing Win Rates...
                </div>
            </div>
        );
    }

    const { allSports, rates } = chartData?.winRateAllSports || { allSports: [], rates: {} };

    // Build chart data
    const datasets = COUNTRIES.map((country, i) => ({
        label: country,
        data: [rates[country]?.[sport1] || 0, rates[country]?.[sport2] || 0],
        borderColor: COLORS[i].line,
        backgroundColor: COLORS[i].line,
        borderWidth: 3,
        pointRadius: 8,
        pointHoverRadius: 11,
        pointBackgroundColor: COLORS[i].line,
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        tension: 0,
    }));

    const chartData3 = {
        labels: [sport1, sport2],
        datasets,
    };

    // Auto max
    const allVals = COUNTRIES.flatMap(c => [rates[c]?.[sport1] || 0, rates[c]?.[sport2] || 0]);
    const maxVal = Math.max(...allVals, 10);
    const yMax = Math.ceil(maxVal / 10) * 10 + 5;

    // Resolve overlapping label positions by nudging apart
    const resolveOverlaps = (items, minGap) => {
        items.sort((a, b) => a.y - b.y);
        for (let i = 1; i < items.length; i++) {
            const overlap = (items[i - 1].y + minGap) - items[i].y;
            if (overlap > 0) {
                items[i - 1].y -= overlap / 2;
                items[i].y += overlap / 2;
            }
        }
    };

    // Plugin to draw country labels next to points
    const labelPlugin = {
        id: 'slopeLabels',
        afterDraw(chart) {
            const ctx = chart.ctx;
            const meta0 = chart.getDatasetMeta(0);
            if (!meta0.data || meta0.data.length < 2) return;

            const leftX = meta0.data[0].x;
            const rightX = meta0.data[1].x;
            const minGap = 18;

            // Collect label positions for each side
            const leftLabels = [];
            const rightLabels = [];

            chart.data.datasets.forEach((ds, dsIdx) => {
                const meta = chart.getDatasetMeta(dsIdx);
                if (meta.hidden) return;
                leftLabels.push({ dsIdx, y: meta.data[0].y, val: ds.data[0] });
                rightLabels.push({ dsIdx, y: meta.data[1].y, val: ds.data[1] });
            });

            resolveOverlaps(leftLabels, minGap);
            resolveOverlaps(rightLabels, minGap);

            ctx.save();
            ctx.font = 'bold 13px sans-serif';

            leftLabels.forEach(({ dsIdx, y, val }) => {
                ctx.fillStyle = COLORS[dsIdx].text;
                ctx.textAlign = 'right';
                ctx.textBaseline = 'middle';
                ctx.fillText(`${COUNTRIES[dsIdx]} ${val.toFixed(1)}%`, leftX - 16, y);
            });

            rightLabels.forEach(({ dsIdx, y, val }) => {
                ctx.fillStyle = COLORS[dsIdx].text;
                ctx.textAlign = 'left';
                ctx.textBaseline = 'middle';
                ctx.fillText(`${val.toFixed(1)}% ${COUNTRIES[dsIdx]}`, rightX + 16, y);
            });

            ctx.restore();
        },
    };

    // Plugin to draw vertical lines at each sport
    const vertLinePlugin = {
        id: 'slopeVertLines',
        beforeDraw(chart) {
            const ctx = chart.ctx;
            const xScale = chart.scales.x;
            const yScale = chart.scales.y;
            const meta0 = chart.getDatasetMeta(0);
            if (!meta0.data || meta0.data.length < 2) return;

            [meta0.data[0].x, meta0.data[1].x].forEach(xPx => {
                ctx.save();
                ctx.beginPath();
                ctx.strokeStyle = 'rgba(0,0,0,0.1)';
                ctx.lineWidth = 1;
                ctx.moveTo(xPx, yScale.top);
                ctx.lineTo(xPx, yScale.bottom);
                ctx.stroke();
                ctx.restore();
            });
        },
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
            padding: { left: 140, right: 140, top: 20, bottom: 10 },
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
                    label: (ctx) => ` ${ctx.dataset.label}: ${ctx.raw.toFixed(1)}%`,
                },
            },
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: {
                    color: '#374151',
                    font: { size: 16, weight: 'bold' },
                },
                border: { display: false },
            },
            y: {
                display: false,
                min: 0,
                max: yMax,
            },
        },
    };

    return (
        <div className="p-10 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold mb-2">Country Specialization & Win Rates</h1>
            <p className="text-gray-600 mb-6 max-w-2xl">
                See how each country's athlete-to-medal conversion shifts between two sports.
            </p>

            {/* Sport filters */}
            <div className="flex items-center gap-4 mb-6">
                <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Left Sport</label>
                    <select
                        value={sport1}
                        onChange={(e) => setSport1(e.target.value)}
                        className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all"
                    >
                        {allSports.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
                <div className="pt-5 text-gray-400 text-lg">→</div>
                <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Right Sport</label>
                    <select
                        value={sport2}
                        onChange={(e) => setSport2(e.target.value)}
                        className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all"
                    >
                        {allSports.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
            </div>

            {/* Slope Chart */}
            <div className="bg-white rounded-3xl shadow-xl p-8">
                <p className="text-center text-black-400 text-sm mb-6">
                    Conversion Rates from {sport1} to {sport2}
                </p>
                <div style={{ height: '60vh' }}>
                    <Line
                        options={options}
                        data={chartData3}
                        plugins={[vertLinePlugin, labelPlugin]}
                    />
                </div>
            </div>
        </div>
    );
};

export default Story3;
