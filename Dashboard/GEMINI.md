# Gemini Context: Olympic Data Visualization Dashboard

## 🚀 Project Overview
A React-based data visualization dashboard built with **Vite**, **Tailwind CSS**, and **Chart.js**. The project visualizes Olympic performance trends for Brazil, Japan, Italy, and France from 1924 to 2020.

## 📊 Data Infrastructure
- **Source**: `src/assets/CleanedDataset.csv` (14,002 rows).
- **Core Hook**: `src/hooks/useOlympicsData.jsx`
    - Parses CSV via `papaparse` with dynamic typing.
    - **Unique Participants**: 2,840.
    - **Total Gold Medals**: 538.
    - **Performance Logic**: Groups data into three distinct "Stories" for the dashboard.

## 🎨 UI & Design Standards
- **Navigation**: Collapsible Sidebar (`NavBar.jsx`) with `lucide-react` icons.
- **Color Palette**: **Okabe-Ito Palette** (Accessible/Color-blind friendly).
    - Hosted/Benchmark: Orange (`rgba(230, 159, 0, 0.8)`)
    - Standard/Non-hosted: Sky Blue (`rgba(86, 180, 233, 0.8)`)
- **Components**: Standardized with `rounded-3xl`, `shadow-xl`, and `border-gray-100`.

## 📈 Dashboard Layout (`Home.jsx`)
1.  **Main Graph**: `DashboardMainGraph.jsx` (Grouped Bar Chart)
    - Compares France vs. Italy performance during hosting vs. non-hosting years.
    - Navigates to `Story2.jsx`.
2.  **Height Chart**: `HeightComparisonChart.jsx` (Horizontal Bar)
    - Avg athlete heights for the 4 countries vs. Global Avg.
    - Navigates to `Story1.jsx`.
3.  **Efficiency Gaps**: `WinRateLollipopChart.jsx` (Thick Grouped Bars)
    - Conversion rates for Fencing, Volleyball, and Gymnastics.
    - Navigates to `Story3.jsx`.
4.  **Metric Indicators**: `Indicator.jsx` (Total Athletes, Total Gold Medals).
5.  **Insights**: `FunFactsSection.jsx` (Outlier data highlights).

## 🗺️ Routing System
Simple state-based routing in `App.jsx`:
- `'home'`: Main Dashboard.
- `'story1'`: Physical Attributes analysis.
- `'story2'`: Home Field Advantage drill-down.
- `'story3'`: Specialization & Win Rates drill-down.

## 🛠️ Pending / Future Tasks
- [ ] Implement detailed charts inside `Story1.jsx`, `Story2.jsx`, and `Story3.jsx`.
- [ ] Add data filtering by year range in the sidebar.
- [ ] Implement the "Dataset" table view.
