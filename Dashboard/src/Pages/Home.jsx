import useOlympicsData from "../hooks/useOlympicsData";
import DashboardMainGraph from "../Components/DashboardMainGraph";
import Indicator from "../Components/Indicator";
import HeightComparisonChart from "../Components/HeightComparisonChart";
import WinRateRadarChart from "../Components/WinRateRadarChart";

const Home = ({ onNavigate }) => {
    const { chartData, loading } = useOlympicsData();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="text-xl font-semibold text-gray-600 animate-pulse">
                    Analyzing Olympic History...
                </div>
            </div>
        );
    }

    return(
        <main className="min-h-screen bg-gray-50 p-2 md:p-5">
            <div className="w-full max-w-400 mx-auto space-y-8">
                {/* Bottom Row: Indicators + Radar Overview */}
                <div className="flex justify-between w-full mb-5">
                    <div>
                        <h1>Olympics</h1>
                    </div>
                    {/* Radar Chart as a Special Indicator */}
                    {/* Standard Indicators */}
                        <Indicator cardHead="Total Athletes" cardValue="14,000+" />
                        <Indicator cardHead="Total Medals" cardValue="2,840" />
                        <WinRateRadarChart 
                        data={chartData?.winRateStats} 
                        onNavigate={() => onNavigate('story3')} 
                    />
                </div>
            </div>
            {/* Top Row: Main Graph + Height Widget */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Graph (2/3 width) */}
                    <div className="lg:col-span-2">
                        {chartData ? (
                            <DashboardMainGraph chartData={chartData} onNavigate={() => onNavigate('story2')} />
                        ) : (
                            <div className="bg-white p-10 rounded-3xl text-center shadow-lg">
                                No data available for the main graph.
                            </div>
                        )}
                    </div>

                    {/* Height Comparison (1/3 width) */}
                    <div className="h-full">
                        <HeightComparisonChart 
                            data={chartData?.heightStats} 
                            onNavigate={() => onNavigate('story1')} 
                        />
                    </div>
                </div>
        </main>
    );
};

export default Home;
