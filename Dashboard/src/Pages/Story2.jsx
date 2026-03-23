import { useState } from "react";
import useHomeAdvantageData from "../hooks/useHomeAdvantageData";
import HomeAdvantageChart from "../Components/HomeAdvantageChart";
import { Sparkles } from "lucide-react";

const Story2 = () => {
    const [selectedYear, setSelectedYear] = useState(null);
    const [isVisualized, setIsVisualized] = useState(false);
    const { chartData, loading } = useHomeAdvantageData(selectedYear);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-xl font-semibold text-gray-600 animate-pulse">
                    Analyzing Home Advantage...
                </div>
            </div>
        );
    }

    const hostEvents = chartData?.hostEvents || [];

    const handleVisualize = () => {
        // Find a France hosting year
        const franceEvent = hostEvents.find(e => e.country === 'France');
        if (franceEvent) {
            setSelectedYear(franceEvent.year);
            setIsVisualized(true);
        }
    };

    const handleReset = () => {
        setSelectedYear(null);
        setIsVisualized(false);
    };

    const handleYearChange = (e) => {
        const val = e.target.value;
        if (!val) {
            setSelectedYear(null);
            setIsVisualized(false);
        } else {
            setSelectedYear(Number(val));
            setIsVisualized(true);
        }
    };

    return (
        <div className="p-10 bg-gray-50 min-h-screen">
            {/* Header row */}
            <div className="flex items-center justify-between mb-2">
                <h1 className="text-3xl font-bold">Home Field Advantage</h1>
                <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-2xl shadow-sm border border-gray-100">
                    <span className={`text-sm font-medium transition-colors ${!isVisualized ? 'text-gray-800' : 'text-gray-400'}`}>
                        Explore Data
                    </span>
                    <button
                        onClick={isVisualized ? handleReset : handleVisualize}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                            isVisualized ? 'bg-blue-500' : 'bg-gray-300'
                        }`}
                        aria-label="Toggle story mode"
                    >
                        <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-300 ${
                                isVisualized ? 'translate-x-6' : 'translate-x-1'
                            }`}
                        />
                    </button>
                    <span className={`text-sm font-medium flex items-center gap-1.5 transition-colors ${isVisualized ? 'text-blue-600' : 'text-gray-400'}`}>
                        <Sparkles size={14} className={isVisualized ? 'text-blue-500' : 'text-gray-400'} />
                        Story Mode
                    </span>
                </div>
            </div>

            <p className="text-gray-600 mb-4 w-3/4">
                Does hosting the Olympics give a country a medal advantage? This story compares
                how Brazil, Japan, Italy, and France perform across different Olympic years,
                highlighting the impact of home-field advantage on medal counts.
            </p>

            {/* Filters row */}
            <div className="flex items-end gap-4 mb-6">
                {/* Host Year dropdown */}
                <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Olympic Year</label>
                    <select
                        value={selectedYear || ''}
                        onChange={handleYearChange}
                        className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all"
                    >
                        <option value="">All Years (Average)</option>
                        {hostEvents.map(event => (
                            <option key={`${event.year}-${event.country}`} value={event.year}>
                                {event.year} ({event.country})
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <HomeAdvantageChart
                data={chartData?.barData}
            />
        </div>
    );
};

export default Story2;
