const Story3 = () => {
    return (
        <div className="p-10 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold mb-6">Story 3: Country Specialization & Win Rates</h1>
            <p className="text-gray-600 mb-8 max-w-2xl text-lg">
                This analysis dives into the "Olympic DNA" of our primary countries. 
                Beyond total medal counts, we explore which nations are most efficient at converting 
                their specialized athletes into medalists in their core sports.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-xl mb-4 text-blue-800">The Italian Fencing Edge</h3>
                    <p className="text-gray-600 leading-relaxed">
                        Italy has long been the powerhouse of Olympic Fencing. With a win rate approaching 45.5%, 
                        nearly 1 in every 2 Italian fencers sent to the Olympics returns with a medal.
                    </p>
                </div>
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-xl mb-4 text-green-800">Japan's Strategic Focus</h3>
                    <p className="text-gray-600 leading-relaxed">
                        Japan's efficiency in Volleyball and Judo is legendary. Their volleyball conversion rate 
                        of 40.7% is a testament to their elite developmental programs, doubling the efficiency of 
                        many European counterparts.
                    </p>
                </div>
            </div>

            <div className="bg-white p-20 rounded-3xl border-2 border-dashed border-gray-200 text-center text-gray-400">
                Detailed Conversion Heatmaps and Athlete Performance Matrix coming soon.
            </div>
        </div>
    );
};

export default Story3;
