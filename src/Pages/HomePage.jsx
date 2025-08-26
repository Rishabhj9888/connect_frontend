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
      <MagicBento />
    </div>
  );
};

export default HomePage;