import { useState } from "react";
import useOlympicsData from "../hooks/useOlympicsData";
import BubbleHistogramChart from "../Components/BubbleHistogramChart";
import { Sparkles } from "lucide-react";

const decades = [
    { label: 'All Years', value: '' },
    { label: '1920–1929', value: '1920,1929' },
    { label: '1930–1939', value: '1930,1939' },
    { label: '1940–1949', value: '1940,1949' },
    { label: '1950–1959', value: '1950,1959' },
    { label: '1960–1969', value: '1960,1969' },
    { label: '1970–1979', value: '1970,1979' },
    { label: '1980–1989', value: '1980,1989' },
    { label: '1990–1999', value: '1990,1999' },
    { label: '2000–2009', value: '2000,2009' },
    { label: '2010–2019', value: '2010,2019' },
    { label: '2020–2020', value: '2020,2020' },
];

const Story1 = () => {
    const [selectedSport, setSelectedSport] = useState(null);
    const [showJapanOnly, setShowJapanOnly] = useState(false);
    const [yearRange, setYearRange] = useState(null);
    const { chartData, loading } = useOlympicsData(selectedSport, yearRange);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-xl font-semibold text-gray-600 animate-pulse">
                    Analyzing Physical Attributes...
                </div>
            </div>
        );
    }

    const sportsList = chartData?.physicalStats?.sportsList || [];

    const handleVisualize = () => {
        setShowJapanOnly(true);
        setSelectedSport('Volleyball');
    };

    const handleReset = () => {
        setShowJapanOnly(false);
        setSelectedSport(null);
    };

    const handleDecadeChange = (e) => {
        const val = e.target.value;
        if (!val) {
            setYearRange(null);
        } else {
            const [start, end] = val.split(',').map(Number);
            setYearRange([start, end]);
        }
    };

    return (
        <div className="p-10 bg-gray-50 min-h-screen">
            {/* Header row */}
            <div className="flex items-center justify-between mb-2">
                <h1 className="text-3xl font-bold">Athlete Physical Attributes</h1>
                <button
                    onClick={showJapanOnly ? handleReset : handleVisualize}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                        showJapanOnly
                            ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg'
                    }`}
                >
                    <Sparkles size={16} />
                    {showJapanOnly ? 'Show All Countries' : 'Visualize the Story'}
                </button>
            </div>

            <p className="text-gray-600 mb-4 w-3/4">
                This story visualizes how height impacts athletic performance across different sports, highlighting where being tall or short provides an advantage and showcasing competitive outliers like the Japanese volleyball team.
            </p>

            {/* Filters row */}
            <div className="flex items-bottom gap-4 mb-6">
                {/* Sport dropdown */}
                <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Sport</label>
                    <select
                        value={selectedSport || ''}
                        onChange={(e) => setSelectedSport(e.target.value || null)}
                        className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all"
                    >
                        <option value="">All Sports</option>
                        {sportsList.map(sport => (
                            <option key={sport} value={sport}>{sport}</option>
                        ))}
                    </select>
                </div>

                {/* Decade dropdown */}
                <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Time Period</label>
                    <select
                        value={yearRange ? `${yearRange[0]},${yearRange[1]}` : ''}
                        onChange={handleDecadeChange}
                        className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all"
                    >
                        {decades.map(d => (
                            <option key={d.value} value={d.value}>{d.label}</option>
                        ))}
                    </select>
                </div>
            </div>

            <BubbleHistogramChart
                data={chartData?.physicalStats}
                countryFilter={showJapanOnly ? ['Japan'] : null}
            />
        </div>
    );
};

export default Story1;
