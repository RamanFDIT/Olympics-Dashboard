import { useState } from "react";
import Home from "./Pages/Home";
import Story1 from "./Pages/Story1";
import Story2 from "./Pages/Story2";
import NavBar from "./Components/NavBar";

function App() {
  const [isCompact, setIsCompact] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar - Pass setCurrentPage to allow navigation from Nav */}
      <NavBar 
        isCompact={isCompact} 
        setIsCompact={setIsCompact} 
        onNavigate={setCurrentPage}
      />
      
      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${isCompact ? 'ml-20' : 'ml-64'} overflow-auto`}>
        {currentPage === 'home' && <Home onNavigate={setCurrentPage} />}
        {currentPage === 'story1' && <Story1 />}
        {currentPage === 'story2' && <Story2 />}
      </div>
    </div>
  );
}

export default App;
