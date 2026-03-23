import logo from '../assets/logo.svg';
import datasetURL from '../assets/CleanedDataset.csv';
import Papa from 'papaparse';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
    LayoutDashboard, 
    BookOpen, 
    Database, 
    Download, 
    Menu, 
    ChevronDown,
    ChevronRight,
    ArrowDownToLine
} from 'lucide-react';

const NavBar = ({ isCompact, setIsCompact }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [open, setOpen] = useState(location.pathname.startsWith('/story'));

    const handleClick = () => {
        if (!isCompact) setOpen(!open);
    }

    const handleExport = (type) => {
        if (type === 'image') {
            const canvases = document.querySelectorAll('canvas');
            if (canvases.length === 0) return;

            // Calculate total height and max width
            let totalHeight = 0;
            let maxWidth = 0;
            const padding = 20;
            canvases.forEach(c => {
                totalHeight += c.height + padding;
                if (c.width > maxWidth) maxWidth = c.width;
            });

            const merged = document.createElement('canvas');
            merged.width = maxWidth;
            merged.height = totalHeight;
            const ctx = merged.getContext('2d');
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, merged.width, merged.height);

            let yOffset = 0;
            canvases.forEach(c => {
                ctx.drawImage(c, 0, yOffset);
                yOffset += c.height + padding;
            });

            const link = document.createElement('a');
            link.download = 'chart_export.png';
            link.href = merged.toDataURL('image/png');
            link.click();
        } else if (type === 'csv') {
            const link = document.createElement('a');
            link.href = datasetURL;
            link.download = 'olympics_data.csv';
            link.click();
        } else if (type === 'json') {
            Papa.parse(datasetURL, {
                download: true,
                header: true,
                dynamicTyping: true,
                complete: (results) => {
                    const blob = new Blob([JSON.stringify(results.data, null, 2)], { type: 'application/json' });
                    const link = document.createElement('a');
                    link.href = URL.createObjectURL(blob);
                    link.download = 'olympics_data.json';
                    link.click();
                    URL.revokeObjectURL(link.href);
                },
            });
        }
    };

    const getNavItemClasses = (isActive) => 
        `flex items-center gap-4 px-4 py-3 rounded-xl transition-all cursor-pointer font-medium ${
            isCompact ? 'justify-center px-0 mx-2' : ''
        } ${
            isActive 
                ? 'bg-blue-50 text-blue-700 hover:bg-blue-100' 
                : 'text-gray-700 hover:bg-slate-200'
        }`;

    return (
        <nav className={`${isCompact ? 'w-20' : 'w-50'} h-screen bg-slate-100 flex flex-col fixed left-0 top-0 z-50 border-r border-slate-200 transition-all duration-300`}>
            {/* Header / Hamburger Section */}
            <div className={`p-4 flex items-center ${isCompact ? 'justify-center' : 'justify-between'} border-b border-slate-200 h-20`}>
                {!isCompact && (
                    <img 
                        className="h-10 w-auto cursor-pointer" 
                        src={logo} 
                        alt="Logo" 
                        onClick={() => navigate('/')}
                    />
                )}
                <button 
                    onClick={() => setIsCompact(!isCompact)}
                    className="p-2 hover:bg-slate-200 rounded-lg transition-colors text-gray-600"
                >
                    <Menu size={24} />
                </button>
            </div>

            {/* Navigation Links */}
            <div className="flex-1 flex flex-col p-3 gap-2 overflow-y-auto overflow-x-hidden">
                <div 
                    className={getNavItemClasses(location.pathname === '/')} 
                    title="Dashboard"
                    onClick={() => navigate('/')}
                >
                    <div className={`min-w-6 flex justify-center ${location.pathname === '/' ? 'text-blue-700' : 'text-blue-600'}`}>
                        <LayoutDashboard size={22} />
                    </div>
                    {!isCompact && <span className="whitespace-nowrap">Dashboard</span>}
                </div>

                {/* Expandable Story Section */}
                <div>
                    <div className={getNavItemClasses(location.pathname.startsWith('/story'))} onClick={handleClick} title="Story">
                        <div className={`min-w-6 flex justify-center ${location.pathname.startsWith('/story') ? 'text-blue-700' : 'text-green-600'}`}>
                            <BookOpen size={22} />
                        </div>
                        {!isCompact && (
                            <>
                                <p className="flex-1 whitespace-nowrap">Story</p>
                                <div className="transition-transform duration-300">
                                    {open ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                                </div>
                            </>
                        )}
                    </div>
                    
                    {!isCompact && (
                        <div className={`flex flex-col gap-1 pl-10 mt-1 overflow-hidden transition-all duration-300 ease-in-out ${open ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                            <a 
                                className={`text-xs py-2 pr-2 border-l-2 pl-4 transition-all cursor-pointer ${
                                    location.pathname === '/story1' 
                                        ? 'text-blue-600 border-blue-500 font-bold' 
                                        : 'text-gray-500 hover:text-black border-slate-300 hover:border-black font-medium'
                                }`}
                                onClick={() => navigate('/story1')}
                            >
                                Athlete Physical Attributes
                            </a>
                            <a 
                                className={`text-xs py-2 pr-2 border-l-2 pl-4 transition-all cursor-pointer ${
                                    location.pathname === '/story2' 
                                        ? 'text-blue-600 border-blue-500 font-bold' 
                                        : 'text-gray-500 hover:text-black border-slate-300 hover:border-black font-medium'
                                }`}
                                onClick={() => navigate('/story2')}
                            >
                                Home Field Advantage
                            </a>
                            <a 
                                className={`text-xs py-2 pr-2 border-l-2 pl-4 transition-all cursor-pointer ${
                                    location.pathname === '/story3' 
                                        ? 'text-blue-600 border-blue-500 font-bold' 
                                        : 'text-gray-500 hover:text-black border-slate-300 hover:border-black font-medium'
                                }`}
                                onClick={() => navigate('/story3')}
                            >
                                Specialization & Win Rates
                            </a>
                        </div>
                    )}
                </div>
            </div>

            {/* Footer / Actions Section */}
            <div className="p-4 border-t border-slate-200">
                {isCompact ? (
                    <div className="flex justify-center cursor-pointer p-3 hover:bg-slate-200 rounded-xl text-gray-600" title="Download Image" onClick={() => handleExport('image')}>
                        <ArrowDownToLine size={22} />
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-2 flex items-center gap-2">
                           <Download size={12} /> Export Data
                        </p>
                        <div className="relative group">
                            <select
                            value=""
                            onChange={(e) => handleExport(e.target.value)}
                            className="w-full bg-white border border-slate-300 text-sm py-2 px-3 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer transition-all"
                        >
                                <option value="" disabled>Select format...</option>
                                <option value="image">Download Image</option>
                                <option value="csv">Export as CSV</option>
                                <option value="json">Export as JSON</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 group-hover:text-blue-500 transition-colors">
                                <ChevronDown size={16} />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default NavBar;
