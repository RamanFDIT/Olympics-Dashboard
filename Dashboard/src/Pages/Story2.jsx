const Story2 = () => {
    return (
        <div className="p-10 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold mb-6">Detailed Analysis: France vs. Italy</h1>
            <p className="text-gray-600 mb-8">
                Welcome to the drill-down view. This page will provide a deeper look into the medal distribution, 
                athlete stats, and historic performance trends for France and Italy during their Olympic hosting years.
            </p>
            {/* Future detailed charts will go here */}
            <div className="bg-white p-20 rounded-3xl border-2 border-dashed border-gray-200 text-center text-gray-400">
                Drill-down Content Loading...
            </div>
        </div>
    );
};

export default Story2;
