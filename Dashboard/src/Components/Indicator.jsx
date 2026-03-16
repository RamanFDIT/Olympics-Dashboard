const Indicator = ({ cardHead, cardValue }) => {
    return(
        <div className="bg-white p-6 rounded-3xl shadow-xl border border-gray-100 flex flex-col justify-center min-w-[220px] h-[120px] hover:scale-[1.02] transition-transform duration-300">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 border-l-2 border-blue-500 pl-3">
                {cardHead}
            </p>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                {cardValue}
            </h2>
        </div>
    );
};

export default Indicator;
