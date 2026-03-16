

const Indicator = ({ cardHead, cardValue }) => {
    return(
        <div className = "w-90 h-62 rounded-3xl bg-white drop-shadow-xl mb-2">
            <h2>{cardHead}</h2>
            <p>{cardValue}</p>
        </div>
    );
};

export default Indicator;