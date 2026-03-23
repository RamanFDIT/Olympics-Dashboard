# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

All commands run from `Dashboard/`:

```bash
npm run dev        # Start Vite dev server with HMR
npm run build      # Production build (outputs to dist/)
npm run preview    # Preview production build locally
npm run lint       # ESLint (flat config, v9+)
```

## Architecture

React 19 SPA using Vite 7, Tailwind CSS v4, and Chart.js (via react-chartjs-2). No React Router — routing is state-based (`currentPage` in `App.jsx`).

### Data Flow

CSV (`src/assets/CleanedDataset.csv`, 14k rows) is parsed once on mount via `papaparse` in the `useOlympicsData` hook (`src/hooks/useOlympicsData.jsx`). The hook aggregates raw data into three story datasets using `useMemo`, then passes them as props to chart components. Focus countries: Brazil, Japan, Italy, France (1924-2020).

### Three Story Datasets

1. **Home Advantage** (`homeAdvantage`) — France vs Italy medals during hosting vs non-hosting years
2. **Height Comparison** (`heightStats`) — Average athlete heights per country vs global avg
3. **Win Rate Stats** (`winRateStats`) — Athlete-to-medal conversion for Fencing, Volleyball, Gymnastics

### Pages & Navigation

- `Home.jsx` — Dashboard with summary charts; each chart navigates to its story page via `onNavigate` prop
- `Story1.jsx` — Physical attributes drill-down
- `Story2.jsx` — Home field advantage drill-down
- `Story3.jsx` — Specialization & win rates drill-down

Navigation flows through `App.jsx` state → `NavBar.jsx` sidebar → page components.

## Design Conventions

- **Color palette**: Okabe-Ito (colorblind-friendly). Orange `rgba(230, 159, 0)` for hosted/benchmark, Sky Blue `rgba(86, 180, 233)` for standard. Additional: Bluish Green, Reddish Purple.
- **Card styling**: `rounded-3xl shadow-xl border-gray-100` on white backgrounds
- **Icons**: `lucide-react`
- **Chart.js patterns**: Horizontal bars use `indexAxis: 'y'`. All charts disable `maintainAspectRatio`. Tooltips styled with white background and gray borders.

## Key Files

- `src/hooks/useOlympicsData.jsx` — All data processing logic lives here
- `src/App.jsx` — Routing state and page rendering
- `src/Components/NavBar.jsx` — Sidebar with collapsible story submenu
- `vite.config.js` — Includes CSV in asset pipeline via `assetsInclude`
