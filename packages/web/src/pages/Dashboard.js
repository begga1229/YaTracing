import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './Dashboard.css';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { projects } = useSelector(state => state.projects || { projects: [] });

  useEffect(() => {
    // Fetch dashboard data
  }, [dispatch]);

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <div className="dashboard-grid">
        <div className="card">
          <h3>Aktif Projeler</h3>
          <p className="stat">12</p>
        </div>
        <div className="card">
          <h3>Takım Üyeleri</h3>
          <p className="stat">45</p>
        </div>
        <div className="card">
          <h3>Tamamlanan İşler</h3>
          <p className="stat">234</p>
        </div>
        <div className="card">
          <h3>Malzeme Envanteri</h3>
          <p className="stat">1,234</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;