import useOlympicsData from "../hooks/useOlympicsData";
import DashboardMainGraph from "../Components/DashboardMainGraph";
import Indicator from "../Components/Indicator";
import HeightComparisonChart from "../Components/HeightComparisonChart";
import WinRateRadarChart from "../Components/WinRateRadarChart";
import WinRateLollipopChart from "../Components/WinRateLollipopChart";
import FunFactsSection from "../Components/FunFactsSection";

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
        <main className="flex items-center gap-5 min-h-screen bg-gray-50 p-2 md:p-2">
            <div className="w-2/3 flex flex-col justify-start gap-15">
                {/* Header and Indicators */}
                <div className="flex justify-between w-full h-auto">
                    <div className = "w-90 p-3">
                        <h1 className="text-2xl font-semibold text-gray-900 border-l-4 border-blue-600 pl-4 tracking-tight text-wrap">
                            Olympic Excellence: Brazil, Japan, Italy, and France Trends from 1924 to 2020
                        </h1>
                    </div>
                    <Indicator cardHead="Total Athletes" cardValue="2,840" />
                    <Indicator cardHead="Total Gold Medals" cardValue="538" />
                </div>
                
                {/* Main Graph */}
                <div>
                    {chartData ? (
                        <DashboardMainGraph chartData={chartData} onNavigate={() => onNavigate('story2')} />
                    ) : (
                        <div className="bg-white p-10 rounded-3xl text-center shadow-lg">
                            No data available for the main graph.
                        </div>
                    )}
                </div>

                {/* Fun Facts Section (Under Main Graph) */}
                {/* <FunFactsSection /> */}
            </div>

            {/* Side Widgets */}
            <div className="flex flex-col gap-5 w-1/3">
                <div className="h-100">
                    <HeightComparisonChart 
                        data={chartData?.heightStats} 
                        onNavigate={() => onNavigate('story1')} 
                    />
                </div>
                <div className="h-75">
                    <WinRateLollipopChart                                                                          
                        data={chartData?.winRateStats}                                                             
                        onNavigate={() => onNavigate('story3')}                                                    
                    />
                </div>
            </div>
        </main>
    );
};

export default Home;
