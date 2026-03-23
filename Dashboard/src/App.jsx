import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Story1 from "./Pages/Story1";
import Story2 from "./Pages/Story2";
import Story3 from "./Pages/Story3";
import NavBar from "./Components/NavBar";

function App() {
  const [isCompact, setIsCompact] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <NavBar 
        isCompact={isCompact} 
        setIsCompact={setIsCompact} 
      />
      
      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${isCompact ? 'ml-20' : 'ml-50'} overflow-auto`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/story1" element={<Story1 />} />
          <Route path="/story2" element={<Story2 />} />
          <Route path="/story3" element={<Story3 />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
