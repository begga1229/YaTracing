import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="header-content">
        <h2>YaTracing</h2>
        <div className="header-actions">
          <button className="btn-notification">🔔</button>
          <button className="btn-profile">👤</button>
        </div>
      </div>
    </header>
  );
};

export default Header;