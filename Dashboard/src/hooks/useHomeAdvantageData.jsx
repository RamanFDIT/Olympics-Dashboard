import { useEffect, useState, useMemo } from "react";
import Papa from 'papaparse';
import datasetURL from '../assets/CleanedDataset.csv';

const useHomeAdvantageData = (selectedYear = null) => {
    const [rawData, setRawData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Papa.parse(datasetURL, {
            download: true,
            header: true,
            dynamicTyping: true,
            complete: (results) => {
                setRawData(results.data);
                setLoading(false);
            },
            error: (error) => {
                console.error("Error parsing CSV:", error.message);
                setLoading(false);
            }
        });
    }, []);

    const chartData = useMemo(() => {
        if (rawData.length === 0) return null;

        const isTrue = (val) => val === true || String(val).toLowerCase() === 'true';
        const countries = ['Brazil', 'Japan', 'Italy', 'France'];

        // --- Build host status map: "country|year" => true ---
        const hostStatusMap = {};
        const hostEventsMap = new Map();
        rawData.forEach(row => {
            if (isTrue(row.is_host) && countries.includes(row.country)) {
                const year = Math.floor(Number(row.year));
                hostStatusMap[`${row.country}|${year}`] = true;
                const key = `${year}|${row.country}`;
                if (!hostEventsMap.has(key)) {
                    hostEventsMap.set(key, { year, country: row.country });
                }
            }
        });
        const hostEvents = [...hostEventsMap.values()].sort((a, b) => a.year - b.year);

        // --- Compute medals per country per year ---
        // { country: { year: medalCount } }
        const medalsByCountryYear = {};
        countries.forEach(c => { medalsByCountryYear[c] = {}; });

        rawData.forEach(row => {
            if (!countries.includes(row.country)) return;
            const year = Math.floor(Number(row.year));
            if (!year) return;
            // If a specific year is selected, only include that year
            if (selectedYear && year !== selectedYear) return;

            if (!medalsByCountryYear[row.country][year]) {
                medalsByCountryYear[row.country][year] = 0;
            }
            if (isTrue(row.won_medal)) {
                medalsByCountryYear[row.country][year] += 1;
            }
        });

        // --- Compute grouped bar data: hosting vs not hosting ---
        const avgHostMedals = [];
        const avgNonHostMedals = [];

        countries.forEach(country => {
            let hostTotal = 0, hostYears = 0;
            let nonHostTotal = 0, nonHostYears = 0;

            const yearData = medalsByCountryYear[country];
            Object.entries(yearData).forEach(([yearStr, medals]) => {
                const wasHost = hostStatusMap[`${country}|${yearStr}`];
                if (wasHost) {
                    hostTotal += medals;
                    hostYears++;
                } else {
                    nonHostTotal += medals;
                    nonHostYears++;
                }
            });

            avgHostMedals.push(hostYears > 0 ? (hostTotal / hostYears) : 0);
            avgNonHostMedals.push(nonHostYears > 0 ? (nonHostTotal / nonHostYears) : 0);
        });

        return {
            barData: {
                labels: countries,
                datasets: [
                    {
                        label: 'Avg Medals (When Hosting)',
                        data: avgHostMedals,
                        backgroundColor: 'rgba(230, 159, 0, 0.8)',
                        borderColor: 'rgb(230, 159, 0)',
                        borderWidth: 1,
                        borderRadius: 6,
                    },
                    {
                        label: 'Avg Medals (Not Hosting)',
                        data: avgNonHostMedals,
                        backgroundColor: 'rgba(86, 180, 233, 0.8)',
                        borderColor: 'rgb(86, 180, 233)',
                        borderWidth: 1,
                        borderRadius: 6,
                    },
                ]
            },
            hostEvents,
            selectedYear,
        };
    }, [rawData, selectedYear]);

    return { chartData, loading };
};

export default useHomeAdvantageData;
