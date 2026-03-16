import logo from '../assets/logo.svg';
import { useState } from 'react';
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

const NavBar = ({ isCompact, setIsCompact, onNavigate }) => {
    const [open, setOpen] = useState(false);

    const handleClick = () => {
        if (!isCompact) setOpen(!open);
    }

    const navItemClasses = `flex items-center gap-4 px-4 py-3 text-gray-700 hover:bg-slate-200 rounded-xl transition-all cursor-pointer font-medium ${isCompact ? 'justify-center px-0 mx-2' : ''}`;

    return (
        <nav className={`${isCompact ? 'w-20' : 'w-64'} h-screen bg-slate-100 flex flex-col fixed left-0 top-0 z-50 border-r border-slate-200 transition-all duration-300`}>
            {/* Header / Hamburger Section */}
            <div className={`p-4 flex items-center ${isCompact ? 'justify-center' : 'justify-between'} border-b border-slate-200 h-20`}>
                {!isCompact && (
                    <img 
                        className="h-10 w-auto cursor-pointer" 
                        src={logo} 
                        alt="Logo" 
                        onClick={() => onNavigate('home')}
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
                    className={navItemClasses} 
                    title="Dashboard"
                    onClick={() => onNavigate('home')}
                >
                    <div className="min-w-6 flex justify-center text-blue-600">
                        <LayoutDashboard size={22} />
                    </div>
                    {!isCompact && <span className="whitespace-nowrap">Dashboard</span>}
                </div>

                {/* Expandable Story Section */}
                <div>
                    <div className={navItemClasses} onClick={handleClick} title="Story">
                        <div className="min-w-6 flex justify-center text-green-600">
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
                            <a className="text-xs text-gray-500 hover:text-black py-2 pr-2 border-l-2 border-slate-300 pl-4 hover:border-black transition-all">
                                Japan's Volleyball
                            </a>
                            <a 
                                className="text-xs text-gray-500 hover:text-black py-2 pr-2 border-l-2 border-slate-300 pl-4 hover:border-black transition-all cursor-pointer"
                                onClick={() => onNavigate('story2')}
                            >
                                Home Advantage Analysis
                            </a>
                            <a className="text-xs text-gray-500 hover:text-black py-2 pr-2 border-l-2 border-slate-300 pl-4 hover:border-black transition-all">
                                Win Rate Analysis
                            </a>
                        </div>
                    )}
                </div>

                <div className={navItemClasses} title="Dataset">
                    <div className="min-w-6 flex justify-center text-purple-600">
                        <Database size={22} />
                    </div>
                    {!isCompact && <span className="whitespace-nowrap">Dataset</span>}
                </div>
            </div>

            {/* Footer / Actions Section */}
            <div className="p-4 border-t border-slate-200">
                {isCompact ? (
                    <div className="flex justify-center cursor-pointer p-3 hover:bg-slate-200 rounded-xl text-gray-600" title="Export">
                        <ArrowDownToLine size={22} />
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-2 flex items-center gap-2">
                           <Download size={12} /> Export Data
                        </p>
                        <div className="relative group">
                            <select className="w-full bg-white border border-slate-300 text-sm py-2 px-3 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer transition-all">
                                <option>Download Image</option>
                                <option>Export as CSV</option>
                                <option>Export as JSON</option>
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
