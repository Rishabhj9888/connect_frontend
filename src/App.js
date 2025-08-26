import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PillNav from "./components/PillNav";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import DashboardRouter from "./Pages/DashboardRouter";
import LightRays from "./components/LightRays";
import HomePage from "./Pages/HomePage"; // Import the new HomePage component
import './App.css'; 
import logo from './assets/logo.png';

function App() {
  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Login', href: '/login' },
    { label: 'Register', href: '/register' }
  ];

  return (
    <Router>
      <div className="app-container">
        <LightRays
          className="app-background"
          raysOrigin="top-center"
          raysColor="#4a4a8a"
          raysSpeed={0.8}
          lightSpread={0.7}
          rayLength={1.5}
          mouseInfluence={0.05}
        />
        <div className="content-wrap">
          <header className="app-header">
            <PillNav
              logo={logo}
              logoAlt="Connect Logo"
              items={navItems}
              baseColor="#ffffff"
              pillColor="#0D0D0D"
              hoveredPillTextColor="#0D0D0D"
              pillTextColor="#ffffff"
            />
          </header>
          <Routes>
            {/* Replace the old main element with the new HomePage component */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<DashboardRouter />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;