import React, { useRef, useEffect } from 'react';
// The Link component is no longer needed
import './MagicBento.css';

const cardData = [
  {
    label: 'Insights',
    title: 'Powerful Search',
    description: 'Instantly find alumni by college, company, or name.',
  },
  {
    label: 'Overview',
    title: 'Admin Dashboard',
    description: 'A centralized view for managing the entire alumni database.',
  },
  {
    label: 'Connectivity',
    title: 'Build Your Network',
    description: 'Discover where your fellow alumni are working and build lasting professional connections.',
  },
  {
    label: 'Efficiency',
    title: 'Streamlined Profiles',
    description: 'Clean, easy-to-read profiles that give you the information you need, fast.',
  },
  {
    label: 'Collaboration',
    title: 'Community Growth',
    description: 'Help grow the network by contributing and keeping your profile up-to-date.',
  },
  {
    label: 'Protection',
    title: 'Secure & Private',
    description: 'Your data is protected with enterprise-grade security measures.',
  },
];

// Updated to render a div instead of a Link
const Card = ({ label, title, description }) => {
  return (
    <div className="card card--border-glow">
      <div className="card__header">
        <span className="card__label">{label}</span>
      </div>
      <div className="card__content">
        <h3 className="card__title">{title}</h3>
        <p className="card__description">{description}</p>
      </div>
    </div>
  );
};

const MagicBento = () => {
  const gridRef = useRef(null);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const handleMouseMove = (e) => {
      const cards = grid.querySelectorAll('.card');
      cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--glow-x', `${x}px`);
        card.style.setProperty('--glow-y', `${y}px`);
        card.style.setProperty('--glow-intensity', '1');
      });
    };

    const handleMouseLeave = () => {
        const cards = grid.querySelectorAll('.card');
        cards.forEach(card => {
            card.style.setProperty('--glow-intensity', '0');
        });
    };

    grid.addEventListener('mousemove', handleMouseMove);
    grid.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      grid.removeEventListener('mousemove', handleMouseMove);
      grid.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div className="bento-section">
      <div className="card-grid" ref={gridRef}>
        {cardData.map((card, index) => (
          <Card key={index} {...card} />
        ))}
      </div>
    </div>
  );
};

export default MagicBento;