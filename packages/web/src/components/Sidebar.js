import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="logo">
        <h1>🏗️ YaTracing</h1>
      </div>
      <nav className="nav">
        <Link to="/" className="nav-item">📊 Dashboard</Link>
        <Link to="/projects" className="nav-item">🏢 Projeler</Link>
        <Link to="/teams" className="nav-item">👥 Ekipler</Link>
        <Link to="/materials" className="nav-item">📦 Malzemeler</Link>
        <Link to="/equipment" className="nav-item">🚜 Ekipmanlar</Link>
        <Link to="/reports" className="nav-item">📈 Raporlar</Link>
      </nav>
    </aside>
  );
};

export default Sidebar;