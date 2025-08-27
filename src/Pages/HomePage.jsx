import React from 'react';
import MagicBento from '../components/MagicBento';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="home-container">
      <div className="hero-content">
        <h1 className="hero-title">Welcome to Alumni-Connect</h1>
        <p className="hero-subtitle">
          "Come and connect for your bright Future" 🚀
        </p>
      </div>
      <MagicBento 
        textAutoHide={true}
        enableStars={true}
        enableSpotlight={true}
        enableBorderGlow={true}
        spotlightRadius={300}
        particleCount={12}
        glowColor="132, 0, 255"
      />
    </div>
  );
};

export default HomePage;