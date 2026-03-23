import { useState, useRef, useEffect } from "react";
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { ChevronDown } from 'lucide-react';
import useOlympicsData from "../hooks/useOlympicsData";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const COUNTRIES = ['Brazil', 'Japan', 'Italy', 'France'];
const COLORS = [
  { bg: 'rgba(230, 159, 0, 0.8)', border: 'rgb(230, 159, 0)' },
  { bg: 'rgba(86, 180, 233, 0.8)', border: 'rgb(86, 180, 233)' },
  { bg: 'rgba(0, 158, 115, 0.8)', border: 'rgb(0, 158, 115)' },
  { bg: 'rgba(204, 121, 167, 0.8)', border: 'rgb(204, 121, 167)' },
];

const DEFAULT_SPORTS = ['Fencing', 'Volleyball', 'Swimming', 'Gymnastics', 'Athletics'];
const MAX_SPORTS = 5;

const Story3 = () => {
    const [selectedSports, setSelectedSports] = useState(DEFAULT_SPORTS);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const { chartData, loading } = useOlympicsData();

    // Close dropdown on outside click
    useEffect(() => {
        const handler = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

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

    const toggleSport = (sport) => {
        setSelectedSports(prev => {
            if (prev.includes(sport)) {
                return prev.filter(s => s !== sport);
            }
            if (prev.length >= MAX_SPORTS) return prev;
            return [...prev, sport];
        });
    };

    // Build chart data
    const chartLabels = selectedSports;
    const datasets = COUNTRIES.map((country, i) => ({
        label: country,
        data: chartLabels.map(s => rates[country]?.[s] || 0),
        backgroundColor: COLORS[i].bg,
        borderColor: COLORS[i].border,
        borderWidth: 0,
        barPercentage: 0.4,
        categoryPercentage: 0.8,
        borderRadius: 4,
    }));

    const barData = { labels: chartLabels, datasets };

    // External tooltip handler (same pattern as dashboard)
    const getOrCreateTooltip = (chart) => {
        let tooltipEl = chart.canvas.parentNode.querySelector('.custom-tooltip');
        if (!tooltipEl) {
            tooltipEl = document.createElement('div');
            tooltipEl.className = 'custom-tooltip';
            tooltipEl.style.cssText = `
                position: absolute; pointer-events: none;
                transition: all 0.5s ease;
                background: rgba(255,255,255,0.95); border: 1px solid #e5e7eb;
                border-radius: 8px; padding: 12px 16px; font-family: sans-serif;
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

        const sport = labels[targetIndex];
        let html = `<div style="font-size:14px;font-weight:bold;color:#1f2937;margin-bottom:8px">${sport}</div>`;
        chart.data.datasets.forEach((ds, dsIndex) => {
            const meta = chart.getDatasetMeta(dsIndex);
            if (meta.hidden) return;
            const value = ds.data[targetIndex];
            const color = ds.backgroundColor;
            html += `<div style="display:flex;align-items:center;gap:8px;font-size:13px;color:#4b5563;margin-bottom:3px">
                <span style="width:12px;height:12px;border-radius:3px;background:${color};display:inline-block;flex-shrink:0"></span>
                ${ds.label}: ${value.toFixed(1)}%
            </div>`;
        });
        tooltipEl.innerHTML = html;

        const tooltipWidth = tooltipEl.offsetWidth;
        let left = tooltip.caretX + 16;
        if (left + tooltipWidth > chart.width) {
            left = tooltip.caretX - tooltipWidth - 16;
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
                position: 'top',
                align: 'end',
                labels: {
                    boxWidth: 12,
                    usePointStyle: true,
                    font: { size: 12 },
                    padding: 20,
                },
            },
            tooltip: {
                enabled: false,
                external: externalTooltipHandler,
            },
        },
        scales: {
            x: {
                suggestedMax: 50,
                grid: { color: 'rgba(0,0,0,0.05)' },
                title: {
                    display: true,
                    text: 'Win Rate (%)',
                    font: { size: 12 },
                },
                ticks: { font: { size: 11 } },
            },
            y: {
                grid: { display: false },
                ticks: { font: { size: 13, weight: 'bold' } },
            },
        },
    };

    return (
        <div className="p-10 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold mb-2">Country Specialization & Win Rates</h1>
            <p className="text-gray-600 mb-6 max-w-2xl">
                Compare athlete-to-medal conversion rates across sports for each country. Select up to 5 sports to compare.
            </p>

            {/* Sport selector dropdown */}
            <div className="mb-6" ref={dropdownRef}>
                <label className="block text-xs font-medium text-gray-500 mb-1">Sports</label>
                <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all"
                >
                    <span>{selectedSports.length} sport{selectedSports.length !== 1 ? 's' : ''} selected</span>
                    <ChevronDown size={16} className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {dropdownOpen && (
                    <div className="absolute mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-64 overflow-y-auto w-64">
                        {allSports.map(sport => {
                            const isSelected = selectedSports.includes(sport);
                            const isDisabled = !isSelected && selectedSports.length >= MAX_SPORTS;
                            return (
                                <label
                                    key={sport}
                                    className={`flex items-center gap-3 px-4 py-2 cursor-pointer hover:bg-gray-50 transition-colors ${
                                        isDisabled ? 'opacity-40 cursor-not-allowed' : ''
                                    }`}
                                >
                                    <input
                                        type="checkbox"
                                        checked={isSelected}
                                        disabled={isDisabled}
                                        onChange={() => toggleSport(sport)}
                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="text-sm text-gray-700">{sport}</span>
                                </label>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Chart */}
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
                <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-1">
                    Efficiency Gaps
                </h2>
                <p className="text-xs text-gray-400 mb-6">
                    Athlete-to-Medal Conversion Rate
                </p>
                <div style={{ height: '70vh' }}>
                    {selectedSports.length > 0 ? (
                        <Bar options={options} data={barData} />
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-400">
                            Select at least one sport to display the chart.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Story3;
