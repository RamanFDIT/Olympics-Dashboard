import { Zap } from 'lucide-react';

const FunFactsSection = () => {
    const facts = [
        { 
            title: "Titan of the Court", 
            desc: "Frédéric Weis (France) is the tallest athlete in our records, standing at 218cm (7'2\")." 
        },
        { 
            title: "Home Field Boost", 
            desc: "Japan more than doubled its historical average by winning 58 medals as the 2020 host." 
        },
        { 
            title: "Conversion King", 
            desc: "Italy dominates Fencing with a staggering 45.5% athlete-to-medal conversion rate." 
        }
    ];

    return (
        <div className="mt-8 bg-white p-8 rounded-3xl shadow-xl border border-gray-100 hover:scale-[1.01] transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-amber-100 rounded-xl text-amber-600">
                    <Zap size={20} fill="currentColor" />
                </div>
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Olympic Insights & Outliers</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {facts.map((fact, index) => (
                    <div key={index} className="flex flex-col border-l-2 border-blue-500 pl-5 py-1 group">
                        <span className="text-[10px] font-black text-blue-600 uppercase mb-1 tracking-tighter opacity-70 group-hover:opacity-100 transition-opacity">
                            {fact.title}
                        </span>
                        <p className="text-sm text-gray-700 font-semibold leading-relaxed">
                            {fact.desc}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FunFactsSection;
