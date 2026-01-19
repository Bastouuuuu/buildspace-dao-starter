import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import PlayerDashboard from './components/PlayerDashboard';
import ClanDashboard from './components/ClanDashboard';

const App = () => {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/player/:playerTag" element={<PlayerDashboard />} />
          <Route path="/clan/:clanTag" element={<ClanDashboard />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
