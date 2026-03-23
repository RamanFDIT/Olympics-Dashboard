import { useEffect, useState, useMemo } from "react";
import Papa from 'papaparse';
import datasetURL from '../assets/CleanedDataset.csv';

const useOlympicsData = (sportFilter = null, yearRange = null) => {
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

        // --- STORY 1: Home Field Advantage Data ---
        const hostCountries = ['France', 'Italy'];
        const hostStatusMap = {};
        rawData.forEach(row => {
            if (isTrue(row.is_host)) {
                const year = Math.floor(Number(row.year));
                hostStatusMap[`${row.country}|${year}`] = true;
            }
        });

        const medalMap = {};
        rawData.forEach(row => {
            if (row.country && hostCountries.includes(row.country)) {
                const country = row.country;
                const year = Math.floor(Number(row.year));
                if (!medalMap[country]) medalMap[country] = {};
                if (!medalMap[country][year]) medalMap[country][year] = 0;
                if (isTrue(row.won_medal)) medalMap[country][year] += 1;
            }
        });

        const labels = [];
        const avgHostMedals = [];
        const avgNonHostMedals = [];

        hostCountries.forEach(country => {
            let hostTotal = 0, hostYears = 0;
            let nonHostTotal = 0, nonHostYears = 0;
            if (medalMap[country]) {
                Object.entries(medalMap[country]).forEach(([yearStr, medals]) => {
                    const wasHostThisYear = hostStatusMap[`${country}|${yearStr}`];
                    if (wasHostThisYear) { hostTotal += medals; hostYears++; }
                    else { nonHostTotal += medals; nonHostYears++; }
                });
                labels.push(country);
                avgHostMedals.push(hostYears > 0 ? (hostTotal / hostYears) : 0);
                avgNonHostMedals.push(nonHostYears > 0 ? (nonHostTotal / nonHostYears) : 0);
            }
        });

        // --- STORY 2: Height Comparison Data ---
        const heightCountries = ['Brazil', 'Japan', 'Italy', 'France'];
        const heightSums = {};
        const heightCounts = {};
        let totalHeightSum = 0;
        let totalHeightCount = 0;

        rawData.forEach(row => {
            const h = Number(row.height);
            if (h && !isNaN(h)) {
                totalHeightSum += h;
                totalHeightCount++;
                if (heightCountries.includes(row.country)) {
                    heightSums[row.country] = (heightSums[row.country] || 0) + h;
                    heightCounts[row.country] = (heightCounts[row.country] || 0) + 1;
                }
            }
        });

        const countryAvgs = heightCountries.map(c => 
            heightCounts[c] > 0 ? (heightSums[c] / heightCounts[c]) : 0
        );
        const globalAvg = totalHeightCount > 0 ? (totalHeightSum / totalHeightCount) : 0;

        // --- STORY 1 DETAIL: Physical Stats (Bubble + Histogram) ---
        const physCountries = ['Brazil', 'Japan', 'Italy', 'France'];
        const binSize = 2;
        const binMin = 135;
        const binMax = 220;
        const bins = [];
        for (let b = binMin; b <= binMax; b += binSize) bins.push(b);

        // Collect unique sports and years for filter dropdowns
        const sportsSet = new Set();
        const yearsSet = new Set();
        const yearCountsMap = {};
        rawData.forEach(row => {
            if (physCountries.includes(row.country)) {
                if (row.sport) sportsSet.add(row.sport);
                const y = Number(row.year);
                if (y) {
                    yearsSet.add(y);
                    yearCountsMap[y] = (yearCountsMap[y] || 0) + 1;
                }
            }
        });
        const sportsList = [...sportsSet].sort();
        const yearsList = [...yearsSet].sort((a, b) => a - b);
        const yearCounts = yearCountsMap;

        // { country: { bin: { athletes: Set, medals: number } } }
        const physBins = {};
        physCountries.forEach(c => {
            physBins[c] = {};
            bins.forEach(b => { physBins[c][b] = { athletes: new Set(), medals: 0 }; });
        });

        let physHeightSum = 0, physHeightCount = 0;
        rawData.forEach(row => {
            const h = Number(row.height);
            if (!h || isNaN(h) || !physCountries.includes(row.country)) return;
            // Apply sport filter if set
            if (sportFilter && row.sport !== sportFilter) return;
            // Apply year range filter if set
            const y = Number(row.year);
            if (yearRange && (y < yearRange[0] || y > yearRange[1])) return;
            physHeightSum += h;
            physHeightCount++;
            const bin = Math.floor((h - binMin) / binSize) * binSize + binMin;
            if (bin < binMin || bin > binMax) return;
            const entry = physBins[row.country][bin];
            if (!entry) return;
            entry.athletes.add(row.athlete_id);
            if (isTrue(row.won_medal)) entry.medals++;
        });

        const physColors = [
            { bg: 'rgba(230, 159, 0, 0.5)', border: 'rgb(230, 159, 0)' },
            { bg: 'rgba(86, 180, 233, 0.5)', border: 'rgb(86, 180, 233)' },
            { bg: 'rgba(0, 158, 115, 0.5)', border: 'rgb(0, 158, 115)' },
            { bg: 'rgba(204, 121, 167, 0.5)', border: 'rgb(204, 121, 167)' },
        ];

        const bubbleDatasets = physCountries.map((country, i) => ({
            label: country,
            data: bins
                .map(b => {
                    const e = physBins[country][b];
                    const count = e.athletes.size;
                    if (count === 0) return null;
                    return { x: b + binSize / 2, y: count, r: Math.max(3, Math.sqrt(e.medals) * 4), _medals: e.medals };
                })
                .filter(Boolean),
            backgroundColor: physColors[i].bg,
            borderColor: physColors[i].border,
            borderWidth: 1,
        }));

        const histogramDatasets = physCountries.map((country, i) => ({
            label: country,
            data: bins.map(b => ({ x: b + binSize / 2, y: physBins[country][b].athletes.size })),
            backgroundColor: physColors[i].bg,
            borderColor: physColors[i].border,
            borderWidth: 1,
            barPercentage: 1.0,
            categoryPercentage: 1.0,
        }));

        const physicalStats = {
            bubbleDatasets,
            histogramData: { datasets: histogramDatasets },
            avgHeight: physHeightCount > 0 ? physHeightSum / physHeightCount : 0,
            sportsList,
            yearsList,
            yearCounts,
        };

        // --- STORY 3: Win Rate Analysis (Radar Chart) ---
        const winRateSports = ['Fencing', 'Volleyball', 'Gymnastics'];
        const winRateCountries = ['Brazil', 'Japan', 'Italy', 'France'];
        
        // Structure: { Country: { Sport: { total: Set(athlete_ids), winners: Set(athlete_ids) } } }
        const winStats = {};
        winRateCountries.forEach(c => {
            winStats[c] = {};
            winRateSports.forEach(s => {
                winStats[c][s] = { total: new Set(), winners: new Set() };
            });
        });

        rawData.forEach(row => {
            if (winRateCountries.includes(row.country)) {
                // Normalize sport names for matching (e.g. "Artistic Gymnastics" -> "Gymnastics")
                let sport = row.sport;
                if (sport === "Artistic Gymnastics") sport = "Gymnastics";
                
                if (winRateSports.includes(sport)) {
                    const { country, athlete_id, won_medal } = row;
                    winStats[country][sport].total.add(athlete_id);
                    if (isTrue(won_medal)) {
                        winStats[country][sport].winners.add(athlete_id);
                    }
                }
            }
        });

        const radarDatasets = winRateCountries.map((country, index) => {
            const colors = [
                "rgba(230, 159, 0, 0.4)", // Orange
                "rgba(86, 180, 233, 0.4)", // Sky Blue
                "rgba(0, 158, 115, 0.4)",  // Bluish Green
                "rgba(204, 121, 167, 0.4)" // Reddish Purple
            ];
            const borderColors = [
                "rgb(230, 159, 0)",
                "rgb(86, 180, 233)",
                "rgb(0, 158, 115)",
                "rgb(204, 121, 167)"
            ];

            return {
                label: country,
                data: winRateSports.map(sport => {
                    const stats = winStats[country][sport];
                    return stats.total.size > 0 
                        ? (stats.winners.size / stats.total.size) * 100 
                        : 0;
                }),
                backgroundColor: colors[index],
                borderColor: borderColors[index],
                borderWidth: 2,
                pointRadius: 3,
                pointHoverRadius: 6,
                pointBackgroundColor: borderColors[index],
                pointBorderColor: "#fff",
                pointBorderWidth: 1,
            };
        });

        // --- STORY 3 DETAIL: Win Rates for ALL sports ---
        const wrCountries = ['Brazil', 'Japan', 'Italy', 'France'];
        const allWinStats = {}; // { country: { sport: { total: Set, winners: Set } } }
        const allSportsSet = new Set();
        wrCountries.forEach(c => { allWinStats[c] = {}; });

        rawData.forEach(row => {
            if (!wrCountries.includes(row.country) || !row.sport) return;
            let sport = row.sport;
            if (sport === "Artistic Gymnastics") sport = "Gymnastics";
            allSportsSet.add(sport);
            const cs = allWinStats[row.country];
            if (!cs[sport]) cs[sport] = { total: new Set(), winners: new Set() };
            cs[sport].total.add(row.athlete_id);
            if (isTrue(row.won_medal)) cs[sport].winners.add(row.athlete_id);
        });

        const allSportsList = [...allSportsSet].sort();
        const winRatesBySport = {}; // { country: { sport: rate } }
        wrCountries.forEach(c => {
            winRatesBySport[c] = {};
            allSportsList.forEach(s => {
                const st = allWinStats[c][s];
                winRatesBySport[c][s] = st && st.total.size > 0
                    ? (st.winners.size / st.total.size) * 100
                    : 0;
            });
        });

        const winRateAllSports = { allSports: allSportsList, rates: winRatesBySport };

        return {
            physicalStats,
            winRateAllSports,
            homeAdvantage: {
                labels,
                datasets: [
                    {
                        label: "Avg Medals (When Hosting)",
                        data: avgHostMedals,
                        backgroundColor: "rgba(230, 159, 0, 0.8)",
                        borderColor: "rgb(230, 159, 0)",
                        borderWidth: 1
                    },
                    {
                        label: 'Avg Medals (Not Hosting)',
                        data: avgNonHostMedals,
                        backgroundColor: "rgba(86, 180, 233, 0.8)",
                        borderColor: "rgb(86, 180, 233)",
                        borderWidth: 1
                    }
                ]
            },
            heightStats: {
                labels: [...heightCountries, 'Olympics Avg'],
                datasets: [{
                    label: 'Average Height (cm)',
                    data: [...countryAvgs, globalAvg],
                    backgroundColor: [
                        ...heightCountries.map(() => "rgba(86, 180, 233, 0.7)"),
                        "rgba(230, 159, 0, 0.9)" // Global average is Orange
                    ],
                    borderColor: [
                        ...heightCountries.map(() => "rgb(86, 180, 233)"),
                        "rgb(230, 159, 0)"
                    ],
                    borderWidth: 1
                }]
            },
            winRateStats: {
                labels: winRateSports,
                datasets: radarDatasets
            }
        };
    }, [rawData, sportFilter, yearRange]);

    return { chartData, loading };
}

export default useOlympicsData;
